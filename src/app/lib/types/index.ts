// Session types
export interface Session {
  id: string;
  createdAt: string;
  lastActiveAt: string;
  messageCount: number;
}

// Message types
export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  specialists?: string[];
  complexityLevel?: ComplexityLevel;
  visuals?: VisualMetadata[];
}

export type ComplexityLevel = 'simple' | 'standard' | 'detailed';

// Visual types
export interface VisualMetadata {
  type: 'chart' | 'flowchart' | 'table' | 'diagram';
  title: string;
  config?: ChartConfig;
  code?: string; // For Mermaid
  data?: TableData;
  url?: string; // For external diagrams
  accessibilityDescription?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

// Preferences types
export interface UserPreferences {
  sessionId: string;
  fontSize: FontSize;
  highContrast: boolean;
  preferredComplexity: ComplexityLevel;
  updatedAt: string;
}

export type FontSize = 'normal' | 'large' | 'xlarge';

// Agent types
export interface Specialist {
  id: string;
  name: string;
  department: Department;
  scope: string[];
  model: 'opus' | 'sonnet' | 'haiku';
  skillPath: string;
}

export type Department =
  | 'internal-medicine'
  | 'surgery'
  | 'neurology'
  | 'critical-care'
  | 'psychiatry'
  | 'nursing'
  | 'hospitalist';

export interface ConsultationRequest {
  specialist: string;
  priority: 'urgent' | 'routine';
  clinicalQuestion: string;
  relevantContext: string;
}

export interface SpecialistResponse {
  specialistId: string;
  specialistName: string;
  assessment: string;
  recommendations: string[];
  forPatient: string;
  visuals?: VisualMetadata[];
  followUpQuestions?: string[];
  confidence: number;
}

export interface PCPAssessment {
  needsSpecialists: boolean;
  directResponse?: string;
  consultationRequests?: ConsultationRequest[];
  summary?: string;
}

export interface AssistantResponse {
  content: string;
  specialistsConsulted?: string[];
  visuals?: VisualMetadata[];
  complexityLevel: ComplexityLevel;
}

// Conversation state types
export type ConversationState =
  | 'initial'
  | 'disclaimer_pending'
  | 'idle'
  | 'processing'
  | 'consulting'
  | 'specialist_queries'
  | 'synthesizing'
  | 'streaming'
  | 'adjusting'
  | 'complete';

export type ConversationEvent =
  | { type: 'VISIT' }
  | { type: 'ACCEPT_DISCLAIMER' }
  | { type: 'SEND_MESSAGE'; payload: string }
  | { type: 'NEEDS_SPECIALISTS'; payload: ConsultationRequest[] }
  | { type: 'DIRECT_RESPONSE'; payload: string }
  | { type: 'SPECIALISTS_COMPLETE'; payload: SpecialistResponse[] }
  | { type: 'SYNTHESIS_COMPLETE'; payload: string }
  | { type: 'STREAM_CHUNK'; payload: string }
  | { type: 'STREAM_COMPLETE' }
  | { type: 'REQUEST_SIMPLER' }
  | { type: 'REQUEST_DETAIL' }
  | { type: 'ADJUSTMENT_COMPLETE'; payload: string };
