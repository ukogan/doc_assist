'use client';

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/app/lib/types';
import { useSession } from '@/hooks/useSession';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { DisclaimerModal } from '@/components/chat/DisclaimerModal';
import { FontSizeControl } from '@/components/accessibility/FontSizeControl';
import { ContrastToggle } from '@/components/accessibility/ContrastToggle';
import { Spinner } from '@/components/ui/Spinner';

export default function Home() {
  const {
    session,
    isLoading: sessionLoading,
    disclaimerAccepted,
    acceptDisclaimer,
    createSession,
  } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Create session if none exists
  useEffect(() => {
    if (!sessionLoading && !session) {
      createSession();
    }
  }, [sessionLoading, session, createSession]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!session) return;

      // Create user message
      const userMessage: Message = {
        id: uuidv4(),
        sessionId: session.id,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsProcessing(true);
      setAnnouncement('Processing your message...');

      try {
        // Call chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content,
            complexityPreference: 'standard',
          }),
        });

        const data = await response.json();

        if (data.type === 'response' && data.data) {
          const assistantMessage: Message = {
            id: uuidv4(),
            sessionId: session.id,
            role: 'assistant',
            content: data.data.content,
            timestamp: new Date().toISOString(),
            metadata: {
              specialists: data.data.specialistsConsulted,
              complexityLevel: data.data.complexityLevel,
              visuals: data.data.visuals,
            },
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setAnnouncement('Response received');
        } else if (data.error) {
          // Show error as assistant message
          const errorMessage: Message = {
            id: uuidv4(),
            sessionId: session.id,
            role: 'assistant',
            content: `I apologize, but I encountered an issue processing your request. Please try again or rephrase your question. Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, errorMessage]);
          setAnnouncement('Error processing request');
        }
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: Message = {
          id: uuidv4(),
          sessionId: session.id,
          role: 'assistant',
          content:
            'I apologize, but I encountered a connection issue. Please check your internet connection and try again.',
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setAnnouncement('Connection error');
      } finally {
        setIsProcessing(false);
      }
    },
    [session]
  );

  // Handle complexity adjustment requests
  const handleRequestSimpler = useCallback((messageId: string) => {
    // TODO: Implement complexity adjustment
    console.log('Request simpler for:', messageId);
    setAnnouncement('Requesting simpler explanation...');
  }, []);

  const handleRequestDetail = useCallback((messageId: string) => {
    // TODO: Implement complexity adjustment
    console.log('Request more detail for:', messageId);
    setAnnouncement('Requesting more detailed explanation...');
  }, []);

  // Show loading state while session initializes
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" className="text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Disclaimer Modal */}
      <DisclaimerModal isOpen={!disclaimerAccepted} onAccept={acceptDisclaimer} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Medical Assistant
            </h1>
            <p className="text-sm text-gray-500">
              Understanding your hospital care
            </p>
          </div>

          {/* Accessibility controls */}
          <div className="flex items-center gap-4">
            <FontSizeControl />
            <ContrastToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col max-w-4xl w-full mx-auto">
        <ChatContainer
          messages={messages}
          isLoading={isProcessing}
          onSendMessage={handleSendMessage}
          onRequestSimpler={handleRequestSimpler}
          onRequestDetail={handleRequestDetail}
          announcement={announcement}
        />
      </main>
    </div>
  );
}
