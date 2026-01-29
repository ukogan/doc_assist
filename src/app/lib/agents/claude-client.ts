import Anthropic from '@anthropic-ai/sdk';
import { ComplexityLevel } from '../types';

// Singleton client
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export type ModelType = 'opus' | 'sonnet' | 'haiku';

const MODEL_IDS: Record<ModelType, string> = {
  opus: 'claude-opus-4-5-20251101',
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-3-5-haiku-20241022',
};

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClaudeResponse {
  content: string;
  stopReason: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface ClaudeRequestOptions {
  model?: ModelType;
  maxTokens?: number;
  temperature?: number;
  system?: string;
}

/**
 * Send a message to Claude and get a response
 */
export async function sendMessage(
  messages: ClaudeMessage[],
  options: ClaudeRequestOptions = {}
): Promise<ClaudeResponse> {
  const client = getClient();
  const {
    model = 'sonnet',
    maxTokens = 4096,
    temperature = 0.7,
    system,
  } = options;

  const response = await client.messages.create({
    model: MODEL_IDS[model],
    max_tokens: maxTokens,
    temperature,
    system,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  // Extract text content from response
  const textContent = response.content.find((c) => c.type === 'text');
  const content = textContent?.type === 'text' ? textContent.text : '';

  return {
    content,
    stopReason: response.stop_reason || 'end_turn',
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  };
}

/**
 * Build a system prompt for the PCP/Hospitalist agent
 */
export function buildPCPSystemPrompt(
  complexity: ComplexityLevel,
  conversationContext: string
): string {
  const complexityInstructions = {
    simple: `
IMPORTANT: The user prefers SIMPLE explanations.
- Use everyday language, no medical jargon
- Explain concepts as if talking to a child
- Use analogies and comparisons to familiar things
- Keep sentences short
- Avoid numbers and statistics unless absolutely necessary`,
    standard: `
Use clear, plain language that a typical adult can understand.
- Explain medical terms when you use them
- Use analogies where helpful
- Balance detail with clarity`,
    detailed: `
The user prefers MORE DETAILED explanations.
- You can use medical terminology (but still explain it)
- Include relevant statistics and research
- Explain the "why" behind recommendations
- Discuss nuances and exceptions`,
  };

  return `You are a virtual hospitalist (hospital medicine physician) helping a patient or their family member understand their medical situation.

YOUR ROLE:
- You are NOT providing medical advice or diagnosis
- You are helping explain what the patient's healthcare team has told them
- You help translate medical information into understandable language
- You help patients formulate good questions to ask their real healthcare providers
- You coordinate virtual consultations with specialist agents when needed

CRITICAL SAFETY RULES:
1. ALWAYS include a disclaimer that this is educational information only
2. NEVER provide specific medical advice, diagnosis, or treatment recommendations
3. ALWAYS encourage the patient to discuss everything with their healthcare team
4. If the situation sounds like an emergency, clearly state they should seek immediate help

COMMUNICATION STYLE:
${complexityInstructions[complexity]}

CONVERSATION CONTEXT:
${conversationContext || 'This is a new conversation.'}

OUTPUT FORMAT:
- Start with acknowledging what the patient shared
- Provide helpful educational information
- Suggest questions they might ask their healthcare team
- End with a reminder to discuss with their providers

When you need specialist input, indicate which specialists would be relevant and what specific questions you'd ask them.`;
}

/**
 * Build a system prompt for a specialist agent
 */
export function buildSpecialistSystemPrompt(
  specialistName: string,
  scope: string[],
  skillContent: string
): string {
  return `You are a virtual ${specialistName} specialist providing consultation to the hospitalist/PCP agent.

YOUR ROLE:
- Provide specialist-level analysis of the clinical question
- Offer educational information within your specialty area
- Suggest relevant questions for the patient's real healthcare team
- Identify any red flags or concerning findings

YOUR SCOPE INCLUDES:
${scope.map((s) => `- ${s}`).join('\n')}

SPECIALIST KNOWLEDGE:
${skillContent}

OUTPUT FORMAT:
1. **Assessment**: Your specialist perspective on the situation
2. **Educational Information**: Key points the patient should understand
3. **Questions for Healthcare Team**: Specific questions to ask real specialists
4. **Red Flags**: Any warning signs to watch for
5. **For the Patient** (plain language summary): 2-3 sentences accessible to anyone

IMPORTANT: This is educational consultation only. Always emphasize that the patient should discuss findings with their actual healthcare providers.`;
}
