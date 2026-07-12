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
from typing import Optional

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from scripts.multi_track_midi import render_midi_pack

app = FastAPI(title="BARKSDALE MUSIC GROUP API v3.0")

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
DATA_DIR = BASE_DIR / "data"

# Load data files at startup
def load_json_file(filepath):
    try:
        if filepath.exists():
            with open(filepath, 'r') as f:
                return json.load(f)
    except Exception:
        pass
    return None

CHORDS_DATA = load_json_file(DATA_DIR / "chords.json")
EMOTION_DATA = load_json_file(DATA_DIR / "emotion_to_chords.json")
CIRCLE_DATA = load_json_file(DATA_DIR / "circle_of_fifths.json")

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
            "service": "BARKSDALE MUSIC GROUP API",
            "version": "3.0"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

# ============= NEW ENDPOINTS FOR v3.0 =============

@app.get("/api/encyclopedia")
async def get_encyclopedia():
    """Get complete chord encyclopedia with emotional colors, formulas, PC sets"""
    try:
        if CHORDS_DATA:
            return {
                "chords": CHORDS_DATA.get("chords", {}),
                "chord_types": CHORDS_DATA.get("chord_types", []),
                "emotional_colors": CHORDS_DATA.get("emotional_colors", {}),
                "voice_leading_tips": CHORDS_DATA.get("voice_leading_tips", [])
            }
        return {"error": "Encyclopedia data not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load encyclopedia: {str(e)}")

@app.get("/api/encyclopedia/chord/{chord_name}")
async def get_chord_detail(chord_name: str):
    """Get detailed information about a specific chord"""
    try:
        if CHORDS_DATA:
            chords = CHORDS_DATA.get("chords", {})
            # Normalize chord name
            chord_key = chord_name.title().replace("Sharp", "#").replace("Flat", "b")
            if chord_key in chords:
                return chords[chord_key]
            # Try without formatting
            for key, value in chords.items():
                if key.lower().replace("#", "sharp").replace("b", "flat") == chord_name.lower().replace("#", "sharp").replace("b", "flat"):
                    return value
            raise HTTPException(status_code=404, detail=f"Chord '{chord_name}' not found")
        raise HTTPException(status_code=500, detail="Encyclopedia data not available")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chord: {str(e)}")

@app.get("/api/encyclopedia/chord-types")
async def get_chord_types():
    """Get all chord types with formulas"""
    try:
        if CHORDS_DATA:
            return {"chord_types": CHORDS_DATA.get("chord_types", [])}
        return {"chord_types": []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load chord types: {str(e)}")

@app.get("/api/circle-of-fifths")
async def get_circle_of_fifths():
    """Get complete Circle of Fifths with all 12 keys"""
    try:
        if CIRCLE_DATA:
            return CIRCLE_DATA
        return {"error": "Circle of Fifths data not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load Circle of Fifths: {str(e)}")

@app.get("/api/circle-of-fifths/key/{key_name}")
async def get_key_info(key_name: str):
    """Get detailed information about a specific key"""
    try:
        if CIRCLE_DATA:
            cofs = CIRCLE_DATA.get("circle_of_fifths", {})
            # Find matching key
            key_normalized = key_name.title().replace("#", "").replace("b", "")
            for pos, key_data in cofs.items():
                if key_data.get("root", "").title().replace("#", "") == key_normalized:
                    return key_data
            raise HTTPException(status_code=404, detail=f"Key '{key_name}' not found")
        raise HTTPException(status_code=500, detail="Circle of Fifths data not available")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load key info: {str(e)}")

@app.get("/api/emotions")
async def get_emotions():
    """Get all emotion categories with recommended chords"""
    try:
        if EMOTION_DATA:
            return {"emotions": EMOTION_DATA.get("emotions", {})}
        return {"emotions": {}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load emotions: {str(e)}")

@app.get("/api/emotions/{emotion_name}")
async def get_emotion_detail(emotion_name: str):
    """Get detailed emotion mapping with chords and progressions"""
    try:
        if EMOTION_DATA:
            emotions = EMOTION_DATA.get("emotions", {})
            emotion_key = emotion_name.lower()
            if emotion_key in emotions:
                return emotions[emotion_key]
            raise HTTPException(status_code=404, detail=f"Emotion '{emotion_name}' not found")
        raise HTTPException(status_code=500, detail="Emotion data not available")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load emotion: {str(e)}")

@app.get("/api/orchestral-guide")
async def get_orchestral_guide():
    """Get orchestral color guide for instrument-to-chord recommendations"""
    try:
        if EMOTION_DATA:
            return EMOTION_DATA.get("orchestral_color_guide", {})
        return {"error": "Orchestral guide not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load orchestral guide: {str(e)}")

@app.get("/api/daily-drill")
async def get_daily_drill():
    """Get daily drill exercises (15-minute practice)"""
    try:
        if EMOTION_DATA:
            return EMOTION_DATA.get("daily_drill_exercises", {})
        return {"error": "Daily drill data not available"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load daily drill: {str(e)}")

@app.post("/api/voice-leading")
async def suggest_voice_leading(request: Request):
    """Suggest smoothest inversions for a chord progression"""
    try:
        data = await request.json()
        progression = data.get("progression", [])
        
        if not progression:
            return {"suggestions": [], "message": "No progression provided"}
        
        suggestions = []
        prev_chord = None
        
        for chord in progression:
            suggestion = {
                "chord": chord,
                "inversions": [],
                "best_inversion": None,
                "voice_leading_tip": ""
            }
            
            if CHORDS_DATA:
                chords_dict = CHORDS_DATA.get("chords", {})
                chord_data = chords_dict.get(chord.title())
                if chord_data:
                    inversions = chord_data.get("inversions", [])
                    suggestion["inversions"] = inversions
                    if inversions:
                        suggestion["best_inversion"] = inversions[0].get("name", chord)
            
            if prev_chord:
                suggestion["voice_leading_tip"] = "Move by smallest interval to maintain smooth voice leading"
            
            suggestions.append(suggestion)
            prev_chord = chord
        
        return {
            "progression": progression,
            "suggestions": suggestions,
            "tip": "Keep common tones in the same voice. Move other voices by half steps or whole steps."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice leading analysis failed: {str(e)}")

@app.get("/api/progressions/by-emotion/{emotion}")
async def get_progressions_by_emotion(emotion: str):
    """Get chord progressions recommended for an emotion"""
    try:
        if EMOTION_DATA:
            emotions = EMOTION_DATA.get("emotions", {})
            emotion_key = emotion.lower()
            if emotion_key in emotions:
                emotion_data = emotions[emotion_key]
                return {
                    "emotion": emotion,
                    "recommended_progressions": emotion_data.get("recommended_progressions", []),
                    "recommended_chords": emotion_data.get("recommended_chords", []),
                    "bpm_range": emotion_data.get("bpm_range", {}),
                    "scale_suggestions": emotion_data.get("scale_suggestions", [])
                }
            raise HTTPException(status_code=404, detail=f"Emotion '{emotion}' not found")
        raise HTTPException(status_code=500, detail="Emotion data not available")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load progressions: {str(e)}")

@app.get("/api/progressions/by-key/{key}")
async def get_progressions_by_key(key: str):
    """Get common progressions for a specific key"""
    try:
        if CIRCLE_DATA:
            cofs = CIRCLE_DATA.get("circle_of_fifths", {})
            key_normalized = key.title()
            for pos, key_data in cofs.items():
                if key_data.get("major_key", "").title() == key_normalized or key_data.get("root", "").title() == key_normalized.split()[0]:
                    return {
                        "key": key_data.get("major_key", key),
                        "relative_minor": key_data.get("relative_minor", ""),
                        "diatonic_chords": key_data.get("diatonic_chords_major", {}),
                        "common_progressions": key_data.get("common_chord_progressions", [])
                    }
            raise HTTPException(status_code=404, detail=f"Key '{key}' not found")
        raise HTTPException(status_code=500, detail="Circle of Fifths data not available")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load key progressions: {str(e)}")

@app.get("/api/learn/exercises")
async def get_learning_exercises():
    """Get all learning exercises for the Learn tab"""
    try:
        exercises = {
            "beginner": [
                {"id": 1, "title": "Major Triad Basics", "description": "Learn C, F, G major triads", "type": "chord"},
                {"id": 2, "title": "Minor Triad Basics", "description": "Learn Am, Dm, Em minor triads", "type": "chord"},
                {"id": 3, "title": "I-IV-V-I Progression", "description": "Play the most common progression in all keys", "type": "progression"},
                {"id": 4, "title": "12 Bar Blues Pattern", "description": "Learn the classic blues structure", "type": "structure"},
                {"id": 5, "title": "Root Position vs Inversions", "description": "Understand chord inversions", "type": "theory"}
            ],
            "intermediate": [
                {"id": 6, "title": "7th Chord Family", "description": "Major 7, Minor 7, Dominant 7 chords", "type": "chord"},
                {"id": 7, "title": "ii-V-I Jazz Progression", "description": "The most important jazz progression", "type": "progression"},
                {"id": 8, "title": "Modal Interchange", "description": "Borrow chords from parallel modes", "type": "theory"},
                {"id": 9, "title": "Suspended Chord Colors", "description": "Explore sus2 and sus4 sounds", "type": "chord"},
                {"id": 10, "title": "Voice Leading Basics", "description": "Smooth transitions between chords", "type": "technique"}
            ],
            "advanced": [
                {"id": 11, "title": "Tritone Substitutions", "description": "Advanced reharmonization technique", "type": "theory"},
                {"id": 12, "title": "Alterations & Extensions", "description": "b9, #9, #11, b13 chord tones", "type": "chord"},
                {"id": 13, "title": "Diminished Language", "description": "Dominant 7b9 and dim7 sequences", "type": "theory"},
                {"id": 14, "title": "Parallel Modes", "description": "Mix Dorian, Phrygian, Lydian", "type": "theory"},
                {"id": 15, "title": "Polychords & Clusters", "description": "Stacked chords and modern harmony", "type": "theory"}
            ]
        }
        return exercises
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load exercises: {str(e)}")

@app.get("/api/monetization/tiers")
async def get_monetization_tiers():
    """Get subscription tier information"""
    try:
        return {
            "tiers": [
                {
                    "name": "Free",
                    "price": 0,
                    "features": [
                        "Basic chords (major, minor, 7th)",
                        "5 daily drills per day",
                        "3 templates access",
                        "Basic beat generation"
                    ],
                    "limitations": [
                        "No advanced chord types",
                        "No voice leading suggestions",
                        "No orchestration guide",
                        "No interactive exercises"
                    ]
                },
                {
                    "name": "Pro",
                    "price": 9.99,
                    "currency": "USD",
                    "billing": "monthly",
                    "features": [
                        "Full chord encyclopedia (all types)",
                        "All 30+ producer templates",
                        "Voice leading suggester",
                        "Orchestral color guide",
                        "Circle of Fifths interactive",
                        "Emotion-to-chords mapping",
                        "Unlimited daily drills"
                    ],
                    "limitations": [
                        "No interactive exercises",
                        "No 1-on-1 feedback"
                    ]
                },
                {
                    "name": "Studio",
                    "price": 29.99,
                    "currency": "USD",
                    "billing": "monthly",
                    "features": [
                        "Everything in Pro",
                        "Interactive exercises with auto-check",
                        "1-on-1 feedback sessions",
                        "Custom template creation",
                        "Priority support",
                        "Early access to new features"
                    ],
                    "limitations": []
                }
            ],
            "coming_soon": [
                "DAW import guides",
                "Custom template export",
                "Collaboration features"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load tiers: {str(e)}")

@app.get("/api/daw/guides")
async def get_daw_guides():
    """Get DAW import guides (Coming Soon)"""
    try:
        return {
            "status": "coming_soon",
            "message": "DAW import guides are being developed",
            "planned_daws": [
                {"name": "GarageBand", "icon": "apple", "platform": "iOS/macOS"},
                {"name": "FL Studio", "icon": "fl", "platform": "Windows/macOS/iOS/Android"},
                {"name": "Logic Pro", "icon": "apple", "platform": "macOS"},
                {"name": "Ableton Live", "icon": "ableton", "platform": "Windows/macOS"},
                {"name": "BandLab", "icon": "cloud", "platform": "Web/iOS/Android"}
            ],
            "estimated_release": "Q4 2026"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load DAW guides: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 10000)))
