export interface Actor {
  id: string;
  name: string;
  age: number;
  ethnicity: string;
  vocalAccent: string;
  hairstyle: string;
  wardrobe: string;
  styleLocked: boolean;
}

export interface Screenplay {
  id: string;
  title: string;
  category: string;
  sceneDesc: string;
  scriptText: string;
  maxWords: number;
  pacing: string; // e.g., "Fast Paced Noir Action"
}

export interface MPEState {
  strike: number; // 0-100
  press: number;  // 0-100
  glide: number;  // -50 to +50 (pitch bend)
  slide: number;  // 0-100 (timbre/filter)
  lift: number;   // 0-100
}

export interface SynthPreset {
  id: string;
  name: string;
  volume: number; // 0-100
  solo: boolean;
  mute: boolean;
  type: 'lead' | 'bass' | 'pad';
}

export interface ExpressionQuest {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Specialist';
  description: string;
  requiredGesture: keyof MPEState;
  targetValue: number;
  badgeName: string;
  completed: boolean;
}

export interface InnovationBlueprint {
  id: string;
  title: string;
  category: 'monetization' | 'shader' | 'ux' | 'developer';
  description: string;
  logic: string;
  monetization: string;
  mathFormula: string;
}

export interface PatchCable {
  id: string;
  fromNode: string; // osc, env, lfo
  toNode: string;   // filter, amp, pitch
  color: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'producer' | 'ai';
  text: string;
  persona?: 'beatnik' | 'pigeon' | 'vinyl' | 'producer';
}
