import { readFile } from 'fs/promises';
import { join } from 'path';
import {
  sendMessage,
  buildPCPSystemPrompt,
  buildSpecialistSystemPrompt,
  ClaudeMessage,
  ModelType,
} from './claude-client';
import {
  Message,
  AssistantResponse,
  ComplexityLevel,
  ConsultationRequest,
  SpecialistResponse,
} from '../types';
import { SPECIALIST_REGISTRY, SpecialistInfo } from './specialist-registry';

export interface SessionContext {
  sessionId: string;
  history: Message[];
  complexityPreference: ComplexityLevel;
}

/**
 * Main orchestration function that handles the full consultation flow
 */
export async function orchestrateResponse(
  userMessage: string,
  context: SessionContext
): Promise<AssistantResponse> {
  // Build conversation history for context
  const conversationContext = formatConversationHistory(context.history);

  // Step 1: Run PCP assessment
  const pcpAssessment = await runPCPAssessment(
    userMessage,
    conversationContext,
    context.complexityPreference
  );

  // Step 2: If specialists are needed, run them in parallel
  if (pcpAssessment.needsSpecialists && pcpAssessment.specialists.length > 0) {
    const specialistResponses = await runSpecialistsInParallel(
      pcpAssessment.specialists,
      pcpAssessment.clinicalContext,
      userMessage
    );

    // Step 3: Synthesize the responses
    const synthesizedResponse = await synthesizeResponses(
      userMessage,
      pcpAssessment,
      specialistResponses,
      context.complexityPreference
    );

    return {
      content: synthesizedResponse,
      specialistsConsulted: pcpAssessment.specialists,
      visuals: [], // TODO: Extract visuals from responses
      complexityLevel: context.complexityPreference,
    };
  }

  // Direct response from PCP (no specialists needed)
  return {
    content: pcpAssessment.directResponse || '',
    specialistsConsulted: [],
    visuals: [],
    complexityLevel: context.complexityPreference,
  };
}

interface PCPAssessmentResult {
  needsSpecialists: boolean;
  specialists: string[];
  clinicalContext: string;
  directResponse?: string;
}

/**
 * Run the PCP assessment to determine if specialists are needed
 */
async function runPCPAssessment(
  userMessage: string,
  conversationContext: string,
  complexity: ComplexityLevel
): Promise<PCPAssessmentResult> {
  const systemPrompt = buildPCPSystemPrompt(complexity, conversationContext);

  const assessmentPrompt = `The patient/family member says:
"${userMessage}"

Please assess this question:
1. Can you provide helpful educational information directly?
2. Would specialist consultation add value?

IMPORTANT - BEDSIDE MANNER FIRST:
- Always start your response by acknowledging the person's feelings and concerns
- Use warm, empathetic language like "I understand this is concerning..." or "It's completely natural to worry about..."
- Never jump straight to clinical definitions or differential diagnoses
- Lead with reassurance when appropriate, then provide educational information

If you can help directly, provide your response (empathy first, then education).
If specialists would help, indicate which ones and why using this format:
SPECIALISTS_NEEDED: [specialist1, specialist2]
CLINICAL_CONTEXT: [Brief clinical summary for specialists]

Then provide any immediate educational information while noting that specialist input is being gathered.`;

  const messages: ClaudeMessage[] = [
    { role: 'user', content: assessmentPrompt },
  ];

  const response = await sendMessage(messages, {
    model: 'sonnet',
    system: systemPrompt,
    maxTokens: 2048,
  });

  // Parse the response to determine if specialists are needed
  const specialistsMatch = response.content.match(
    /SPECIALISTS_NEEDED:\s*\[(.*?)\]/
  );
  const contextMatch = response.content.match(
    /CLINICAL_CONTEXT:\s*\[(.*?)\]/s
  );

  if (specialistsMatch) {
    const specialists = specialistsMatch[1]
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => SPECIALIST_REGISTRY[s]);

    return {
      needsSpecialists: specialists.length > 0,
      specialists,
      clinicalContext: contextMatch ? contextMatch[1].trim() : userMessage,
      directResponse: response.content,
    };
  }

  return {
    needsSpecialists: false,
    specialists: [],
    clinicalContext: '',
    directResponse: response.content,
  };
}

/**
 * Run multiple specialists in parallel
 */
async function runSpecialistsInParallel(
  specialistIds: string[],
  clinicalContext: string,
  originalQuestion: string
): Promise<SpecialistResponse[]> {
  const consultationPromises = specialistIds.map((specialistId) =>
    runSpecialistConsultation(specialistId, clinicalContext, originalQuestion)
  );

  const results = await Promise.allSettled(consultationPromises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<SpecialistResponse> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value);
}

/**
 * Run a single specialist consultation
 */
async function runSpecialistConsultation(
  specialistId: string,
  clinicalContext: string,
  originalQuestion: string
): Promise<SpecialistResponse> {
  const specialist = SPECIALIST_REGISTRY[specialistId];
  if (!specialist) {
    throw new Error(`Unknown specialist: ${specialistId}`);
  }

  // Load the specialist skill file
  const skillContent = await loadSpecialistSkill(specialist.skillPath);

  const systemPrompt = buildSpecialistSystemPrompt(
    specialist.name,
    specialist.scope,
    skillContent
  );

  const consultPrompt = `Consultation Request from Hospitalist:

Clinical Context: ${clinicalContext}

Patient/Family Question: "${originalQuestion}"

Please provide your specialist perspective on this situation, following your output format guidelines.`;

  const messages: ClaudeMessage[] = [{ role: 'user', content: consultPrompt }];

  const response = await sendMessage(messages, {
    model: specialist.model as ModelType,
    system: systemPrompt,
    maxTokens: 2048,
  });

  return {
    specialistId,
    specialistName: specialist.name,
    assessment: response.content,
    recommendations: extractRecommendations(response.content),
    forPatient: extractPatientSummary(response.content),
    confidence: 0.8, // TODO: Extract from response
  };
}

/**
 * Synthesize responses from multiple specialists into a coherent response
 */
async function synthesizeResponses(
  originalQuestion: string,
  pcpAssessment: PCPAssessmentResult,
  specialistResponses: SpecialistResponse[],
  complexity: ComplexityLevel
): Promise<string> {
  const specialistSummaries = specialistResponses
    .map(
      (r) => `
### ${r.specialistName}
${r.assessment}
`
    )
    .join('\n---\n');

  const synthesisPrompt = `You are a hospitalist with excellent bedside manner synthesizing specialist input for a patient/family.

ORIGINAL QUESTION: "${originalQuestion}"

SPECIALIST CONSULTATIONS:
${specialistSummaries}

CRITICAL: Your response MUST follow this emotional structure:

**1. EMPATHY FIRST (2-3 sentences)**
Start by acknowledging the human experience. Examples:
- "I understand this bump is concerning you, and it's completely natural to worry about changes in your body."
- "I can hear how stressful this situation is for you and your family."
- "It's really understandable to have questions about what's happening."
Never jump straight to clinical information.

**2. REASSURANCE (when appropriate)**
If the condition is likely benign, say so gently:
- "The good news is that most bumps like this turn out to be harmless..."
- "While I know this is worrying, this type of symptom is usually..."

**3. EDUCATIONAL INFORMATION**
Then provide the clinical details, adjusted for complexity level: ${complexity}
- Lead with the most likely/benign explanation
- Mention other possibilities without alarming language
- Use "could be" rather than definitive statements

**4. PRACTICAL NEXT STEPS**
- What questions to ask their healthcare team
- What to watch for

**5. CLOSING WITH CARE**
End warmly, not just with disclaimers:
- "Please don't hesitate to bring this up with your care team—they're there to help."
- "Remember, we're here to help you understand, and your doctors can give you answers specific to your situation."

Format your response clearly with headers and bullet points for readability.`;

  const messages: ClaudeMessage[] = [{ role: 'user', content: synthesisPrompt }];

  const response = await sendMessage(messages, {
    model: 'sonnet',
    maxTokens: 3000,
    temperature: 0.7,
  });

  return response.content;
}

/**
 * Format conversation history for context
 */
function formatConversationHistory(messages: Message[]): string {
  if (messages.length === 0) return 'This is a new conversation.';

  const recent = messages.slice(-10); // Last 10 messages for context
  return recent
    .map((m) => {
      const role = m.role === 'user' ? 'Patient/Family' : 'Medical Assistant';
      return `${role}: ${m.content}`;
    })
    .join('\n\n');
}

/**
 * Load a specialist skill file
 */
async function loadSpecialistSkill(skillPath: string): Promise<string> {
  try {
    const fullPath = join(process.cwd(), 'specialists', skillPath);
    const content = await readFile(fullPath, 'utf-8');
    // Remove YAML front matter
    return content.replace(/^---[\s\S]*?---\n/, '');
  } catch (error) {
    console.error(`Failed to load skill file: ${skillPath}`, error);
    return '';
  }
}

/**
 * Extract recommendations from a specialist response
 */
function extractRecommendations(content: string): string[] {
  const recommendations: string[] = [];
  // Simple extraction - look for bullet points after "Recommendations" or "Questions"
  const recSection = content.match(
    /(?:Recommendations|Questions for|Key Points)[\s\S]*?(?=(?:\n##|\n\*\*|$))/i
  );
  if (recSection) {
    const bullets = recSection[0].match(/[-•]\s*(.+)/g);
    if (bullets) {
      recommendations.push(...bullets.map((b) => b.replace(/^[-•]\s*/, '')));
    }
  }
  return recommendations;
}

/**
 * Extract patient-friendly summary from specialist response
 */
function extractPatientSummary(content: string): string {
  // Look for "For the Patient" section
  const patientSection = content.match(
    /For the Patient.*?\n([\s\S]*?)(?=\n##|\n\*\*|$)/i
  );
  if (patientSection) {
    return patientSection[1].trim();
  }
  // Fallback to first paragraph
  const firstPara = content.match(/^[^#\n].*?(?=\n\n|\n#|$)/s);
  return firstPara ? firstPara[0].trim() : '';
}
