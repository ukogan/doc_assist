'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading = false,
  disabled = false,
  placeholder = "Describe your situation, question, or concern...",
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="relative">
        <label htmlFor="chat-input" className="sr-only">
          Enter your message
        </label>
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          rows={3}
          className={`
            w-full px-4 py-3 rounded-xl border-2
            text-base resize-none
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${disabled ? 'bg-gray-50' : 'bg-white'}
            border-gray-300 focus:border-blue-500
          `}
          aria-describedby="input-hint"
        />
        <p id="input-hint" className="sr-only">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Press Enter to send, Shift+Enter for new line
        </p>
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          isLoading={isLoading}
          size="lg"
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </Button>
      </div>
    </form>
  );
}
