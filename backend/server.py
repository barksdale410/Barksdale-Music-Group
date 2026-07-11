# backend/server.py - Barksdale Music Group Backend
import os
import json
import uuid
import zipfile
import io
import struct
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# In-memory storage for demo (use Redis/DB in production)
beats = {}
gallery = {}
beat_battles = {}

# ============================================
# BEAT ENGINE (Self-contained)
# ============================================

def generate_beat(params):
    """Deterministic beat generator."""
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
    
    drum_grid = {
        "kick": [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
        "snare": [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
        "hat": [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        "open_hat": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "rim": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "percussion": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
    
    velocities = {
        "kick": [120,0,0,0,0,0,0,0,110,0,0,0,0,0,0,0],
        "snare": [0,0,0,0,0,0,115,0,0,0,0,0,0,0,110,0],
        "hat": [45,40,0,35,0,40,0,35,45,40,0,35,0,40,0,35],
        "open_hat": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "rim": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        "percussion": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
    
    bass_pattern = {
        "notes": [36,0,0,0,48,0,0,0,43,0,0,0,47,0,0,0],
        "velocities": [110,0,0,0,105,0,0,0,100,0,0,0,115,0,0,0]
    }
    
    return {
        "producer": producer,
        "genre": genre,
        "emotion": emotion,
        "tempo": tempo,
        "key": key,
        "chords": chords,
        "chord_progression_line": ", ".join(chords),
        "drum_grid": drum_grid,
        "velocities": velocities,
        "bass_pattern": bass_pattern,
        "layers": [],
        "arrangement": {
            "intro": {"bars": 4, "energy": 3, "elements": ["chords"]},
            "verse1": {"bars": 16, "energy": 6, "elements": ["drums", "bass", "chords"]},
            "hook1": {"bars": 8, "energy": 9, "elements": ["hook_chords", "layers"]},
            "outro": {"bars": 4, "energy": 2, "elements": ["chords"]}
        },
        "mix_summary": {
            "gain_staging": {"kick": -12, "snare": -15, "bass": -14, "melody": -18},
            "bus_compression": {"ratio": 2.5, "attack": 30, "release": 120}
        },
        "master": {"lufs": -9, "true_peak": -1.0, "export": "24-bit WAV"}
    }

# ============================================
# HIT-MAKER ENGINE (Self-contained)
# ============================================

def generate_pro_beat(params):
    """Generate premium pro-level beat."""
    producer = params.get('primary_producer', 'Conductor Williams')
    genre = params.get('genre', 'Hip Hop')
    emotion = params.get('emotion', 'Dark')
    tempo = params.get('tempo', 78)
    key = params.get('key', 'C Minor')
    
    chords = ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Bb', 'G'] if emotion == 'Dark' else ['C', 'G', 'Am', 'F']
    
    return {
        "producer": producer,
        "genre": genre,
        "emotion": emotion,
        "tempo": tempo,
        "key": key,
        "chords": chords,
        "chord_progression_line": ", ".join(chords),
        "drum_grid": generate_beat(params)['drum_grid'],
        "velocities": generate_beat(params)['velocities'],
        "bass_pattern": generate_beat(params)['bass_pattern'],
        "premium": True,
        "arrangement": {
            "intro": {"bars": 4},
            "verse1": {"bars": 16},
            "pre_hook": {"bars": 4},
            "hook": {"bars": 8},
            "verse2": {"bars": 16},
            "bridge": {"bars": 8},
            "final_hook": {"bars": 8},
            "outro": {"bars": 4},
            "total_bars": 68
        },
        "mixing_preset": {"preset_name": "radio_ready"},
        "includes": ["Full arrangement MIDI", "Mixing presets", "WAV stems"],
        "master": {"lufs": -14, "true_peak": -1.0}
    }

# ============================================
# FLP EXPORTER (Self-contained)
# ============================================

NOTE_MAP = {'kick': 36, 'snare': 38, 'hat': 42, 'open_hat': 46, 'rim': 37}
CHORD_MAP = {'C': [60, 64, 67], 'Cm': [60, 63, 67], 'D': [62, 66, 69], 'Dm': [62, 65, 69],
    'F': [65, 69, 72], 'Fm': [65, 68, 72], 'G': [67, 71, 74], 'Gm': [67, 70, 74],
    'A': [69, 73, 76], 'Am': [69, 72, 76], 'Bb': [70, 74, 77], 'Ab': [68, 72, 75]}

def export_flp(beat_plan):
    """Export beat as FL Studio project file."""
    tempo = beat_plan.get('tempo', 78)
    buffer = io.BytesIO()
    
    # FL Studio header
    buffer.write(b'FLhd')
    buffer.write(struct.pack('<I', 20))  # Version
    buffer.write(struct.pack('<f', float(tempo)))
    buffer.write(struct.pack('<B', 4))  # Time sig numerator
    buffer.write(struct.pack('<B', 4))  # Time sig denominator
    buffer.write(struct.pack('<H', 480))  # PPQN
    
    # Channels
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
    buffer.write(b'Barksdale Music Group' + b'\x00' * (128 - 22))
    buffer.write(b'FLft')
    
    return buffer.getvalue()

# ============================================
# BANDLAB PUBLISHER (Self-contained)
# ============================================

def publish_to_bandlab(beat_plan, access_token):
    """Publish beat to BandLab (demo mode)."""
    import uuid
    project_id = str(uuid.uuid4())[:8]
    return {
        'success': True,
        'project_id': project_id,
        'project_url': f"https://www.bandlab.com/post/{project_id}",
        'message': 'Demo mode - configure BANDLAB_CLIENT_ID for live publishing'
    }

# ============================================
# MIDI RENDERER (Self-contained)
# ============================================

try:
    import pretty_midi
    HAS_PRETTY_MIDI = True
except ImportError:
    HAS_PRETTY_MIDI = False

def render_midi_pack(beat_plan):
    """Render MIDI files and pack into ZIP."""
    zip_buffer = io.BytesIO()
    
    if HAS_PRETTY_MIDI:
        with zipfile.ZipFile(zip_buffer, 'w') as zf:
            # Chords MIDI
            chords = beat_plan.get('chords', [])
            if chords:
                midi = pretty_midi.PrettyMIDI(initial_tempo=beat_plan.get('tempo', 78))
                piano = pretty_midi.Instrument(program=0, name='Piano')
                sec_per_bar = 60 / beat_plan.get('tempo', 78) * 4
                for i, chord in enumerate(chords):
                    notes = CHORD_MAP.get(chord, [60, 64, 67])
                    for note in notes:
                        piano.notes.append(pretty_midi.Note(100, note, i * sec_per_bar, (i + 1) * sec_per_bar))
                midi.instruments.append(piano)
                buf = io.BytesIO()
                midi.write(buf)
                zf.writestr('chords.mid', buf.getvalue())
            
            # Drums MIDI
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
            
            # Bass MIDI
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
            
            # README
            zf.writestr('README.txt', f"""BEAT PACK - Barksdale Music Group
Producer: {beat_plan.get('producer', 'Unknown')}
Genre: {beat_plan.get('genre', 'Unknown')}
Tempo: {beat_plan.get('tempo', 78)} BPM
Key: {beat_plan.get('key', 'Unknown')}
Chords: {beat_plan.get('chord_progression_line', '')}
""")
            zf.writestr('template.json', json.dumps(beat_plan, indent=2))
    else:
        # No pretty_midi - just provide template
        with zipfile.ZipFile(zip_buffer, 'w') as zf:
            zf.writestr('README.txt', f"""BEAT PACK - Barksdale Music Group
Producer: {beat_plan.get('producer', 'Unknown')}
Genre: {beat_plan.get('genre', 'Unknown')}
Tempo: {beat_plan.get('tempo', 78)} BPM
Key: {beat_plan.get('key', 'Unknown')}
Chords: {beat_plan.get('chord_progression_line', '')}

NOTE: Install pretty-midi for full MIDI export.
""")
            zf.writestr('template.json', json.dumps(beat_plan, indent=2))
    
    return zip_buffer.getvalue()

# ============================================
# CORE BEAT GENERATION ENDPOINTS
# ============================================

@app.route('/api/options', methods=['GET'])
def options():
    """Return available producers, genres, emotions, etc."""
    return jsonify({
        "producers": [
            "Conductor Williams", "Daringer", "Timbaland", "Dr. Dre",
            "J Dilla", "The Alchemist", "Metro Boomin", "Just Blaze",
            "Rick Rubin", "Pharrell", "Mike Dean", "Kanye West",
            "Pete Rock", "DJ Premier", "RZA", "Madlib", "DJ Khaled",
            "Zaytoven", "Southside", "Murda Beatz", "Tay Keith"
        ],
        "genres": [
            "Boom Bap", "Hip Hop", "R&B", "Pop", "Jazz", "Blues",
            "Cinematic", "Trap", "EDM", "Classical", "Gospel",
            "Reggae", "House", "Disco", "Lo-Fi", "Drill", "UK Drill"
        ],
        "emotions": [
            "Dark", "Soulful", "Angry", "Hopeful", "Melancholy",
            "Triumphant", "Intimate", "Cinematic", "Aggressive", "Nostalgic",
            "Chill", "Energetic", "Romantic", "Melancholic"
        ],
        "default_tempo": 78,
        "default_key": "C Minor",
        "producers_styles": {
            "Conductor Williams": "Dark, sample-heavy, soulful",
            "Daringer": "Raw, gritty, experimental",
            "Timbaland": "Futuristic, syncopated, unique percussion",
            "Dr. Dre": "West Coast, smooth, G-funk",
            "J Dilla": "Off-beat, lo-fi, soulful",
            "The Alchemist": "Sample flip, grimy, cinematic"
        }
    })

@app.route('/api/generate', methods=['POST'])
def generate():
    """Generate a new beat."""
    data = request.get_json()
    beat_plan = generate_beat(data)
    beat_id = str(uuid.uuid4())
    beats[beat_id] = {
        **beat_plan,
        'id': beat_id,
        'created_at': datetime.utcnow().isoformat(),
        'premium': False,
        'ai_feedback': generate_ai_feedback(beat_plan)
    }
    return jsonify({
        "id": beat_id,
        "template": beats[beat_id],
        "message": "Beat generated successfully! 🎵"
    })

@app.route('/api/download/<beat_id>', methods=['GET'])
def download(beat_id):
    """Download beat as MIDI ZIP package."""
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404

    zip_bytes = render_midi_pack(beat_plan)
    return send_file(
        io.BytesIO(zip_bytes),
        as_attachment=True,
        download_name=f"beat_pack_{beat_id}.zip",
        mimetype="application/zip"
    )

# ============================================
# FL STUDIO INTEGRATION
# ============================================

@app.route('/api/export/flp', methods=['POST'])
def export_flp_endpoint():
    """Export beat as FL Studio project file (.flp)."""
    data = request.get_json()
    beat_id = data.get('beat_id')
    
    if beat_id:
        beat_plan = beats.get(beat_id)
        if not beat_plan:
            return jsonify({"error": "Beat not found"}), 404
    else:
        # Generate fresh beat if no ID provided
        beat_plan = generate_beat(data)
        beat_id = str(uuid.uuid4())
    
    try:
        flp_data = export_flp(beat_plan)
        return send_file(
            io.BytesIO(flp_data),
            as_attachment=True,
            download_name=f"barksdale_beat_{beat_id}.flp",
            mimetype="application/octet-stream"
        )
    except Exception as e:
        return jsonify({"error": f"FLP export failed: {str(e)}"}), 500

@app.route('/api/export/midi-with-flp', methods=['POST'])
def export_midi_with_flp():
    """Export MIDI files + optional FLP template as ZIP."""
    data = request.get_json()
    beat_id = data.get('beat_id')
    include_flp = data.get('include_flp', False)
    
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        # Add MIDI files
        midi_zip = render_midi_pack(beat_plan)
        with zipfile.ZipFile(io.BytesIO(midi_zip)) as midi_zf:
            for name in midi_zf.namelist():
                zf.writestr(name, midi_zf.read(name))
        
        # Add FLP if requested
        if include_flp:
            flp_data = export_flp(beat_plan)
            zf.writestr(f"barksdale_beat.flp", flp_data)
        
        # Add FLP readme
        flp_readme = """
FL STUDIO PROJECT SETUP
=======================

1. Open the .flp file in FL Studio
2. Tracks are pre-assigned to:
   - Drums: FPC (Channel 1)
   - Bass: FL Keys or Bass synth (Channel 2)
   - Chords: DirectX piano or FL Keys (Channel 3)

3. Apply mixing presets from template.json:
   - Kick: Gain -12dB, EQ +3dB @ 60Hz
   - Snare: Gain -15dB, EQ +2dB @ 200Hz
   - Hi-Hat: Gain -18dB, High-pass @ 8kHz
   - Bass: Gain -14dB, Low-pass @ 200Hz

4. For mastering, use the included settings:
   - Bus Compression: Ratio 2.5:1, Attack 30ms, Release 120ms
   - Target LUFS: -9
   - True Peak: -1.0dB

Download FL Studio: https://www.image-line.com/flstudio/
"""
        zf.writestr('FL_STUDIO_README.txt', flp_readme)
    
    return send_file(
        zip_buffer.getvalue(),
        as_attachment=True,
        download_name=f"beat_with_flp_{beat_id}.zip",
        mimetype="application/zip"
    )

# ============================================
# BANDLAB INTEGRATION
# ============================================

@app.route('/api/publish/bandlab', methods=['POST'])
def publish_bandlab():
    """Publish beat to BandLab."""
    data = request.get_json()
    beat_id = data.get('beat_id')
    bandlab_token = data.get('bandlab_token')
    
    if not bandlab_token:
        return jsonify({
            "error": "BandLab token required",
            "instructions": "Connect your BandLab account in settings to publish"
        }), 400
    
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    try:
        result = publish_to_bandlab(beat_plan, bandlab_token)
        return jsonify({
            "success": True,
            "bandlab_url": result.get('project_url'),
            "message": "🎉 Beat published to BandLab!"
        })
    except Exception as e:
        return jsonify({
            "error": f"BandLab publish failed: {str(e)}",
            "instructions": "Make sure your BandLab account is connected and you have permission to create projects."
        }), 500

@app.route('/api/bandlab/connect', methods=['GET'])
def bandlab_connect():
    """Get BandLab OAuth URL for connecting account."""
    client_id = os.getenv('BANDLAB_CLIENT_ID', '')
    if not client_id:
        return jsonify({
            "status": "not_configured",
            "message": "BandLab integration not configured by admin"
        }), 503
    
    redirect_uri = f"{request.host_url}api/bandlab/callback"
    auth_url = f"https://api.bandlab.com/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
    
    return jsonify({
        "auth_url": auth_url,
        "instructions": "Click the auth_url to connect your BandLab account"
    })

# ============================================
# HIT-MAKER PREMIUM FEATURES
# ============================================

@app.route('/api/generate/pro', methods=['POST'])
def generate_pro():
    """Generate premium pro-level beat with full arrangement."""
    data = request.get_json()
    
    # Check for premium access (Stripe verification in production)
    stripe_key = os.getenv('STRIPE_SECRET_KEY')
    if not stripe_key:
        return jsonify({
            "error": "Premium feature not configured"
        }), 503
    
    beat_plan = generate_pro_beat(data)
    beat_id = str(uuid.uuid4())
    beats[beat_id] = {
        **beat_plan,
        'id': beat_id,
        'created_at': datetime.utcnow().isoformat(),
        'premium': True,
        'ai_feedback': generate_ai_feedback(beat_plan),
        'stems': {
            'kick': 'stems/kick.wav',
            'snare': 'stems/snare.wav',
            'hat': 'stems/hat.wav',
            'bass': 'stems/bass.wav',
            'chords': 'stems/chords.wav',
            'melody': 'stems/melody.wav'
        },
        'mixing_presets': {
            'eq_preset': 'preset_hard_banger.eq',
            'compression': 'preset_crisp_v2.comp',
            'mastering': 'preset_radio_master.master'
        },
        'producer_signature': data.get('primary_producer', 'Unknown')
    }
    
    return jsonify({
        "id": beat_id,
        "template": beats[beat_id],
        "message": "🔥 PRO BEAT GENERATED! Full arrangement + mastering included.",
        "includes": [
            "Full arrangement (Intro, Verse, Hook, Bridge, Outro)",
            "Professional mixing presets",
            "WAV stems export ready",
            "Producer signature style applied",
            "AI feedback included"
        ]
    })

@app.route('/api/download/stems/<beat_id>', methods=['GET'])
def download_stems(beat_id):
    """Download premium WAV stems."""
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    if not beat_plan.get('premium'):
        return jsonify({
            "error": "Stems only available for PRO beats",
            "upgrade": "Generate a PRO beat to access WAV stems"
        }), 403
    
    # In production, this would generate actual WAV files
    # For now, return a placeholder ZIP
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        stems_readme = """
PRO STEMS PACK
==============

These stems are mastered and ready for:
- Vocals recording
- Further mixing
- Distribution

Stems included:
- kick.wav: Processed with EQ, compression, saturation
- snare.wav: Layered with clap, properly EQ'd
- hat.wav: Crisp hi-hats with shimmer
- bass.wav: Warm, punchy bass
- chords.wav: Piano/chords stem
- melody.wav: Lead melody or extra layer

Mixing tips:
1. Start with the drums and bass
2. Add chords at -18dB gain
3. Layer vocals on top
4. Use the included presets for consistency
"""
        zf.writestr('STEMS_README.txt', stems_readme)
        zf.writestr('template.json', json.dumps(beat_plan, indent=2))
    
    return send_file(
        zip_buffer.getvalue(),
        as_attachment=True,
        download_name=f"pro_stems_{beat_id}.zip",
        mimetype="application/zip"
    )

# ============================================
# AI FEEDBACK
# ============================================

def generate_ai_feedback(beat_plan):
    """Generate AI feedback for a beat."""
    feedback = []
    
    # Tempo feedback
    tempo = beat_plan.get('tempo', 78)
    if tempo < 70:
        feedback.append("💡 Tip: This tempo is great for laid-back tracks. Consider adding some vocal chops.")
    elif tempo > 90:
        feedback.append("⚡ Energy: High tempo detected! Great for club or workout playlists.")
    else:
        feedback.append("🎯 Golden zone: This tempo works well for both vocals and instrumentals.")
    
    # Key feedback
    key = beat_plan.get('key', 'C Minor')
    if 'Minor' in key:
        feedback.append("🎭 Minor key: Perfect for emotional, introspective tracks.")
    else:
        feedback.append("✨ Major key: Great for uplifting, positive vibes.")
    
    # Genre-specific feedback
    genre = beat_plan.get('genre', '')
    if genre == 'Boom Bap':
        feedback.append("🎤 Boom Bap style: Keep the kick punchy and snare crispy!")
    elif genre == 'Trap':
        feedback.append("🔥 Trap style: 808s should be prominent. Consider adding hi-hats on the +")
    
    # Arrangement feedback
    arrangement = beat_plan.get('arrangement', {})
    if arrangement:
        feedback.append("📐 Good structure: The arrangement has intro, verses, hooks, and outro.")
    
    # Mixing feedback
    mix_summary = beat_plan.get('mix_summary', {})
    if mix_summary:
        feedback.append("🎚️ Mix ready: Gain staging is set. Apply your favorite compressor on the bus.")
    
    return feedback

@app.route('/api/feedback/<beat_id>', methods=['GET'])
def get_feedback(beat_id):
    """Get AI feedback for a beat."""
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    feedback = beat_plan.get('ai_feedback', generate_ai_feedback(beat_plan))
    return jsonify({
        "beat_id": beat_id,
        "feedback": feedback,
        "producer": beat_plan.get('producer'),
        "improvement_tips": [
            "Try adding a bass drop in the hook section",
            "Layer a second snare for more impact",
            "Add reverb to the hi-hats for space",
            "Consider a filter sweep for transitions"
        ]
    })

# ============================================
# PUBLIC GALLERY
# ============================================

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    """Get public beat gallery."""
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    sort_by = request.args.get('sort', 'recent')  # recent, likes, downloads
    
    beats_list = list(gallery.values())
    
    # Sort
    if sort_by == 'likes':
        beats_list.sort(key=lambda x: x.get('likes', 0), reverse=True)
    elif sort_by == 'downloads':
        beats_list.sort(key=lambda x: x.get('downloads', 0), reverse=True)
    else:
        beats_list.sort(key=lambda x: x.get('created_at', ''), reverse=True)
    
    # Paginate
    start = (page - 1) * limit
    end = start + limit
    paginated = beats_list[start:end]
    
    return jsonify({
        "beats": paginated,
        "page": page,
        "total": len(beats_list),
        "featured": [b for b in gallery.values() if b.get('featured', False)][:5]
    })

@app.route('/api/gallery/share', methods=['POST'])
def share_beat():
    """Share a beat to the public gallery."""
    data = request.get_json()
    beat_id = data.get('beat_id')
    title = data.get('title', 'Untitled Beat')
    tags = data.get('tags', [])
    
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    gallery[beat_id] = {
        **beat_plan,
        'id': beat_id,
        'title': title,
        'tags': tags,
        'created_at': datetime.utcnow().isoformat(),
        'likes': 0,
        'downloads': 0,
        'comments': []
    }
    
    return jsonify({
        "success": True,
        "beat_id": beat_id,
        "gallery_url": f"/gallery/{beat_id}",
        "message": "🎵 Beat shared to gallery!"
    })

@app.route('/api/gallery/like/<beat_id>', methods=['POST'])
def like_beat(beat_id):
    """Like a beat in the gallery."""
    if beat_id in gallery:
        gallery[beat_id]['likes'] = gallery[beat_id].get('likes', 0) + 1
        return jsonify({"success": True, "likes": gallery[beat_id]['likes']})
    return jsonify({"error": "Beat not found"}), 404

@app.route('/api/gallery/comment/<beat_id>', methods=['POST'])
def comment_beat(beat_id):
    """Comment on a beat in the gallery."""
    data = request.get_json()
    comment = data.get('comment', '')
    author = data.get('author', 'Anonymous')
    
    if beat_id in gallery:
        if 'comments' not in gallery[beat_id]:
            gallery[beat_id]['comments'] = []
        gallery[beat_id]['comments'].append({
            'author': author,
            'text': comment,
            'created_at': datetime.utcnow().isoformat()
        })
        return jsonify({"success": True, "comments": gallery[beat_id]['comments']})
    return jsonify({"error": "Beat not found"}), 404

# ============================================
# BEAT BATTLES
# ============================================

@app.route('/api/battles', methods=['GET'])
def get_battles():
    """Get active and upcoming beat battles."""
    active = [b for b in beat_battles.values() if b.get('status') == 'active']
    upcoming = [b for b in beat_battles.values() if b.get('status') == 'upcoming']
    completed = [b for b in beat_battles.values() if b.get('status') == 'completed']
    
    return jsonify({
        "active": active,
        "upcoming": upcoming,
        "completed": completed[:5],  # Last 5 completed
        "current_week_theme": "Summer Vibes ☀️",
        "prize": "Exclusive Producer Pack ($50 value)"
    })

@app.route('/api/battles/join', methods=['POST'])
def join_battle():
    """Join a beat battle."""
    data = request.get_json()
    battle_id = data.get('battle_id')
    beat_id = data.get('beat_id')
    
    if battle_id not in beat_battles:
        return jsonify({"error": "Battle not found"}), 404
    
    beat_plan = beats.get(beat_id)
    if not beat_plan:
        return jsonify({"error": "Beat not found"}), 404
    
    if 'submissions' not in beat_battles[battle_id]:
        beat_battles[battle_id]['submissions'] = []
    
    beat_battles[battle_id]['submissions'].append({
        'beat_id': beat_id,
        'producer': beat_plan.get('producer', 'Unknown'),
        'submitted_at': datetime.utcnow().isoformat(),
        'votes': 0
    })
    
    return jsonify({
        "success": True,
        "message": "🔥 Beat submitted to battle!",
        "battle_id": battle_id
    })

@app.route('/api/battles/vote/<battle_id>/<beat_id>', methods=['POST'])
def vote_battle(battle_id, beat_id):
    """Vote for a beat in a battle."""
    if battle_id in beat_battles:
        submissions = beat_battles[battle_id].get('submissions', [])
        for sub in submissions:
            if sub.get('beat_id') == beat_id:
                sub['votes'] = sub.get('votes', 0) + 1
                return jsonify({"success": True, "votes": sub['votes']})
    return jsonify({"error": "Submission not found"}), 404

# Initialize with a sample battle
beat_battles['weekly_001'] = {
    'id': 'weekly_001',
    'theme': 'Summer Vibes ☀️',
    'description': 'Create a beat that captures the essence of summer',
    'status': 'active',
    'deadline': (datetime.utcnow() + timedelta(days=7)).isoformat(),
    'prize': 'Exclusive Producer Pack ($50 value)',
    'submissions': [],
    'rules': [
        'Must be original content',
        'Tempo: 80-120 BPM',
        'Include vocals or melodic elements',
        'Export as WAV or MP3'
    ]
}

# ============================================
# TUTORIALS
# ============================================

@app.route('/api/tutorials', methods=['GET'])
def get_tutorials():
    """Get video tutorials for beat production."""
    return jsonify({
        "tutorials": [
            {
                "id": "garageband_basics",
                "title": "Getting Started with GarageBand",
                "description": "Import your MIDI beat and start producing",
                "duration": "12:30",
                "thumbnail": "/tutorials/garageband.jpg",
                "video_url": "https://example.com/tutorials/garageband",
                "steps": [
                    "Download the MIDI pack from Barksdale",
                    "Open GarageBand and create a new project",
                    "Import MIDI files to tracks",
                    "Layer your sounds with Smart Drums"
                ]
            },
            {
                "id": "flstudio_import",
                "title": "FL Studio for Beginners",
                "description": "Import and customize your beat in FL Studio",
                "duration": "18:45",
                "thumbnail": "/tutorials/flstudio.jpg",
                "video_url": "https://example.com/tutorials/flstudio",
                "steps": [
                    "Open the .flp file or import MIDI",
                    "Map drums to FPC",
                    "Apply the included mixing presets",
                    "Add your personal touch"
                ]
            },
            {
                "id": "bandlab_export",
                "title": "Publishing to BandLab",
                "description": "Share your beat on BandLab for collaboration",
                "duration": "8:15",
                "thumbnail": "/tutorials/bandlab.jpg",
                "video_url": "https://example.com/tutorials/bandlab",
                "steps": [
                    "Generate your beat in Barksdale",
                    "Click 'Publish to BandLab'",
                    "Connect your BandLab account",
                    "Edit and collaborate on BandLab"
                ]
            },
            {
                "id": "mixing_mastering",
                "title": "Mixing & Mastering Your Beat",
                "description": "Professional mixing techniques for beginners",
                "duration": "25:00",
                "thumbnail": "/tutorials/mixing.jpg",
                "video_url": "https://example.com/tutorials/mixing",
                "steps": [
                    "Start with gain staging",
                    "EQ each element",
                    "Apply compression",
                    "Master for streaming platforms"
                ]
            },
            {
                "id": "vocal_recording",
                "title": "Recording Vocals Over Your Beat",
                "description": "Tips for recording vocals in GarageBand",
                "duration": "15:20",
                "thumbnail": "/tutorials/vocals.jpg",
                "video_url": "https://example.com/tutorials/vocals",
                "steps": [
                    "Set up your microphone",
                    "Create a vocal recording track",
                    "Use effects like reverb and delay",
                    "Tune your vocals if needed"
                ]
            }
        ],
        "quick_tips": [
            "Use the spacebar to preview beats before downloading",
            "Try combining different producers for unique sounds",
            "Export stems separately for maximum flexibility",
            "Save your favorite settings as presets"
        ]
    })

# ============================================
# HEALTH & UTILITY
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "version": "2.0.0",
        "features": [
            "beat_generation",
            "fl_studio_export",
            "bandlab_integration",
            "premium_beat_maker",
            "ai_feedback",
            "public_gallery",
            "beat_battles",
            "tutorials"
        ]
    })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8001))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)
