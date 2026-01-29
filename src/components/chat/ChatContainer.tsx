'use client';

import { useRef, useEffect } from 'react';
import { Message as MessageType } from '@/app/lib/types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { DisclaimerBanner } from './DisclaimerBanner';
import { Spinner } from '../ui/Spinner';
import { ScreenReaderAnnouncer } from '../accessibility/ScreenReaderAnnouncer';

interface ChatContainerProps {
  messages: MessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onRequestSimpler?: (messageId: string) => void;
  onRequestDetail?: (messageId: string) => void;
  announcement?: string;
}

export function ChatContainer({
  messages,
  isLoading,
  onSendMessage,
  onRequestSimpler,
  onRequestDetail,
  announcement = '',
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Screen reader announcements */}
      <ScreenReaderAnnouncer message={announcement} />

      {/* Persistent disclaimer banner at top */}
      <div className="px-4 py-3 bg-amber-50 border-b border-amber-200">
        <DisclaimerBanner variant="prominent" />
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Welcome to Your Medical Assistant
              </h2>
              <p className="text-gray-500">
                Describe your situation, share what your healthcare team has told you,
                or ask any questions about your care. I&apos;m here to help you understand.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onRequestSimpler={
                  onRequestSimpler ? () => onRequestSimpler(message.id) : undefined
                }
                onRequestDetail={
                  onRequestDetail ? () => onRequestDetail(message.id) : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mr-8">
            <Spinner size="sm" className="text-blue-600" />
            <span className="text-gray-600">
              Consulting medical specialists...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <ChatInput
          onSend={onSendMessage}
          isLoading={isLoading}
          disabled={false}
        />
      </div>
    </div>
  );
}
