/**
 * API Service for Full-Stack AI Workstation Endpoints
 */

export interface BeatGenerationRequest {
  genre?: string;
  bpm?: number;
  key?: string;
  mood?: string;
}

export interface BeatCritiqueRequest {
  trackTitle?: string;
  genre?: string;
  bpm?: number;
  patternData?: any;
}

export interface SoundtrackScoreRequest {
  scriptText: string;
  sceneTone?: string;
  targetBpm?: number;
}

export const generateBeatApi = async (req: BeatGenerationRequest) => {
  try {
    const res = await fetch("/api/ai/generate-beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to call generateBeatApi:", err);
    throw err;
  }
};

export const critiqueBeatApi = async (req: BeatCritiqueRequest) => {
  try {
    const res = await fetch("/api/ai/critique-beat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to call critiqueBeatApi:", err);
    throw err;
  }
};

export const stemSplitApi = async (trackTitle?: string, audioUrl?: string) => {
  try {
    const res = await fetch("/api/audio/stem-split", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackTitle, audioUrl })
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to call stemSplitApi:", err);
    throw err;
  }
};

export const scoreScriptApi = async (req: SoundtrackScoreRequest) => {
  try {
    const res = await fetch("/api/soundtrack/score-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    return await res.json();
  } catch (err) {
    console.error("Failed to call scoreScriptApi:", err);
    throw err;
  }
};
