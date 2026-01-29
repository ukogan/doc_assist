import { NextRequest, NextResponse } from 'next/server';
import { getSession, addMessage, getMessages } from '@/app/lib/storage/redis-client';
import { Message, AssistantResponse, ComplexityLevel } from '@/app/lib/types';
import { orchestrateResponse } from '@/app/lib/agents/orchestrator';
import { v4 as uuidv4 } from 'uuid';

// Check if we have the required API key
const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

// Fallback response when API key is not configured
function generateFallbackResponse(
  message: string,
  complexity: ComplexityLevel
): AssistantResponse {
  return {
    content: `Thank you for sharing that with me. I understand you're asking about: "${message.substring(0, 100)}${message.length > 100 ? '...' : ''}"

**Setup Required:** The Claude API key has not been configured yet. Once configured, I'll be able to:
- Consult with virtual specialists (cardiology, neurology, etc.)
- Provide detailed explanations at your preferred complexity level (currently: ${complexity})
- Generate helpful charts and diagrams
- Help you formulate questions for your healthcare team

To complete setup, add your ANTHROPIC_API_KEY to the environment variables.

**Important:** This tool provides educational information only and is not a substitute for professional medical advice.`,
    specialistsConsulted: [],
    visuals: [],
    complexityLevel: complexity,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Extract session from cookie
    const sessionId = request.cookies.get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'No session' }, { status: 401 });
    }

    const session = await getSession(sessionId);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const { message, complexityPreference = 'standard' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Store user message
    const userMessage: Message = {
      id: uuidv4(),
      sessionId,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    await addMessage(sessionId, userMessage);

    // Get conversation history for context
    const history = await getMessages(sessionId);

    // Generate response - use orchestrator if API key is available
    let response: AssistantResponse;

    if (hasApiKey) {
      try {
        response = await orchestrateResponse(message, {
          sessionId,
          history,
          complexityPreference: complexityPreference as ComplexityLevel,
        });
      } catch (orchError) {
        console.error('Orchestrator error, falling back:', orchError);
        response = generateFallbackResponse(
          message,
          complexityPreference as ComplexityLevel
        );
      }
    } else {
      response = generateFallbackResponse(
        message,
        complexityPreference as ComplexityLevel
      );
    }

    // Store assistant message
    const assistantMessage: Message = {
      id: uuidv4(),
      sessionId,
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      metadata: {
        specialists: response.specialistsConsulted,
        complexityLevel: response.complexityLevel,
        visuals: response.visuals,
      },
    };
    await addMessage(sessionId, assistantMessage);

    return NextResponse.json({
      type: 'response',
      data: response,
      messageCount: history.length + 2,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
