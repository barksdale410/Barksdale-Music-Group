als_exporter.py
# backend/als_exporter.py
# Ableton Live Project File (.als) Exporter
# Generates Ableton Live compatible project structure

import io
import struct
import json
import zipfile
from typing import Dict, List
from dataclasses import dataclass, asdict

# MIDI note mappings
NOTE_MAP = {
    'kick': 36,
    'snare': 38,
    'hat': 42,
    'open_hat': 46,
    'rim': 37,
    'clap': 39,
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
}


@dataclass
class MidiNote:
    """Represents a MIDI note."""
    pitch: int
    start: float  # In beats
    duration: float  # In beats
    velocity: int = 100


@dataclass
class MidiClip:
    """Represents a MIDI clip."""
    name: str
    notes: List[MidiNote]
    color: int = 0xFF6040
    

@dataclass
class AudioClip:
    """Represents an audio clip."""
    name: str
    file_ref: str
    start: float = 0.0
    duration: float = 0.0


class AbletonTrack:
    """Represents an Ableton track."""
    def __init__(self, name: str, track_type: str = 'midi', color: int = 0xFF6040):
        self.name = name
        self.track_type = track_type  # 'midi' or 'audio'
        self.color = color
        self.clips: List[MidiClip] = []
        self.volume = 1.0
        self.pan = 0.0
        self.muted = False
        self.solo = False
        self.arm = False
        

class AbletonProject:
    """Ableton Live Project structure."""
    def __init__(self, name: str = "Barksdale Beat", tempo: int = 78):
        self.name = name
        self.tempo = tempo
        self.time_sig_numerator = 4
        self.time_sig_denominator = 4
        self.tracks: List[AbletonTrack] = []
        self.master_track_volume = 0.8
        
        # Create default tracks
        self._create_default_tracks()
    
    def _create_default_tracks(self):
        """Create default tracks for beat production."""
        # Drums track
        drums = AbletonTrack("Drums", "midi", 0xFF6040)
        self.tracks.append(drums)
        
        # Bass track
        bass = AbletonTrack("808 Bass", "midi", 0x40FF60)
        self.tracks.append(bass)
        
        # Chords track
        chords = AbletonTrack("Chords", "midi", 0x4060FF)
        self.tracks.append(chords)
        
        # Melody track
        melody = AbletonTrack("Melody", "midi", 0xFF40FF)
        self.tracks.append(melody)
        
        # Audio tracks for stems
        for i in range(1, 4):
            stem_track = AbletonTrack(f"Stem {i}", "audio", 0x606060)
            self.tracks.append(stem_track)
    
    def add_drum_clips(self, track: AbletonTrack, drum_grid: Dict, velocities: Dict):
        """Convert drum grid to MIDI clips."""
        notes = []
        
        for instr, pattern in drum_grid.items():
            if instr not in NOTE_MAP:
                continue
            note_num = NOTE_MAP[instr]
            vel_pattern = velocities.get(instr, [])
            
            for step, hit in enumerate(pattern):
                if hit:
                    vel = vel_pattern[step] if step < len(vel_pattern) else 80
                    start = step * 0.25  # 16th note
                    duration = 0.125  # Short note
                    
                    notes.append(MidiNote(
                        pitch=note_num,
                        start=start,
                        duration=duration,
                        velocity=vel
                    ))
        
        if notes:
            clip = MidiClip(name="Drum Pattern", notes=notes, color=track.color)
            track.clips.append(clip)
    
    def add_chord_clips(self, track: AbletonTrack, chords: List[str]):
        """Add chord progression as MIDI clip."""
        notes = []
        beats_per_chord = 4
        
        for bar, chord in enumerate(chords):
            chord_notes = CHORD_MAP.get(chord, [60, 64, 67])
            start = bar * beats_per_chord
            duration = beats_per_chord * 0.9
            
            for pitch in chord_notes:
                notes.append(MidiNote(
                    pitch=pitch,
                    start=start,
                    duration=duration,
                    velocity=100
                ))
        
        if notes:
            clip = MidiClip(name="Chord Progression", notes=notes, color=track.color)
            track.clips.append(clip)
    
    def add_bass_clips(self, track: AbletonTrack, bass_pattern: Dict):
        """Add bass pattern as MIDI clip."""
        notes = []
        
        bass_notes = bass_pattern.get('notes', [])
        velocities = bass_pattern.get('velocities', [])
        
        for step, pitch in enumerate(bass_notes):
            if pitch:
                start = step * 0.25
                duration = 0.75
                vel = velocities[step] if step < len(velocities) else 80
                
                notes.append(MidiNote(
                    pitch=pitch,
                    start=start,
                    duration=duration,
                    velocity=vel
                ))
        
        if notes:
            clip = MidiClip(name="Bass Pattern", notes=notes, color=track.color)
            track.clips.append(clip)


def beat_plan_to_als(beat_plan: Dict) -> bytes:
    """
    Convert beat plan to Ableton Live project format.
    Returns a ZIP file containing the .als project.
    """
    tempo = beat_plan.get('tempo', 78)
    project_name = f"Barksdale_{beat_plan.get('producer', 'Beat')}"
    
    project = AbletonProject(project_name, tempo)
    
    # Get tracks
    drums_tr = project.tracks[0]
    bass_tr = project.tracks[1]
    chords_tr = project.tracks[2]
    
    # Add drum pattern
    drum_grid = beat_plan.get('drum_grid', {})
    velocities = beat_plan.get('velocities', {})
    if drum_grid:
        project.add_drum_clips(drums_tr, drum_grid, velocities)
    
    # Add chord progression
    chords = beat_plan.get('chords', [])
    if chords:
        project.add_chord_clips(chords_tr, chords)
    
    # Add bass pattern
    bass_pattern = beat_plan.get('bass_pattern', {})
    if bass_pattern:
        project.add_bass_clips(bass_tr, bass_pattern)
    
    # Generate ALS project file
    return generate_als_binary(project, beat_plan)


def generate_als_binary(project: AbletonProject, beat_plan: Dict) -> bytes:
    """
    Generate Ableton Live project file.
    This creates a simplified ALS structure (XML-based).
    """
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Main ALS file (XML format)
        als_xml = generate_als_xml(project, beat_plan)
        zf.writestr('Project8_1.cfg', als_xml)
        
        # MIDI clips folder
        midi_folder = io.BytesIO()
        with zipfile.ZipFile(midi_folder, 'w') as midi_zf:
            for track in project.tracks:
                for i, clip in enumerate(track.clips):
                    clip_data = midi_clip_to_xml(clip)
                    midi_zf.writestr(f'{track.name}_clip{i}.mid', clip_data)
        
        zf.writestr('Tmp', midi_folder.getvalue())
        
        # Project info
        info = {
            'version': '8.1',
            'name': project.name,
            'tempo': project.tempo,
            'tracks': [t.name for t in project.tracks],
            'created_by': 'Barksdale Music Group',
            'export_date': '2024'
        }
        zf.writestr('info.json', json.dumps(info, indent=2))
        
        # README
        readme = f"""
ABLETON LIVE PROJECT
====================

Project: {project.name}
Tempo: {project.tempo} BPM
Created by: Barksdale Music Group

TRACKS:
{chr(10).join([f"- {t.name} ({t.track_type})" for t in project.tracks])}

SETUP INSTRUCTIONS:
1. Open this file in Ableton Live 8 or later
2. MIDI clips are in the Tmp folder
3. Assign each MIDI track to your preferred instrument:
   - Drums: Drum Rack, or any drum sampler
   - 808 Bass: 808 Bass, or any bass synth
   - Chords: Piano, or any chord instrument

MIXING PRESETS:
{json.dumps(beat_plan.get('mix_summary', {}), indent=2)}

Download Ableton Live Trial: https://www.ableton.com/live-trial/
"""
        zf.writestr('README.txt', readme)
    
    return zip_buffer.getvalue()


def generate_als_xml(project: AbletonProject, beat_plan: Dict) -> str:
    """Generate ALS XML content."""
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<Ableton MajorVersion="8" MinorVersion="1">
    <LiveSet>
        <Transport>
            <Tempo value="{project.tempo}"/>
            <TimeSignature numerator="{project.time_sig_numerator}" denominator="{project.time_sig_denominator}"/>
        </Transport>
        <MasterTrack>
            <Volume value="{project.master_track_volume}"/>
        </MasterTrack>
        <Tracks>
'''
    
    for track in project.tracks:
        xml += f'''            <Track Name="{track.name}" Type="{track.track_type}">
                <Color value="{track.color}"/>
                <Volume value="{track.volume}"/>
                <Pan value="{track.pan}"/>
                <Muted value="{str(track.muted).lower()}"/>
                <Solo value="{str(track.solo).lower()}"/>
                <Armed value="{str(track.arm).lower()}"/>
'''
        
        for clip in track.clips:
            xml += f'''                <MidiClip Name="{clip.name}">
                    <Length value="16"/>
                    <Color value="{clip.color}"/>
'''
            for note in clip.notes:
                xml += f'''                    <Note Pitch="{note.pitch}" Start="{note.start}" Duration="{note.duration}" Velocity="{note.velocity}"/>
'''
            xml += '''                </MidiClip>
'''
        
        xml += '''            </Track>
'''
    
    xml += '''        </Tracks>
    </LiveSet>
</Ableton>
'''
    return xml


def midi_clip_to_xml(clip: MidiClip) -> bytes:
    """Convert MIDI clip to SMF format."""
    import pretty_midi
    
    midi = pretty_midi.PrettyMIDI(initial_tempo=120)
    instrument = pretty_midi.Instrument(program=0)
    
    for note in clip.notes:
        midi_note = pretty_midi.Note(
            velocity=note.velocity,
            pitch=note.pitch,
            start=note.start,
            end=note.start + note.duration
        )
        instrument.notes.append(midi_note)
    
    midi.instruments.append(instrument)
    
    buffer = io.BytesIO()
    midi.write(buffer)
    return buffer.getvalue()


def export_als(beat_plan: Dict) -> bytes:
    """
    Main export function.
    Takes a beat plan dictionary and returns ALS file bytes.
    """
    return beat_plan_to_als(beat_plan)


if __name__ == '__main__':
    sample_beat = {
        'producer': 'Timbaland',
        'tempo': 90,
        'key': 'D Minor',
        'chords': ['Dm', 'Bb', 'F', 'C'],
        'drum_grid': {
            'kick': [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
            'snare': [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
            'hat': [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        },
        'velocities': {
            'kick': [120,0,0,0,0,0,0,115,0,0,0,0,0,0,110,0],
            'snare': [0,0,0,0,100,0,0,0,0,0,0,0,95,0,0,0],
            'hat': [80]*16,
        },
        'bass_pattern': {
            'notes': [38,0,0,0,45,0,0,0,41,0,0,0,48,0,0,0],
            'velocities': [100,0,0,0,95,0,0,0,90,0,0,0,110,0,0,0]
        }
    }
    
    als_data = export_als(sample_beat)
    with open('test_beat.als', 'wb') as f:
        f.write(als_data)
    print(f"Test ALS file created: {len(als_data)} bytes")
