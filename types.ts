export enum SimulationPhase {
  INTRO = 'INTRO',
  DELEGATION = 'DELEGATION',
  DISPUTE_PHASE_1 = 'DISPUTE_PHASE_1',
  DISPUTE_PHASE_2 = 'DISPUTE_PHASE_2',
  REPOPS = 'REPOPS',
  CHAT = 'CHAT'
}

export interface NodeStatus {
  id: string;
  type: 'input' | 'op' | 'output';
  label: string;
  status: 'pending' | 'verified' | 'disputed' | 'diverged';
  x: number;
  y: number;
}

export interface StepData {
  id: number;
  honestHash: string;
  maliciousHash: string;
  status: 'unknown' | 'verified' | 'diverged';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
