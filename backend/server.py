# backend/server.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import uvicorn
import json
import uuid
import io
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.multi_track_midi import render_midi_pack

app = FastAPI(title="Barksdale Music Studio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PRODUCERS = [
    "Conductor Williams", "Daringer", "Timbaland", "Dr. Dre",
    "J Dilla", "The Alchemist", "Metro Boomin", "Just Blaze",
    "Rick Rubin", "Pharrell", "Mike Dean", "Kanye West",
    "Pete Rock", "DJ Premier", "RZA", "Madlib",
    "9th Wonder", "No I.D.", "Jermaine Dupri", "Mannie Fresh",
    "Babyface", "Bryan-Michael Cox", "Rodney Jerkins", "Darkchild",
    "Frank Dukes", "Illangelo", "Nineteen85", "Kaytranada",
    "Raphael Saadiq", "James Poyser", "D'Mile", "Jack Antonoff"
]

GENRES = [
    "Boom Bap", "Hip Hop", "R&B", "Pop", "Jazz", "Blues",
    "Cinematic", "Trap", "EDM", "Classical", "Gospel",
    "Reggae", "House", "Disco"
]

EMOTIONS = [
    "Dark", "Soulful", "Angry", "Hopeful", "Melancholy",
    "Triumphant", "Intimate", "Cinematic", "Aggressive", "Nostalgic"
]

beats = {}

class GenerateRequest(BaseModel):
    producer: str
    genre: str
    emotion: str
    chords: str
    tempo: int = 78
    key: str = "C Minor"

@app.get("/")
async def root():
    return {"message": "Barksdale Music Studio API is running"}

@app.get("/api/options")
async def options():
    return {
        "producers": PRODUCERS,
        "genres": GENRES,
        "emotions": EMOTIONS
    }

@app.post("/api/generate")
async def generate(req: GenerateRequest):
    try:
        beat_id = str(uuid.uuid4())
        chord_list = [c.strip() for c in req.chords.split(',') if c.strip()]
        beats[beat_id] = {
            "chords": chord_list,
            "tempo": req.tempo,
            "producer": req.producer,
            "genre": req.genre,
            "emotion": req.emotion,
            "key": req.key,
            "chord_line": req.chords
        }
        return {
            "id": beat_id,
            "chord_line": req.chords,
            "message": "Beat generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/download/{beat_id}")
async def download(beat_id: str):
    if beat_id not in beats:
        raise HTTPException(status_code=404, detail="Beat not found")
    beat_data = beats[beat_id]
    try:
        zip_bytes = render_midi_pack(
            chords=beat_data["chords"],
            tempo=beat_data["tempo"],
            producer=beat_data.get("producer", "Unknown"),
            genre=beat_data.get("genre", "Unknown"),
            emotion=beat_data.get("emotion", "Unknown"),
            key=beat_data.get("key", "C Minor")
        )
        return Response(
            content=zip_bytes,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=beat_{beat_id}.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000)
