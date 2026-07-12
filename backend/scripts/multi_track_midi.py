# scripts/multi_track_midi.py
import io
import zipfile
import pretty_midi
import json

CHORD_MAP = {
    'C': 60, 'C#': 61, 'Db': 61, 'D': 62, 'D#': 63, 'Eb': 63,
    'E': 64, 'F': 65, 'F#': 66, 'Gb': 66, 'G': 67, 'G#': 68,
    'Ab': 68, 'A': 69, 'A#': 70, 'Bb': 70, 'B': 71, 'Cb': 71
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
    intervals = {
        'maj': [0, 4, 7],
        'min': [0, 3, 7],
        '7': [0, 4, 7, 10],
        'm7': [0, 3, 7, 10],
        'maj7': [0, 4, 7, 11],
        'm9': [0, 3, 7, 10, 14],
        'maj9': [0, 4, 7, 11, 14],
        'dim': [0, 3, 6],
        'aug': [0, 4, 8],
        'sus4': [0, 5, 7],
        'sus2': [0, 2, 7],
    }
    root_note = CHORD_MAP.get(root, 60)
    intervals = intervals.get(chord_type, [0, 4, 7])
    return [root_note + i for i in intervals]

def chord_to_midi(chords, tempo=78):
    midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
    piano = pretty_midi.Instrument(program=0, name='Acoustic Grand Piano')
    sec_per_bar = 60 / tempo * 4
    chord_duration = sec_per_bar
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        notes = get_chord_notes(root, chord_type)
        start = i * chord_duration
        end = start + chord_duration
        for note in notes:
            note_obj = pretty_midi.Note(velocity=100, pitch=note, start=start, end=end)
            piano.notes.append(note_obj)
    midi.instruments.append(piano)
    with io.BytesIO() as f:
        midi.write(f)
        return f.getvalue()

def drums_to_midi(tempo=78):
    midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
    drum_track = pretty_midi.Instrument(program=0, is_drum=True, name='Drums')
    sec_per_step = (60 / tempo) / 4
    kick_hits = [0, 6]
    snare_hits = [4, 12]
    hat_hits = [0, 2, 4, 6, 8, 10, 12, 14]
    for step in kick_hits:
        start = step * sec_per_step
        note = pretty_midi.Note(velocity=120, pitch=36, start=start, end=start + sec_per_step * 0.5)
        drum_track.notes.append(note)
    for step in snare_hits:
        start = step * sec_per_step
        note = pretty_midi.Note(velocity=110, pitch=38, start=start, end=start + sec_per_step * 0.5)
        drum_track.notes.append(note)
    for step in hat_hits:
        start = step * sec_per_step
        vel = 60 if step % 4 == 0 else 40
        note = pretty_midi.Note(velocity=vel, pitch=42, start=start, end=start + sec_per_step * 0.4)
        drum_track.notes.append(note)
    midi.instruments.append(drum_track)
    with io.BytesIO() as f:
        midi.write(f)
        return f.getvalue()

def bass_to_midi(chords, tempo=78):
    midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
    bass_track = pretty_midi.Instrument(program=33, name='Electric Bass')
    sec_per_bar = 60 / tempo * 4
    chord_duration = sec_per_bar
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        root_note = CHORD_MAP.get(root, 60) - 24
        start = i * chord_duration
        end = start + chord_duration
        note = pretty_midi.Note(velocity=100, pitch=root_note, start=start, end=end)
        bass_track.notes.append(note)
    midi.instruments.append(bass_track)
    with io.BytesIO() as f:
        midi.write(f)
        return f.getvalue()

def layers_to_midi(chords, tempo=78):
    midi = pretty_midi.PrettyMIDI(initial_tempo=tempo)
    rhodes = pretty_midi.Instrument(program=4, name='Rhodes')
    sec_per_bar = 60 / tempo * 4
    chord_duration = sec_per_bar
    for i, chord_str in enumerate(chords):
        root, chord_type = parse_chord(chord_str)
        if not root:
            continue
        notes = get_chord_notes(root, chord_type)
        pad_notes = notes[1:3] if len(notes) >= 3 else notes
        start = i * chord_duration
        end = start + chord_duration
        for note in pad_notes:
            note_obj = pretty_midi.Note(velocity=60, pitch=note + 12, start=start, end=end)
            rhodes.notes.append(note_obj)
    midi.instruments.append(rhodes)
    with io.BytesIO() as f:
        midi.write(f)
        return f.getvalue()

def render_midi_pack(chords, tempo=78, producer="Unknown", genre="Unknown", emotion="Unknown", key="C Minor"):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w') as zf:
        zf.writestr('chords.mid', chord_to_midi(chords, tempo))
        zf.writestr('drums.mid', drums_to_midi(tempo))
        zf.writestr('bass.mid', bass_to_midi(chords, tempo))
        zf.writestr('layers.mid', layers_to_midi(chords, tempo))
        readme = f"""
BARKSDALE MUSIC STUDIO — Beat Pack

Producer: {producer}
Genre: {genre}
Emotion: {emotion}
Tempo: {tempo} BPM
Key: {key}

Chords: {', '.join(chords)}

Mix Summary:
- Gain Staging: Kick -12dB, Snare -15dB, Bass -14dB, Melody -18dB
- Bus Compression: 2.5:1 ratio
- Mastering: -9 LUFS, -1dB True Peak

To use in GarageBand, FL Studio, FL Studio Mobile, Logic, Ableton, or BandLab:
1. Import each .mid file to a separate track
2. Assign patches: chords.mid → Piano, drums.mid → Hip Hop Kit, bass.mid → Sub Bass, layers.mid → Rhodes
3. Set tempo to {tempo} BPM
4. Key is {key}
"""
        zf.writestr('README.txt', readme)
        template = {
            "producer": producer,
            "genre": genre,
            "emotion": emotion,
            "tempo": tempo,
            "key": key,
            "chords": chords
        }
        zf.writestr('template.json', json.dumps(template, indent=2))
    return zip_buffer.getvalue()
