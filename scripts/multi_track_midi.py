# scripts/multi_track_midi.py
import io
import zipfile
import json

try:
    import pretty_midi
    HAS_PRETTY_MIDI = True
except ImportError:
    HAS_PRETTY_MIDI = False

# MIDI note mappings
DRUM_MAP = {
    'kick': 36,
    'snare': 38,
    'hat': 42,
    'open_hat': 46,
    'rim': 37,
    'clap': 39
}

CHORD_MAP = {
    'C': [60, 64, 67],
    'Cm': [60, 63, 67],
    'D': [62, 66, 69],
    'Dm': [62, 65, 69],
    'E': [64, 68, 71],
    'Em': [64, 67, 71],
    'F': [65, 69, 72],
    'Fm': [65, 68, 72],
    'G': [67, 71, 74],
    'Gm': [67, 70, 74],
    'A': [69, 73, 76],
    'Am': [69, 72, 76],
    'Bb': [70, 74, 77],
    'Ab': [68, 72, 75],
    'Eb': [63, 67, 70]
}


def chord_to_midi_bytes(chords, bpm=78):
    """Convert chord list to MIDI file bytes."""
    if not HAS_PRETTY_MIDI:
        return None
    
    midi = pretty_midi.PrettyMIDI(initial_tempo=bpm)
    piano = pretty_midi.Instrument(program=0, name='Piano')
    
    sec_per_bar = 60 / bpm * 4
    
    for i, chord in enumerate(chords):
        notes = CHORD_MAP.get(chord, [60, 64, 67])
        start = i * sec_per_bar
        end = start + sec_per_bar
        
        for note in notes:
            note_obj = pretty_midi.Note(velocity=100, pitch=note, start=start, end=end)
            piano.notes.append(note_obj)
    
    midi.instruments.append(piano)
    
    buf = io.BytesIO()
    midi.write(buf)
    return buf.getvalue()


def drums_to_midi_bytes(bpm=78):
    """Generate basic drum pattern as MIDI."""
    if not HAS_PRETTY_MIDI:
        return None
    
    midi = pretty_midi.PrettyMIDI(initial_tempo=bpm)
    drums = pretty_midi.Instrument(program=0, is_drum=True, name='Drums')
    
    # Basic boom bap pattern
    sec_per_step = (60 / bpm) / 4  # 16th note
    
    # Kick on 1 and 9
    for step in [0, 8]:
        note_obj = pretty_midi.Note(velocity=120, pitch=36, start=step * sec_per_step, end=step * sec_per_step + sec_per_step * 0.5)
        drums.notes.append(note_obj)
    
    # Snare on 5 and 13
    for step in [4, 12]:
        note_obj = pretty_midi.Note(velocity=115, pitch=38, start=step * sec_per_step, end=step * sec_per_step + sec_per_step * 0.5)
        drums.notes.append(note_obj)
    
    # Hi-hat pattern
    hat_pattern = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    for step, hit in enumerate(hat_pattern):
        if hit:
            note_obj = pretty_midi.Note(velocity=45, pitch=42, start=step * sec_per_step, end=step * sec_per_step + sec_per_step * 0.3)
            drums.notes.append(note_obj)
    
    midi.instruments.append(drums)
    
    buf = io.BytesIO()
    midi.write(buf)
    return buf.getvalue()


def bass_to_midi_bytes(chords, bpm=78):
    """Generate bass line from chords."""
    if not HAS_PRETTY_MIDI:
        return None
    
    midi = pretty_midi.PrettyMIDI(initial_tempo=bpm)
    bass = pretty_midi.Instrument(program=33, name='Electric Bass')
    
    # Bass note mapping (one octave down from chord root)
    bass_notes = {
        'C': 36, 'Cm': 36, 'D': 38, 'Dm': 38, 'E': 40, 'Em': 40,
        'F': 41, 'Fm': 41, 'G': 43, 'Gm': 43, 'A': 45, 'Am': 45,
        'Bb': 46, 'Ab': 44, 'Eb': 39
    }
    
    sec_per_bar = 60 / bpm * 4
    sec_per_step = sec_per_bar / 4
    
    for i, chord in enumerate(chords):
        root = bass_notes.get(chord, 36)
        start = i * sec_per_bar
        
        # Whole note bass
        note_obj = pretty_midi.Note(velocity=100, pitch=root, start=start, end=start + sec_per_bar * 0.95)
        bass.notes.append(note_obj)
        
        # Octave hit
        note_obj = pretty_midi.Note(velocity=90, pitch=root + 12, start=start, end=start + sec_per_step * 2)
        bass.notes.append(note_obj)
    
    midi.instruments.append(bass)
    
    buf = io.BytesIO()
    midi.write(buf)
    return buf.getvalue()


def render_midi_pack(chords, tempo=78, producer="Unknown", genre="Unknown", emotion="Unknown", key="C Minor"):
    """Generate MIDI pack as ZIP."""
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Chords MIDI
        if HAS_PRETTY_MIDI:
            chords_midi = chord_to_midi_bytes(chords, tempo)
            if chords_midi:
                zf.writestr('chords.mid', chords_midi)
            
            # Drums MIDI
            drums_midi = drums_to_midi_bytes(tempo)
            if drums_midi:
                zf.writestr('drums.mid', drums_midi)
            
            # Bass MIDI
            bass_midi = bass_to_midi_bytes(chords, tempo)
            if bass_midi:
                zf.writestr('bass.mid', bass_midi)
        
        # README
        readme = f"""
BEAT PACK - Barksdale Music Group
=================================

Producer: {producer}
Genre: {genre}
Emotion: {emotion}
Tempo: {tempo} BPM
Key: {key}

Chord Progression: {', '.join(chords)}

FILES INCLUDED:
- chords.mid: Piano/chord progression
- drums.mid: Basic drum pattern (import to drum machine)
- bass.mid: Bass line

HOW TO USE:
1. Download and unzip this file
2. Import MIDI files into your DAW
3. Assign sounds:
   - drums.mid → Drum track/kit
   - bass.mid → Bass synth or sampler
   - chords.mid → Piano or any melodic instrument

For GarageBand:
1. Create new project
2. File → Import → MIDI File
3. Select each track

For FL Studio:
1. Drag MIDI files into playlist
2. Assign to channels (FPC for drums)

For Logic Pro:
1. File → Import → MIDI File
2. Create tracks for each file

For BandLab:
1. Create new project
2. Import MIDI files to tracks

Questions? Check our tutorials section!

© Barksdale Music Group
        """
        zf.writestr('README.txt', readme)
        
        # Template JSON
        template = {
            "producer": producer,
            "genre": genre,
            "emotion": emotion,
            "tempo": tempo,
            "key": key,
            "chords": chords,
            "chord_line": ", ".join(chords),
            "mix_settings": {
                "kick": {"gain": -12, "eq_low": "+3dB @ 60Hz"},
                "snare": {"gain": -15, "eq_mid": "+2dB @ 200Hz"},
                "bass": {"gain": -14, "low_pass": "@ 200Hz"},
                "hats": {"gain": -18, "high_pass": "@ 10kHz"}
            },
            "mastering": {
                "lufs": -14,
                "true_peak": -1.0
            }
        }
        zf.writestr('template.json', json.dumps(template, indent=2))
    
    return zip_buffer.getvalue()


if __name__ == "__main__":
    # Test
    chords = ['Cm', 'Ab', 'Fm', 'G']
    zip_data = render_midi_pack(chords, tempo=78, producer="Test Producer", genre="Boom Bap", emotion="Dark", key="C Minor")
    
    with open("test_beat.zip", "wb") as f:
        f.write(zip_data)
    
    print(f"Test beat pack created: {len(zip_data)} bytes")
