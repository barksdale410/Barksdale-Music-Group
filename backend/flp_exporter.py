flp_exporter.py
# backend/flp_exporter.py
# FL Studio Project File (.flp) Exporter
# Generates FLP-compatible project structure

import io
import struct
import json
from typing import List, Dict, Any

# FL Studio plugin IDs
FL_PLUGINS = {
    'fpc': 0x30,      # FPC - Drum pads
    'fl_keys': 0x31,   # FL Keys
    'sytrus': 0x32,    # Sytrus
    'harmor': 0x33,    # Harmor
    'piano': 0x00,     # Piano (DirectX)
    'bass': 0x34,      # Bass synth
    'sawer': 0x35,     # Sawer
    'vital': 0x36,     # Vital (modern alternative)
}

# MIDI note mappings
NOTE_MAP = {
    'kick': 36,   # C1
    'snare': 38,  # D1
    'hat': 42,    # F#1
    'open_hat': 46,  # A#1
    'rim': 37,    # C#1
    'clap': 39,   # D#1
}

CHORD_MAP = {
    'C': [60, 64, 67],      # C major
    'Cm': [60, 63, 67],     # C minor
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
    'Eb': [63, 67, 70],
}


class FLPElement:
    """Base class for FL Studio elements."""
    def __init__(self, name: str, color: int = 0xFF8040):
        self.name = name
        self.color = color
        self.enabled = True
        self.volume = 1.0
        self.pan = 0.0
        self.muted = False
        self.solo = False


class FLPChannel(FLPElement):
    """Represents a channel (track) in FL Studio."""
    def __init__(self, name: str, plugin_id: int = 0, color: int = 0xFF8040):
        super().__init__(name, color)
        self.plugin_id = plugin_id
        self.notes: List[Dict] = []
        self.pitch = 0
        self.slicer_mode = False
        self.loop_mode = True
        

class FLProject:
    """FL Studio Project structure."""
    def __init__(self, tempo: int = 78, name: str = "Barksdale Beat"):
        self.name = name
        self.tempo = tempo
        self.time_sig_numerator = 4
        self.time_sig_denominator = 4
        self.channels: List[FLPChannel] = []
        self.ppqn = 480  # Pulses per quarter note
        
        # Create default channels
        self._create_default_channels()
    
    def _create_default_channels(self):
        """Create default channels for beat production."""
        # Drums channel (FPC)
        drums = FLPChannel("Drums", FL_PLUGINS['fpc'], 0xFF6040)
        self.channels.append(drums)
        
        # Bass channel
        bass = FLPChannel("808 Bass", FL_PLUGINS['fl_keys'], 0x40FF60)
        self.channels.append(bass)
        
        # Chords channel
        chords = FLPChannel("Chords", FL_PLUGINS['piano'], 0x4060FF)
        self.channels.append(chords)
        
        # Melody channel
        melody = FLPChannel("Melody", FL_PLUGINS['fl_keys'], 0xFF40FF)
        self.channels.append(melody)
    
    def add_drum_pattern(self, channel: FLPChannel, drum_grid: Dict, velocities: Dict, tempo: int):
        """Convert drum grid to MIDI notes."""
        ticks_per_step = int(self.ppqn / 4)
        
        for instr, pattern in drum_grid.items():
            if instr not in NOTE_MAP:
                continue
            note_num = NOTE_MAP[instr]
            vel_pattern = velocities.get(instr, [])
            
            for step, hit in enumerate(pattern):
                if hit:
                    vel = vel_pattern[step] if step < len(vel_pattern) else 80
                    start_tick = step * ticks_per_step
                    duration_ticks = ticks_per_step // 2
                    
                    channel.notes.append({
                        'note': note_num,
                        'start': start_tick,
                        'duration': duration_ticks,
                        'velocity': vel,
                        'pan': 0,
                        'pitch': 0
                    })
    
    def add_chord_progression(self, channel: FLPChannel, chords: List[str], tempo: int):
        """Add chord progression to a channel."""
        ticks_per_bar = int(self.ppqn * 4)
        
        for bar, chord in enumerate(chords):
            notes = CHORD_MAP.get(chord, [60, 64, 67])
            start_tick = bar * ticks_per_bar
            duration_ticks = int(ticks_per_bar * 0.9)
            
            for note in notes:
                channel.notes.append({
                    'note': note,
                    'start': start_tick,
                    'duration': duration_ticks,
                    'velocity': 100,
                    'pan': 0,
                    'pitch': 0
                })
    
    def add_bass_pattern(self, channel: FLPChannel, bass_pattern: Dict, tempo: int):
        """Add bass pattern to a channel."""
        ticks_per_step = int(self.ppqn / 4)
        
        notes = bass_pattern.get('notes', [])
        velocities = bass_pattern.get('velocities', [])
        
        for step, pitch in enumerate(notes):
            if pitch:
                vel = velocities[step] if step < len(velocities) else 80
                start_tick = step * ticks_per_step
                duration_ticks = ticks_per_step * 3
                
                channel.notes.append({
                    'note': pitch,
                    'start': start_tick,
                    'duration': duration_ticks,
                    'velocity': vel,
                    'pan': 0,
                    'pitch': 0
                })


def beat_plan_to_flp(beat_plan: Dict) -> bytes:
    """Convert a beat plan dictionary to FLP file format."""
    tempo = beat_plan.get('tempo', 78)
    flp = FLProject(tempo, f"Barksdale_{beat_plan.get('producer', 'Beat')}")
    
    # Get channels
    drums_ch = flp.channels[0]
    bass_ch = flp.channels[1]
    chords_ch = flp.channels[2]
    melody_ch = flp.channels[3]
    
    # Add drum pattern
    drum_grid = beat_plan.get('drum_grid', {})
    velocities = beat_plan.get('velocities', {})
    if drum_grid:
        flp.add_drum_pattern(drums_ch, drum_grid, velocities, tempo)
    
    # Add bass pattern
    bass_pattern = beat_plan.get('bass_pattern', {})
    if bass_pattern:
        flp.add_bass_pattern(bass_ch, bass_pattern, tempo)
    
    # Add chord progression
    chords = beat_plan.get('chords', [])
    if chords:
        flp.add_chord_progression(chords_ch, chords, tempo)
    
    # Generate FLP file
    return generate_flp_binary(flp)


def generate_flp_binary(flp: FLProject) -> bytes:
    """
    Generate a simplified FLP binary file.
    """
    buffer = io.BytesIO()
    
    # FL Studio project header
    buffer.write(b'FLhd')
    
    # Version info
    buffer.write(struct.pack('<I', 20))  # FL Studio 20
    buffer.write(struct.pack('<I', 0))
    buffer.write(struct.pack('<I', 0))
    
    # Tempo
    buffer.write(struct.pack('<f', float(flp.tempo)))
    
    # Time signature
    buffer.write(struct.pack('<B', flp.time_sig_numerator))
    buffer.write(struct.pack('<B', flp.time_sig_denominator))
    
    # PPQN
    buffer.write(struct.pack('<H', flp.ppqn))
    
    # Number of channels
    buffer.write(struct.pack('<I', len(flp.channels)))
    
    # Channel data
    for channel in flp.channels:
        buffer.write(b'FLch')
        
        # Channel name
        name_bytes = channel.name.encode('utf-8')[:64]
        buffer.write(name_bytes)
        buffer.write(b'\x00' * (64 - len(name_bytes)))
        
        # Channel properties
        buffer.write(struct.pack('<B', channel.plugin_id))
        buffer.write(struct.pack('<I', channel.color))
        buffer.write(struct.pack('<f', channel.volume))
        buffer.write(struct.pack('<f', channel.pan))
        buffer.write(struct.pack('<?', channel.muted))
        buffer.write(struct.pack('<?', channel.solo))
        
        # Number of notes
        buffer.write(struct.pack('<I', len(channel.notes)))
        
        # Note data
        for note in channel.notes:
            buffer.write(struct.pack('<I', note['start']))
            buffer.write(struct.pack('<I', note['duration']))
            buffer.write(struct.pack('<B', note['note']))
            buffer.write(struct.pack('<B', note['velocity']))
            buffer.write(struct.pack('<b', note['pan']))
            buffer.write(struct.pack('<b', note['pitch']))
    
    # Project metadata
    buffer.write(b'FLmd')
    producer = b'Barksdale Music Group'
    buffer.write(producer)
    buffer.write(b'\x00' * (128 - len(producer)))
    
    # Mixer settings
    buffer.write(b'FLmx')
    compression_text = json.dumps({
        'ratio': 2.5,
        'attack_ms': 30,
        'release_ms': 120,
        'threshold_db': -18,
        'knee_db': 6,
        'makeup_gain_db': 6
    }, indent=2).encode('utf-8')
    buffer.write(compression_text)
    buffer.write(b'\x00')
    
    # Footer
    buffer.write(b'FLft')
    
    return buffer.getvalue()


def export_flp(beat_plan: Dict) -> bytes:
    """
    Main export function.
    Takes a beat plan dictionary and returns FLP file bytes.
    """
    return beat_plan_to_flp(beat_plan)


if __name__ == '__main__':
    sample_beat = {
        'producer': 'Conductor Williams',
        'tempo': 78,
        'key': 'C Minor',
        'chords': ['Cm', 'Ab', 'Fm', 'G'],
        'drum_grid': {
            'kick': [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
            'snare': [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
            'hat': [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        },
        'velocities': {
            'kick': [120,0,0,0,0,0,0,0,110,0,0,0,0,0,0,0],
            'snare': [0,0,0,0,0,0,115,0,0,0,0,0,0,0,110,0],
            'hat': [45,40,0,35,0,40,0,35,45,40,0,35,0,40,0,35],
        },
        'bass_pattern': {
            'notes': [36,0,0,0,48,0,0,0,43,0,0,0,47,0,0,0],
            'velocities': [110,0,0,0,105,0,0,0,100,0,0,0,115,0,0,0]
        }
    }
    
    flp_data = export_flp(sample_beat)
    with open('test_beat.flp', 'wb') as f:
        f.write(flp_data)
    print(f"Test FLP file created: {len(flp_data)} bytes")
