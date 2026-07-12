# backend/scripts/multi_track_midi_advanced.py
"""Advanced multi-track MIDI generator with producer-specific settings"""
import io
import zipfile
import pretty_midi
import json
from pathlib import Path

CHORD_MAP = {
    'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
    'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
    'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71, 'Cb': 71
}

PRODUCER_CONFIGS = {
    "conductor_williams": {"name": "Conductor Williams", "tempo_range": [70, 85], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 52, "characteristic": "Cinematic, orchestral samples, dramatic arrangements"},
    "daringer": {"name": "Daringer", "tempo_range": [75, 90], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 88, "characteristic": "Lo-fi, gritty, sample-heavy boom bap"},
    "conductor_daringer_hybrid": {"name": "Conductor Williams x Daringer Hybrid", "tempo_range": [72, 88], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 52, "characteristic": "Cinematic boom bap with lo-fi aesthetics"},
    "big_ghost_swiss_beatz": {"name": "Big Ghost Ltd x Swiss Beatz", "tempo_range": [65, 80], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 90, "characteristic": "Dark, minimalist, MPC-era authenticity"},
    "hitmen_90s": {"name": "The Hitmen (90s SP-1200 Era)", "tempo_range": [85, 100], "drum_program": 0, "bass_program": 32, "keys_program": 0, "pad_program": 0, "characteristic": "Classic East Coast, SP-1200 drums, chopped samples"},
    "hitmen_2000s": {"name": "The Hitmen (2000s Interpolation Era)", "tempo_range": [75, 95], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "R&B-infused, interpolation-heavy Bad Boy sound"},
    "alchemist": {"name": "The Alchemist", "tempo_range": [78, 95], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Jazz-infused, flip-prone, dusty textures"},
    "metro_boomin": {"name": "Metro Boomin", "tempo_range": [140, 160], "drum_program": 1, "bass_program": 43, "keys_program": 0, "pad_program": 17, "characteristic": "Trap, 808s, dark synths, stacked hi-hats"},
    "timbaland": {"name": "Timbaland", "tempo_range": [88, 105], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 17, "characteristic": "Syncopated, polyrhythmic, futuristic beats"},
    "just_blaze": {"name": "Just Blaze", "tempo_range": [80, 100], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Gospel samples, anthemic, church energy"},
    "dre": {"name": "Dr. Dre", "tempo_range": [75, 95], "drum_program": 0, "bass_program": 43, "keys_program": 0, "pad_program": 17, "characteristic": "G-funk, live instruments, smooth bass"},
    "kanye": {"name": "Kanye West", "tempo_range": [85, 105], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Soul samples, 808s, innovative production"},
    "mannie_fresh": {"name": "Mannie Fresh", "tempo_range": [80, 100], "drum_program": 1, "bass_program": 43, "keys_program": 0, "pad_program": 17, "characteristic": "New Orleans bounce, live bounce, funky"},
    "jermaine_dupri": {"name": "Jermaine Dupri", "tempo_range": [85, 100], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "So So Def, Atlanta hip-hop, party beats"},
    "dilla": {"name": "J Dilla", "tempo_range": [75, 95], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Off-beat swings, MPC magic, soulful"},
    "premier": {"name": "DJ Premier", "tempo_range": [80, 95], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 0, "characteristic": "Scratch-heavy, head-nodding, boom bap king"},
    "pete_rock": {"name": "Pete Rock", "tempo_range": [80, 95], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Soulful loops, live feel, sample-rich"},
    "rza": {"name": "RZA", "tempo_range": [75, 90], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 0, "characteristic": "Kung-fu samples, martial arts, Wu-Tang sound"},
    "madlib": {"name": "Madlib", "tempo_range": [70, 95], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Eclectic samples, experimental, genre-blending"},
    "nicholas_craven": {"name": "Nicholas Craven", "tempo_range": [68, 82], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 88, "characteristic": "Lo-fi, film noir, sophisticated boom bap"},
    "ninth_wonder": {"name": "9th Wonder", "tempo_range": [78, 92], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Academic boom bap, Duke-era soul"},
    "babyface": {"name": "Babyface", "tempo_range": [72, 92], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Smooth R&B, melodic, radio-ready"},
    "bryan_michael_cox": {"name": "Bryan-Michael Cox", "tempo_range": [72, 92], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Club bangers, Lil Jon era, crunk-R&B"},
    "darkchild": {"name": "Rodney Jerkins (Darkchild)", "tempo_range": [75, 95], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Dark, edgy R&B, Grammy-winning production"},
    "dmile": {"name": "D'Mile", "tempo_range": [65, 85], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 17, "characteristic": "Alternative R&B, moody, forward-thinking"},
    "raphael_saadiq": {"name": "Raphael Saadiq", "tempo_range": [70, 90], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Live instruments, 60s/70s soul revival"},
    "james_poyser": {"name": "James Poyser", "tempo_range": [70, 90], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Neo-soul, Erykah Badu era, organic"},
    "kaytranada": {"name": "Kaytranada", "tempo_range": [100, 120], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 17, "characteristic": "Electronic, disco, house-influenced hip-hop"},
    "nineteen85": {"name": "Nineteen85", "tempo_range": [72, 88], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Drake producer, minimalist, moody"},
    "illangelo": {"name": "Illangelo", "tempo_range": [75, 90], "drum_program": 1, "bass_program": 43, "keys_program": 0, "pad_program": 17, "characteristic": "Dark, atmospheric, The Weeknd signature"},
    "noah40": {"name": "Noah '40' Shebib", "tempo_range": [68, 85], "drum_program": 1, "bass_program": 43, "keys_program": 0, "pad_program": 17, "characteristic": "Minimalist, 808s, emotional depth"},
    "frank_dukes": {"name": "Frank Dukes", "tempo_range": [75, 95], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Pop-urban crossover, major label sound"},
    "jack_antonoff": {"name": "Jack Antonoff", "tempo_range": [100, 130], "drum_program": 1, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Synth-pop, indie, Taylor Swift/Bleachers sound"}
}

def parse_chord(chord_str):
    chord_str = chord_str.strip()
    if not chord_str:
        return None, None
    if '/' in chord_str:
        chord_str = chord_str.split('/')[0]
    for i in range(min(2, len(chord_str)), 0, -1):
        root_candidate = chord_str[:i]
        if root_candidate in CHORD_MAP:
            root = root_candidate
            type_str = chord_str[i:]
            break
    else:
        root = chord_str[0]
        type_str = chord_str[1:]
    if not type_str:
        return root, 'maj'
    if type_str in ('m', 'min'):
        return root, 'min'
    elif type_str == 'maj7':
        return root, 'maj7'
    elif type_str == '7':
        return root, '7'
    elif type_str == 'm7':
        return root, 'm7'
    elif type_str == 'm9':
        return root, 'm9'
    elif type_str == 'maj9':
        return root, 'maj9'
    elif type_str == 'dim':
        return root, 'dim'
    elif type_str == 'aug':
        return root, 'aug'
    elif type_str == 'sus4':
        return root, 'sus4'
    elif type_str == 'sus2':
        return root, 'sus2'
    else:
        return root, 'maj'

def get_chord_notes(root, chord_type):
    intervals = {'maj': [0, 4, 7], 'min': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], 'm9': [0, 3, 7, 10, 14], 'maj9': [0, 4, 7, 11, 14], 'dim': [0, 3, 6], 'aug': [0, 4, 8], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7]}
    root_note = CHORD_MAP.get(root, 60)
    chord_intervals = intervals.get(chord_type, [0, 4, 7])
    return [root_note + i for i in chord_intervals]

def create_drums(midi, tempo, producer_config, num_bars=8):
    drum = pretty_midi.Instrument(program=producer_config.get("drum_program", 0), is_drum=True, name='Drums')
    sec_per_beat = 60 / tempo
    sec_per_bar = sec_per_beat * 4
    kick_steps = [0, 6, 12]
    snare_steps = [4, 12]
    hat_steps = list(range(16))
    producer_name = producer_config.get("name", "").lower()
    if "metro" in producer_name or "trap" in producer_name:
        kick_steps = [0, 4, 8, 12]
        snare_steps = [6, 14]
        hat_steps = list(range(32))
    elif "premier" in producer_name or "dilla" in producer_name:
        kick_steps = [0, 6.5, 12]
        snare_steps = [4.5, 12.5]
    elif "dre" in producer_name:
        kick_steps = [0, 7, 12]
        hat_steps = [0, 2, 4, 6, 8, 10, 12, 14]
    elif "rza" in producer_name:
        kick_steps = [0, 8]
        snare_steps = [5, 13]
        hat_steps = [0, 4, 8, 12]
    for step in kick_steps:
        start = (step / 16) * sec_per_bar
        vel = 120 if step % 4 == 0 else 100
        note = pretty_midi.Note(velocity=vel, pitch=36, start=start, end=start + sec_per_beat * 0.3)
        drum.notes.append(note)
    for step in snare_steps:
        start = (step / 16) * sec_per_bar
        vel = 110 if step % 4 == 0 else 95
        note = pretty_midi.Note(velocity=vel, pitch=38, start=start, end=start + sec_per_beat * 0.25)
        drum.notes.append(note)
    for step in hat_steps:
        start = (step / 32 if "metro" in producer_name else step / 16) * sec_per_bar
        vel = 65 if step % 4 == 0 else 45
        note = pretty_midi.Note(velocity=vel, pitch=42, start=start, end=start + sec_per_beat * 0.15)
        drum.notes.append(note)
    midi.instruments.append(drum)

def create_bass(midi, chords, tempo, producer_config):
    bass = pretty_midi.Instrument(program=producer_config.get("bass_program", 33), name='Bass')
    sec_per_bar = (60 / tempo) * 4
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        bass_note = CHORD_MAP.get(root, 60) - 24
        start = i * sec_per_bar
        end = start + sec_per_bar * 0.95
        producer_name = producer_config.get("name", "").lower()
        if "metro" in producer_name or "drake" in producer_name or "40" in producer_name:
            bass_note -= 12
        note = pretty_midi.Note(velocity=105, pitch=bass_note, start=start, end=end)
        bass.notes.append(note)
    midi.instruments.append(bass)

def create_keys(midi, chords, tempo, producer_config):
    keys = pretty_midi.Instrument(program=producer_config.get("keys_program", 0), name='Piano')
    sec_per_bar = (60 / tempo) * 4
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        notes = get_chord_notes(root, chord_type)
        start = i * sec_per_bar
        end = start + sec_per_bar * 0.9
        for j, note_num in enumerate(notes[:3]):
            offset = j * 0.1
            note = pretty_midi.Note(velocity=80, pitch=note_num, start=start + offset, end=end)
            keys.notes.append(note)
    midi.instruments.append(keys)

def create_pad(midi, chords, tempo, producer_config):
    pad = pretty_midi.Instrument(program=producer_config.get("pad_program", 52), name='Pad')
    sec_per_bar = (60 / tempo) * 4
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        notes = get_chord_notes(root, chord_type)
        start = i * sec_per_bar
        end = start + sec_per_bar
        for note_num in notes[:3]:
            note = pretty_midi.Note(velocity=55, pitch=note_num - 12, start=start, end=end)
            pad.notes.append(note)
    midi.instruments.append(pad)

def render_advanced_midi_pack(chords, tempo=78, producer="Unknown", genre="Unknown", emotion="Unknown", key="C Minor", template_id=None):
    producer_config = PRODUCER_CONFIGS.get(template_id, {"name": producer, "tempo_range": [75, 90], "drum_program": 0, "bass_program": 33, "keys_program": 0, "pad_program": 4, "characteristic": "Custom production"})
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
        create_drums(midi, tempo, producer_config, num_bars=len(chords))
        create_bass(midi, chords, tempo, producer_config)
        create_keys(midi, chords, tempo, producer_config)
        create_pad(midi, chords, tempo, producer_config)
        midi_buffer = io.BytesIO()
        midi.write(midi_buffer)
        zf.writestr('producer_beat.mid', midi_buffer.getvalue())
        readme = f"""BARKSDALE MUSIC GROUP - Producer Beat Pack
Producer: {producer}
Template: {template_id or 'Custom'}
Genre: {genre}
Emotion: {emotion}
Tempo: {tempo} BPM
Key: {key}
Chord Progression: {', '.join(chords)}
Producer Characteristics: {producer_config.get('characteristic', 'Professional production quality')}
Mixing Presets: Kick -12dB, Snare -15dB, Bass -14dB, Melody -18dB
WARNING: Maximum 4 Scaler EQ instances on iPhone 14. Use Track Lock/Merge.
WARNING: Export normalizes to -1dB True Peak / -9 LUFS."""
        zf.writestr('README.txt', readme)
        if template_id:
            template_data = {"producer": producer, "template_id": template_id, "genre": genre, "emotion": emotion, "tempo": tempo, "key": key, "chords": chords, "characteristic": producer_config.get("characteristic", ""), "sections": ["INTRO", "VERSE", "PRE-CHORUS", "CHORUS", "POST-CHORUS", "BRIDGE", "HOOK", "OUTRO", "INTERLUDE", "BREAK", "TAG"]}
            zf.writestr('template.json', json.dumps(template_data, indent=2))
    return zip_buffer.getvalue()

def get_available_templates():
    return list(PRODUCER_CONFIGS.keys())

if __name__ == "__main__":
    test_chords = ["Cm", "Ab", "Fm", "G"]
    zip_data = render_advanced_midi_pack(chords=test_chords, tempo=78, producer="Conductor Williams", genre="Boom Bap", emotion="Cinematic", key="C Minor", template_id="conductor_williams")
    print(f"Generated {len(zip_data)} bytes MIDI pack")
