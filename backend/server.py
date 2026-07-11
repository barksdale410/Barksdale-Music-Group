# backend/server.py - Barksdale Music Group Backend (FastAPI)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import os
import json
import uuid
import zipfile
import io
import struct
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

app = FastAPI(title="Barksdale Music API", version="2.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage
beats: Dict = {}
gallery: Dict = {}
beat_battles: Dict = {}

# Models
class BeatRequest(BaseModel):
    primary_producer: str = "Conductor Williams"
    genre: str = "Boom Bap"
    emotion: str = "Dark"
    tempo: int = 78
    key: str = "C Minor"
    chords: Optional[List[str]] = None
    arrangement_type: Optional[str] = "radio"

class ExportRequest(BaseModel):
    beat_id: Optional[str] = None
    include_flp: bool = False

class BandLabRequest(BaseModel):
    beat_id: str
    bandlab_token: str = "demo"

# Constants
NOTE_MAP = {'kick': 36, 'snare': 38, 'hat': 42, 'open_hat': 46, 'rim': 37}
CHORD_MAP = {'C': [60, 64, 67], 'Cm': [60, 63, 67], 'D': [62, 66, 69], 'Dm': [62, 65, 69],
    'F': [65, 69, 72], 'Fm': [65, 68, 72], 'G': [67, 71, 74], 'Gm': [67, 70, 74],
    'A': [69, 73, 76], 'Am': [69, 72, 76], 'Bb': [70, 74, 77], 'Ab': [68, 72, 75]}

# ============================================
# BEAT ENGINE
# ============================================

def generate_beat(params: Dict) -> Dict:
    producer = params.get('primary_producer', 'Conductor Williams')
    genre = params.get('genre', 'Boom Bap')
    emotion = params.get('emotion', 'Dark')
    tempo = params.get('tempo', 78)
    key = params.get('key', 'C Minor')
    custom_chords = params.get('chords', [])
    
    if custom_chords:
        chords = custom_chords
    elif genre == 'Boom Bap' and emotion == 'Dark':
        chords = ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Bb', 'G']
    elif emotion == 'Soulful':
        chords = ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'G']
    elif emotion == 'Chill':
        chords = ['Cmaj7', 'Am7', 'Fmaj7', 'G7']
    else:
        chords = ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Bb', 'G']
    
    return {
        "producer": producer,
        "genre": genre,
        "emotion": emotion,
        "tempo": tempo,
        "key": key,
        "chords": chords,
        "chord_progression_line": ", ".join(chords),
        "drum_grid": {
            "kick": [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            "snare": [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
            "hat": [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
            "open_hat": [0]*16,
            "rim": [0]*16,
            "percussion": [0]*16
        },
        "velocities": {
            "kick": [120,0,0,0,0,0,0,0,110,0,0,0,0,0,0,0],
            "snare": [0,0,0,0,0,0,115,0,0,0,0,0,0,0,110,0],
            "hat": [45,40,0,35,0,40,0,35,45,40,0,35,0,40,0,35],
            "open_hat": [0]*16,
            "rim": [0]*16,
            "percussion": [0]*16
        },
        "bass_pattern": {
            "notes": [36,0,0,0,48,0,0,0,43,0,0,0,47,0,0,0],
            "velocities": [110,0,0,0,105,0,0,0,100,0,0,0,115,0,0,0]
        },
        "layers": [],
        "arrangement": {
            "intro": {"bars": 4, "energy": 3},
            "verse1": {"bars": 16, "energy": 6},
            "hook1": {"bars": 8, "energy": 9},
            "outro": {"bars": 4, "energy": 2}
        },
        "mix_summary": {"gain_staging": {"kick": -12, "snare": -15, "bass": -14}},
        "master": {"lufs": -9, "true_peak": -1.0}
    }

def generate_pro_beat(params: Dict) -> Dict:
    base = generate_beat(params)
    base["premium"] = True
    base["arrangement"] = {
        "intro": {"bars": 4}, "verse1": {"bars": 16}, "pre_hook": {"bars": 4},
        "hook": {"bars": 8}, "verse2": {"bars": 16}, "bridge": {"bars": 8},
        "final_hook": {"bars": 8}, "outro": {"bars": 4}, "total_bars": 68
    }
    base["mixing_preset"] = {"preset_name": "radio_ready"}
    base["includes"] = ["Full arrangement MIDI", "Mixing presets", "WAV stems"]
    return base

# ============================================
# EXPORTERS
# ============================================

def export_flp(beat_plan: Dict) -> bytes:
    tempo = beat_plan.get('tempo', 78)
    buffer = io.BytesIO()
    buffer.write(b'FLhd')
    buffer.write(struct.pack('<I', 20))
    buffer.write(struct.pack('<f', float(tempo)))
    buffer.write(struct.pack('<B', 4))
    buffer.write(struct.pack('<B', 4))
    buffer.write(struct.pack('<H', 480))
    channels = [("Drums", 0x30), ("808 Bass", 0x31), ("Chords", 0x00)]
    buffer.write(struct.pack('<I', len(channels)))
    for name, plugin_id in channels:
        buffer.write(b'FLch')
        name_bytes = name.encode('utf-8')[:64]
        buffer.write(name_bytes + b'\x00' * (64 - len(name_bytes)))
        buffer.write(struct.pack('<B', plugin_id))
        buffer.write(struct.pack('<f', 1.0))
        buffer.write(struct.pack('<f', 0.0))
        buffer.write(struct.pack('<?', False))
        buffer.write(struct.pack('<?', False))
        buffer.write(struct.pack('<I', 0))
    buffer.write(b'FLmd')
    buffer.write(b'Barksdale Music Group' + b'\x00' * 106)
    buffer.write(b'FLft')
    return buffer.getvalue()

def publish_to_bandlab(beat_plan: Dict, access_token: str) -> Dict:
    return {
        'success': True,
        'project_id': str(uuid.uuid4())[:8],
        'project_url': f"https://www.bandlab.com/post/demo",
        'message': 'Demo mode - configure BANDLAB_CLIENT_ID for live'
    }

def render_midi_pack(beat_plan: Dict) -> bytes:
    zip_buffer = io.BytesIO()
    try:
        import pretty_midi
        with zipfile.ZipFile(zip_buffer, 'w') as zf:
            chords = beat_plan.get('chords', [])
            if chords:
                midi = pretty_midi.PrettyMIDI(initial_tempo=beat_plan.get('tempo', 78))
                piano = pretty_midi.Instrument(program=0, name='Piano')
                sec_per_bar = 60 / beat_plan.get('tempo', 78) * 4
                for i, chord in enumerate(chords):
                    for note in CHORD_MAP.get(chord, [60, 64, 67]):
                        piano.notes.append(pretty_midi.Note(100, note, i * sec_per_bar, (i + 1) * sec_per_bar))
                midi.instruments.append(piano)
                buf = io.BytesIO()
                midi.write(buf)
                zf.writestr('chords.mid', buf.getvalue())
            
            drum_grid = beat_plan.get('drum_grid', {})
            velocities = beat_plan.get('velocities', {})
            if drum_grid:
                midi = pretty_midi.PrettyMIDI(initial_tempo=beat_plan.get('tempo', 78))
                drums = pretty_midi.Instrument(program=0, is_drum=True, name='Drums')
                sec_per_step = (60 / beat_plan.get('tempo', 78)) / 4
                for instr, pattern in drum_grid.items():
                    note_num = NOTE_MAP.get(instr, 36)
                    vel_pattern = velocities.get(instr, [])
                    for step, hit in enumerate(pattern):
                        if hit:
                            vel = vel_pattern[step] if step < len(vel_pattern) else 80
                            drums.notes.append(pretty_midi.Note(vel, note_num, step * sec_per_step, step * sec_per_step + sec_per_step * 0.5))
                midi.instruments.append(drums)
                buf = io.BytesIO()
                midi.write(buf)
                zf.writestr('drums.mid', buf.getvalue())
            
            bass = beat_plan.get('bass_pattern', {})
            if bass:
                midi = pretty_midi.PrettyMIDI(initial_tempo=beat_plan.get('tempo', 78))
                bass_track = pretty_midi.Instrument(program=33, name='Bass')
                sec_per_step = (60 / beat_plan.get('tempo', 78)) / 4
                for step, pitch in enumerate(bass.get('notes', [])):
                    if pitch:
                        bass_track.notes.append(pretty_midi.Note(bass.get('velocities', [80])[step], pitch, step * sec_per_step, step * sec_per_step + sec_per_step * 3))
                midi.instruments.append(bass_track)
                buf = io.BytesIO()
                midi.write(buf)
                zf.writestr('bass.mid', buf.getvalue())
            
            zf.writestr('README.txt', f"""BEAT PACK - Barksdale Music Group
Producer: {beat_plan.get('producer')}
Genre: {beat_plan.get('genre')}
Tempo: {beat_plan.get('tempo')} BPM
Key: {beat_plan.get('key')}
Chords: {beat_plan.get('chord_progression_line')}
""")
            zf.writestr('template.json', json.dumps(beat_plan, indent=2))
    except ImportError:
        with zipfile.ZipFile(zip_buffer, 'w') as zf:
            zf.writestr('README.txt', f"""BEAT PACK - Barksdale Music Group
Producer: {beat_plan.get('producer')}
NOTE: Install pretty-midi for MIDI export.
""")
            zf.writestr('template.json', json.dumps(beat_plan, indent=2))
    return zip_buffer.getvalue()

# ============================================
# AI FEEDBACK
# ============================================

def generate_ai_feedback(beat_plan: Dict) -> List[str]:
    feedback = []
    tempo = beat_plan.get('tempo', 78)
    if tempo < 70:
        feedback.append("💡 Great for laid-back tracks.")
    elif tempo > 90:
        feedback.append("⚡ High energy! Club-ready.")
    else:
        feedback.append("🎯 Perfect for vocals and instrumentals.")
    
    key = beat_plan.get('key', 'C Minor')
    if 'Minor' in key:
        feedback.append("🎭 Minor key: emotional vibes.")
    else:
        feedback.append("✨ Major key: uplifting feel.")
    
    genre = beat_plan.get('genre', '')
    if genre == 'Boom Bap':
        feedback.append("🎤 Keep that kick punchy!")
    elif genre == 'Trap':
        feedback.append("🔥 808s on point!")
    
    return feedback

# ============================================
# ROUTES
# ============================================

@app.get("/")
async def root():
    return {"message": "Barksdale Music API", "version": "2.0.0"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "features": ["beat_generation", "fl_studio_export", "bandlab"]}

@app.get("/api/options")
async def options():
    return {
        "producers": ["Conductor Williams", "Daringer", "Timbaland", "Dr. Dre", "J Dilla", "The Alchemist", "Metro Boomin", "Just Blaze", "DJ Premier", "RZA", "Madlib"],
        "genres": ["Boom Bap", "Hip Hop", "R&B", "Pop", "Jazz", "Trap", "Lo-Fi", "Drill"],
        "emotions": ["Dark", "Soulful", "Angry", "Hopeful", "Melancholy", "Chill", "Energetic"],
        "default_tempo": 78,
        "default_key": "C Minor"
    }

@app.post("/api/generate")
async def generate(request: BeatRequest):
    beat_plan = generate_beat(request.dict())
    beat_id = str(uuid.uuid4())
    beats[beat_id] = {**beat_plan, 'id': beat_id, 'created_at': datetime.utcnow().isoformat(), 'ai_feedback': generate_ai_feedback(beat_plan)}
    return {"id": beat_id, "template": beats[beat_id], "message": "Beat generated! 🎵"}

@app.post("/api/generate/pro")
async def generate_pro(request: BeatRequest):
    beat_plan = generate_pro_beat(request.dict())
    beat_id = str(uuid.uuid4())
    beats[beat_id] = {**beat_plan, 'id': beat_id, 'created_at': datetime.utcnow().isoformat(), 'premium': True, 'ai_feedback': generate_ai_feedback(beat_plan)}
    return {"id": beat_id, "template": beats[beat_id], "message": "🔥 PRO BEAT GENERATED!"}

@app.get("/api/download/{beat_id}")
async def download(beat_id: str):
    if beat_id not in beats:
        raise HTTPException(status_code=404, detail="Beat not found")
    zip_bytes = render_midi_pack(beats[beat_id])
    return StreamingResponse(io.BytesIO(zip_bytes), media_type="application/zip", headers={"Content-Disposition": f"attachment; filename=beat_{beat_id}.zip"})

@app.post("/api/export/flp")
async def export_flp_endpoint(request: ExportRequest):
    if request.beat_id:
        if request.beat_id not in beats:
            raise HTTPException(status_code=404, detail="Beat not found")
        beat_plan = beats[request.beat_id]
    else:
        beat_plan = generate_beat({})
    
    flp_data = export_flp(beat_plan)
    return StreamingResponse(io.BytesIO(flp_data), media_type="application/octet-stream", headers={"Content-Disposition": "attachment; filename=barksdale_beat.flp"})

@app.post("/api/export/midi-with-flp")
async def export_midi_with_flp(request: ExportRequest):
    if request.beat_id not in beats:
        raise HTTPException(status_code=404, detail="Beat not found")
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        midi_zip = render_midi_pack(beats[request.beat_id])
        with zipfile.ZipFile(io.BytesIO(midi_zip)) as midi_zf:
            for name in midi_zf.namelist():
                zf.writestr(name, midi_zf.read(name))
        
        if request.include_flp:
            zf.writestr('barksdale_beat.flp', export_flp(beats[request.beat_id]))
        
        zf.writestr('README.txt', """FL STUDIO SETUP
1. Open .flp file in FL Studio
2. Drums → FPC, Bass → FL Keys, Chords → Piano
3. Apply mixing presets from template.json
""")
    
    return StreamingResponse(io.BytesIO(zip_buffer.getvalue()), media_type="application/zip", headers={"Content-Disposition": "attachment; filename=beat_pack.zip"})

@app.post("/api/publish/bandlab")
async def publish_bandlab(request: BandLabRequest):
    if request.beat_id not in beats:
        raise HTTPException(status_code=404, detail="Beat not found")
    result = publish_to_bandlab(beats[request.beat_id], request.bandlab_token)
    return result

@app.get("/api/feedback/{beat_id}")
async def get_feedback(beat_id: str):
    if beat_id not in beats:
        raise HTTPException(status_code=404, detail="Beat not found")
    beat_plan = beats[beat_id]
    return {"beat_id": beat_id, "feedback": beat_plan.get('ai_feedback', generate_ai_feedback(beat_plan))}

@app.get("/api/gallery")
async def get_gallery():
    return {"beats": list(gallery.values()), "featured": [b for b in gallery.values() if b.get('featured')]}

@app.get("/api/battles")
async def get_battles():
    active = [b for b in beat_battles.values() if b.get('status') == 'active']
    return {"active": active, "current_week_theme": "Summer Vibes ☀️", "prize": "$50 Producer Pack"}

@app.get("/api/tutorials")
async def get_tutorials():
    return {"tutorials": [
        {"id": "garageband", "title": "GarageBand", "desc": "Import MIDI files", "duration": "10 min"},
        {"id": "flstudio", "title": "FL Studio", "desc": "Open .flp files", "duration": "12 min"},
        {"id": "flmobile", "title": "FL Studio Mobile", "desc": "Import MIDI on mobile", "duration": "8 min"},
        {"id": "bandlab", "title": "BandLab", "desc": "Publish directly", "duration": "6 min"}
    ]}

# Initialize sample battle
beat_battles['weekly_001'] = {'id': 'weekly_001', 'theme': 'Summer Vibes ☀️', 'status': 'active', 'prize': '$50 Producer Pack'}

# Run server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
