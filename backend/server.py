# backend/server.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
import uvicorn
import uuid
import sys
import os
import json
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.multi_track_midi import render_midi_pack

app = FastAPI(title="Barksdale Music Group API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directory for templates and chords
BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TEMPLATES_DIR = BASE_DIR / "templates"
CHORDS_DIR = BASE_DIR / "chords"
MIDI_DIR = BASE_DIR / "midi"

# Organized producer lists by category
CINEMATIC_BOOM_BAP = [
    "Conductor Williams",
    "Daringer",
    "Conductor Williams × Daringer Hybrid",
    "Big Ghost Ltd × Swiss Beatz",
    "The Alchemist",
    "Nicholas Craven",
    "DJ Premier",
    "Pete Rock",
    "9th Wonder",
    "RZA",
    "Madlib"
]

HITMEN_BAD_BOY = [
    "The Hitmen (90s SP-1200 Era)",
    "The Hitmen (2000s Interpolation Era)"
]

HIP_HOP_TRAP = [
    "Metro Boomin",
    "Timbaland",
    "Just Blaze",
    "Kanye West",
    "Dr. Dre",
    "Mannie Fresh",
    "Jermaine Dupri"
]

RB_SOUL = [
    "Babyface",
    "Bryan-Michael Cox",
    "Rodney Jerkins (Darkchild)",
    "D'Mile",
    "Raphael Saadiq",
    "James Poyser",
    "Kaytranada",
    "Nineteen85",
    "Illangelo",
    "Noah '40' Shebib",
    "Frank Dukes",
    "Jack Antonoff"
]

# All producers combined
ALL_PRODUCERS = CINEMATIC_BOOM_BAP + HITMEN_BAD_BOY + HIP_HOP_TRAP + RB_SOUL

GENRES = [
    "Boom Bap", "Hip Hop", "R&B", "Pop", "Jazz", "Blues",
    "Cinematic", "Trap", "EDM", "Classical", "Gospel",
    "Reggae", "House", "Disco", "Soul", "Funk"
]

EMOTIONS = [
    "Dark", "Soulful", "Angry", "Hopeful", "Melancholy",
    "Triumphant", "Intimate", "Cinematic", "Aggressive", "Nostalgic"
]

beats = {}

@app.get("/")
async def root():
    try:
        return {"message": "Barksdale Music Group API is running", "version": "2.0"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Service error: {str(e)}")

@app.get("/api/options")
async def options():
    try:
        return {
            "producers": ALL_PRODUCERS,
            "genres": GENRES,
            "emotions": EMOTIONS,
            "categories": {
                "cinematic_boom_bap": CINEMATIC_BOOM_BAP,
                "hitmen_bad_boy": HITMEN_BAD_BOY,
                "hip_hop_trap": HIP_HOP_TRAP,
                "rb_soul": RB_SOUL
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load options: {str(e)}")

@app.get("/api/templates")
async def list_templates():
    """List all available producer templates"""
    try:
        templates = []
        if TEMPLATES_DIR.exists():
            for f in TEMPLATES_DIR.glob("*.json"):
                template_name = f.stem.replace("_", " ").replace("-", " ").title()
                templates.append({
                    "id": f.stem,
                    "name": template_name,
                    "file": f.name
                })
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list templates: {str(e)}")

@app.get("/api/templates/{template_id}")
async def get_template(template_id: str):
    """Get a specific producer template"""
    try:
        template_path = TEMPLATES_DIR / f"{template_id}.json"
        if not template_path.exists():
            raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found")
        with open(template_path, 'r') as f:
            template_data = json.load(f)
        return template_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load template: {str(e)}")

@app.post("/api/templates/{template_id}")
async def save_template(template_id: str, request: Request):
    """Save a producer template"""
    try:
        data = await request.json()
        template_path = TEMPLATES_DIR / f"{template_id}.json"
        TEMPLATES_DIR.mkdir(parents=True, exist_ok=True)
        with open(template_path, 'w') as f:
            json.dump(data, f, indent=2)
        return {"message": "Template saved successfully", "template_id": template_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save template: {str(e)}")

@app.get("/api/chords")
async def get_chords():
    """Get the current chord progression"""
    try:
        chords_file = CHORDS_DIR / "progression.txt"
        if chords_file.exists():
            with open(chords_file, 'r') as f:
                progression = f.read().strip()
            return {"progression": progression, "format": "comma_separated"}
        return {"progression": "Cm, Ab, Fm, G", "format": "comma_separated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read chords: {str(e)}")

@app.post("/api/chords")
async def save_chords(request: Request):
    """Save a chord progression"""
    try:
        data = await request.json()
        progression = data.get("progression", "")
        chords_file = CHORDS_DIR / "progression.txt"
        CHORDS_DIR.mkdir(parents=True, exist_ok=True)
        # Always save as single comma-separated line
        chord_list = [c.strip() for c in progression.split(',') if c.strip()]
        with open(chords_file, 'w') as f:
            f.write(", ".join(chord_list))
        return {"message": "Chords saved", "progression": ", ".join(chord_list)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save chords: {str(e)}")

@app.post("/api/generate")
async def generate(request: Request):
    try:
        data = await request.json()
        producer = data.get("producer", "Unknown")
        genre = data.get("genre", "Unknown")
        emotion = data.get("emotion", "Unknown")
        chords_str = data.get("chords", "")
        tempo = data.get("tempo", 78)
        key = data.get("key", "C Minor")
        
        # Parse chords - always as comma-separated
        chord_list = [c.strip() for c in chords_str.split(',') if c.strip()]
        
        beat_id = str(uuid.uuid4())
        beats[beat_id] = {
            "chords": chord_list,
            "tempo": tempo,
            "producer": producer,
            "genre": genre,
            "emotion": emotion,
            "key": key,
            "chord_line": chords_str
        }
        return {
            "id": beat_id,
            "chord_line": chords_str,
            "message": "Beat generated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/api/generate/advanced")
async def generate_advanced(request: Request):
    """Generate with advanced producer-specific settings"""
    try:
        data = await request.json()
        producer = data.get("producer", "Unknown")
        genre = data.get("genre", "Unknown")
        emotion = data.get("emotion", "Unknown")
        chords_str = data.get("chords", "")
        tempo = data.get("tempo", 78)
        key = data.get("key", "C Minor")
        template_id = data.get("template_id", None)
        
        # Load template if specified
        template_data = None
        if template_id:
            try:
                template_path = TEMPLATES_DIR / f"{template_id}.json"
                if template_path.exists():
                    with open(template_path, 'r') as f:
                        template_data = json.load(f)
            except Exception:
                pass  # Fall back to default settings
        
        chord_list = [c.strip() for c in chords_str.split(',') if c.strip()]
        beat_id = str(uuid.uuid4())
        beats[beat_id] = {
            "chords": chord_list,
            "tempo": tempo,
            "producer": producer,
            "genre": genre,
            "emotion": emotion,
            "key": key,
            "chord_line": chords_str,
            "template": template_data
        }
        return {
            "id": beat_id,
            "chord_line": chords_str,
            "message": "Advanced beat generated successfully",
            "template_applied": template_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advanced generation failed: {str(e)}")

@app.get("/api/download/{beat_id}")
async def download(beat_id: str):
    try:
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
            raise HTTPException(status_code=500, detail=f"MIDI generation failed: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Download failed: {str(e)}")

@app.get("/api/mixing/presets")
async def get_mixing_presets():
    """Get gain staging and mixing presets (display only, locked)"""
    try:
        return {
            "gain_staging": {
                "kick": {"target": "-12dB", "locked": True},
                "snare": {"target": "-15dB", "locked": True},
                "bass": {"target": "-14dB", "locked": True},
                "melody": {"target": "-18dB", "locked": True},
                "hi_hats": {"target": "-20dB", "locked": True},
                "fx": {"target": "-22dB", "locked": True}
            },
            "bus_processing": {
                "compression_ratio": "2.5:1",
                "attack": "10ms",
                "release": "100ms",
                "threshold": "-18dB"
            },
            "mastering": {
                "target_lufs": "-9 LUFS",
                "true_peak": "-1dB",
                "locked": True
            },
            "scaler_eq_warning": {
                "max_instances": 4,
                "recommendation": "Use Track Lock or Track Merge when exceeding 4 instances (iPhone 14 compatible)"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load presets: {str(e)}")

@app.post("/api/export/warning")
async def get_export_warning():
    """Return auto-normalize warning for export"""
    try:
        return {
            "warning": "⚠️ AUTO-NORMALIZE: This export will normalize audio to -1dB True Peak / -9 LUFS. Turn off Auto-Normalize in your DAW if you prefer uncompressed dynamics.",
            "action_required": "Click 'Continue' to acknowledge and proceed with export."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate warning: {str(e)}")

@app.get("/api/health")
async def health():
    try:
        return {
            "status": "healthy",
            "service": "Barksdale Music Group API",
            "version": "2.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
