'use client';

import { Message as MessageType } from '@/app/lib/types';
import { CopyButton } from '../ui/CopyButton';
import { DisclaimerBanner } from './DisclaimerBanner';
import { ComplexityButtons } from './ComplexityButtons';

interface MessageProps {
  message: MessageType;
  onRequestSimpler?: () => void;
  onRequestDetail?: () => void;
  showActions?: boolean;
}

export function Message({
  message,
  onRequestSimpler,
  onRequestDetail,
  showActions = true,
}: MessageProps) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <article
      className={`
        p-4 rounded-xl mb-4
        ${isUser ? 'bg-blue-50 ml-8' : 'bg-white border border-gray-200 mr-8'}
      `}
      aria-label={`${isUser ? 'Your message' : 'Medical assistant response'}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isUser ? 'text-blue-700' : 'text-gray-700'}`}>
          {isUser ? 'You' : 'Medical Assistant'}
        </span>
        <time className="text-xs text-gray-500" dateTime={message.timestamp}>
          {formatTime(message.timestamp)}
        </time>
      </div>

      {/* Content */}
      <div
        className={`
          prose prose-sm max-w-none
          ${isUser ? 'text-gray-900' : 'text-gray-800'}
        `}
      >
        {/* For now, render as plain text. Later we'll add markdown rendering */}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Specialists consulted badge */}
      {isAssistant && message.metadata?.specialists && message.metadata.specialists.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.metadata.specialists.map((specialist) => (
            <span
              key={specialist}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
            >
              {specialist}
            </span>
          ))}
        </div>
      )}

      {/* Actions for assistant messages */}
      {isAssistant && showActions && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CopyButton content={message.content} label="Copy" />
              {onRequestSimpler && onRequestDetail && (
                <ComplexityButtons
                  onSimpler={onRequestSimpler}
                  onDetail={onRequestDetail}
                />
              )}
            </div>
          </div>
          <DisclaimerBanner variant="subtle" />
        </div>
      )}
    </article>
  );
}
