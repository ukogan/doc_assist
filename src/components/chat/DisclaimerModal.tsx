'use client';

import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ isOpen, onAccept }: DisclaimerModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="Important Medical Disclaimer"
      showCloseButton={false}
      size="lg"
    >
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-800">
                This is NOT a substitute for professional medical advice
              </h3>
            </div>
          </div>
        </div>

        <div className="text-gray-700 space-y-3">
          <p>
            This application is designed to help you understand medical information
            you receive during a hospital stay. It provides educational information
            only and should <strong>never</strong> replace the advice of your doctors,
            nurses, or other healthcare providers.
          </p>

          <p>By using this application, you understand that:</p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              The information provided is for <strong>educational purposes only</strong>
            </li>
            <li>
              You should <strong>always consult your healthcare team</strong> before
              making any medical decisions
            </li>
            <li>
              This tool cannot diagnose conditions, prescribe treatments, or replace
              medical professionals
            </li>
            <li>
              In case of a <strong>medical emergency</strong>, call 911 or contact
              your hospital&apos;s emergency services immediately
            </li>
            <li>
              Your conversations may be stored to provide continuity during your
              hospital stay
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Tip:</strong> Use this tool to prepare questions for your
            healthcare providers, understand medical terms, and learn about your
            care plan—then discuss everything with your medical team.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button onClick={onAccept} size="lg" className="w-full sm:w-auto">
            I Understand and Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
}
