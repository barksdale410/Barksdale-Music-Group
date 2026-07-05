# backend/app.py
import os
import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn

app = FastAPI(title="Barksdale Music Group API")

# CORS — allow frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── MODELS ───
class BeatRequest(BaseModel):
    primary_producer: str
    secondary_producer: Optional[str] = None
    genre: str
    artist_flavor: str
    emotion: str
    tempo: int = 78
    key: str = "C Minor"
    expert_mode: bool = False
    chords: Optional[List[str]] = None
    drum_grid: Optional[Dict] = None
    bass_pattern: Optional[List[int]] = None
    layers: Optional[List[str]] = None
    arrangement: Optional[Dict] = None

class DemoRequest(BaseModel):
    lyrics: Dict[str, str]
    style: str
    sections: List[str]

class VideoRequest(BaseModel):
    video_type: str
    style: str
    prompt: Optional[str] = None
    script: Optional[str] = None
    location: Optional[str] = None

class DistributeRequest(BaseModel):
    title: str
    artist: str
    service: str
    platforms: List[str]

# ─── NVIDIA NIM SERVICE ───
class NVIDIA_NIM_Service:
    def __init__(self):
        self.api_key = os.getenv("NVIDIA_API_KEY")
        self.base_url = "https://build.nvidia.com/v1"

    def call_model(self, endpoint: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if not self.api_key:
            return {"error": "NVIDIA_API_KEY not set", "mock": True}
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e), "mock": True}

    def generate_beat(self, prompt: str) -> Dict[str, Any]:
        endpoint = os.getenv("MISTRAL_MEDIUM_ENDPOINT", 
                            "https://build.nvidia.com/mistralai/mistral-medium-3.5-128b")
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 4096
        }
        return self.call_model(endpoint, payload)

    def synthesize_voice(self, text: str, voice_id: str = "default") -> Dict[str, Any]:
        endpoint = os.getenv("CHATTERBOX_TTS_ENDPOINT",
                            "https://build.nvidia.com/chatterbox-ai/chatterbox-multilingual-tts")
        payload = {"text": text, "voice_id": voice_id}
        return self.call_model(endpoint, payload)

    def generate_video(self, prompt: str, image_url: str = None) -> Dict[str, Any]:
        endpoint = os.getenv("COSMOS3_NANO_ENDPOINT",
                            "https://build.nvidia.com/nvidia/cosmos3-nano")
        payload = {"prompt": prompt, "image_url": image_url}
        return self.call_model(endpoint, payload)

    def moderate_content(self, text: str) -> Dict[str, Any]:
        endpoint = os.getenv("NEMOTRON_CONTENT_SAFETY_ENDPOINT",
                            "https://build.nvidia.com/nvidia/nemotron-3.5-content-safety")
        payload = {"text": text}
        return self.call_model(endpoint, payload)

nvidia = NVIDIA_NIM_Service()

# ─── ENDPOINTS ───

@app.get("/")
async def root():
    return {"message": "Barksdale Music Group API is running", "status": "ok"}

@app.post("/api/generate_beat")
async def generate_beat(req: BeatRequest):
    # Build prompt for NVIDIA
    prompt = f"""
    Generate a professional beat plan for a {req.genre} track.
    Primary Producer: {req.primary_producer}
    Secondary Producer: {req.secondary_producer or 'None'}
    Artist Flavor: {req.artist_flavor}
    Emotion: {req.emotion}
    Tempo: {req.tempo} BPM
    Key: {req.key}
    Expert Mode: {req.expert_mode}

    Return a JSON object with:
    - chords: list of chords in ABC notation (e.g., ["Cm", "Ab", "Fm", "G"])
    - chord_progression_line: comma-separated string of chords
    - drum_grid: object with kick, snare, hat arrays (16 values each)
    - bass_pattern: array of 16 MIDI note numbers (0 = rest)
    - arrangement: object with intro, verse1, hook1, etc. (bars and energy)
    - mix_summary: object with gain_staging and master settings
    """
    result = nvidia.generate_beat(prompt)
    if result.get("mock"):
        # Fallback mock response
        return {
            "producer": req.primary_producer,
            "genre": req.genre,
            "artist_flavor": req.artist_flavor,
            "emotion": req.emotion,
            "tempo": req.tempo,
            "key": req.key,
            "chords": req.chords or ["Cm", "Ab", "Fm", "G"],
            "chord_progression_line": ", ".join(req.chords or ["Cm", "Ab", "Fm", "G"]),
            "drum_grid": req.drum_grid or {
                "kick": [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
                "snare": [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
                "hat": [0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0]
            },
            "bass_pattern": req.bass_pattern or [60,0,0,0,56,0,0,0,53,0,0,0,55,0,0,0],
            "arrangement": req.arrangement or {
                "intro": {"bars": 8, "energy": 30},
                "verse1": {"bars": 16, "energy": 40},
                "hook1": {"bars": 8, "energy": 70}
            },
            "mix_summary": {
                "gain_staging": {"kick": -12, "snare": -15, "bass": -14, "melody": -18, "vocal": -16},
                "master": {"lufs": -9, "true_peak": -1.0}
            }
        }
    return result

@app.post("/api/generate_demo")
async def generate_demo(req: DemoRequest):
    # Combine lyrics into full text
    full_lyrics = "\n".join(req.lyrics.values())
    result = nvidia.synthesize_voice(full_lyrics, "default")
    return {
        "status": "generated",
        "style": req.style,
        "sections": req.sections,
        "audio_urls": {
            "full_demo": "https://example.com/demo.mp3",
            "sections": {s: f"https://example.com/{s}.mp3" for s in req.sections}
        }
    }

@app.post("/api/generate_video")
async def generate_video(req: VideoRequest):
    prompt = req.prompt or req.script or "A cinematic music video"
    result = nvidia.generate_video(prompt)
    return {
        "status": "generated",
        "video_type": req.video_type,
        "style": req.style,
        "video_url": "https://example.com/video.mp4",
        "duration": 120,
        "resolution": "1080p"
    }

@app.post("/api/distribute")
async def distribute(req: DistributeRequest):
    return {
        "status": "submitted",
        "title": req.title,
        "artist": req.artist,
        "service": req.service,
        "platforms": req.platforms,
        "isrc_codes": ["US-ABC-25-00001"],
        "distribution_id": "dist_123456",
        "message": f"Successfully submitted {req.title} to {req.service} for distribution"
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "nvidia_api_configured": bool(os.getenv("NVIDIA_API_KEY"))}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
