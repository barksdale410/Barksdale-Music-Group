hit_maker_engine.py
# backend/hit_maker_engine.py
# Premium Hit-Maker Engine for professional-grade beats

import random
from typing import Dict, List, Any


class HitMakerEngine:
    """
    Advanced beat generation with full professional arrangement.
    Includes:
    - Complete song structure (Intro, Verse, Hook, Bridge, Outro)
    - Professional mixing presets
    - Producer signature style
    - Layered instrumentation
    """
    
    # Producer signature styles
    PRODUCER_STYLES = {
        'Conductor Williams': {
            'drum_style': 'sampled',
            'bass_sound': 'warm_808',
            'chord_voicing': 'soulful',
            'layers': ['chops', 'strings', 'piano'],
            'effects': ['tape_warmth', 'vintage_compression']
        },
        'Daringer': {
            'drum_style': 'raw',
            'bass_sound': 'grimy_808',
            'chord_voicing': 'minimal',
            'layers': ['vinyl_noise', 'field_recordings'],
            'effects': ['distortion', 'bit_crush']
        },
        'Timbaland': {
            'drum_style': 'electronic',
            'bass_sound': 'synth_bass',
            'chord_voicing': 'modern',
            'layers': ['synth_stabs', 'percussion'],
            'effects': ['flanger', 'delay']
        },
        'Dr. Dre': {
            'drum_style': 'smooth',
            'bass_sound': 'g_funk_bass',
            'chord_voicing': 'west_coast',
            'layers': ['brass', 'chords'],
            'effects': ['chorus', 'phaser']
        },
        'J Dilla': {
            'drum_style': 'dilla_swing',
            'bass_sound': 'moog_bass',
            'chord_voicing': 'lofi',
            'layers': ['soul_chops', 'melodic_loops'],
            'effects': ['wow_flutter', 'lowpass']
        },
        'Metro Boomin': {
            'drum_style': 'hard_hitting',
            'bass_sound': 'sub_808',
            'chord_voicing': 'dark_minor',
            'layers': ['piano_loops', 'synth_pads'],
            'effects': ['sidechain', 'reverb']
        },
        'The Alchemist': {
            'drum_style': 'flip_style',
            'bass_sound': 'warm_bass',
            'chord_voicing': 'sample_based',
            'layers': ['vinyl_texture', 'ambient_pads'],
            'effects': ['filter_sweeps', 'reverb']
        }
    }
    
    # Full arrangement templates
    ARRANGEMENT_TEMPLATES = {
        'radio': {
            'intro': 4,
            'verse1': 8,
            'hook': 4,
            'verse2': 8,
            'hook': 4,
            'outro': 4
        },
        'full': {
            'intro': 4,
            'verse1': 16,
            'pre_hook': 4,
            'hook': 8,
            'verse2': 16,
            'hook': 8,
            'bridge': 8,
            'final_hook': 8,
            'outro': 4
        },
        'club': {
            'intro': 4,
            'build': 4,
            'drop': 8,
            'verse': 8,
            'drop': 8,
            'outro': 4
        }
    }
    
    # Mixing presets
    MIXING_PRESETS = {
        'radio_ready': {
            'eq': {
                'kick': {'low_shelf': '+3dB @ 60Hz', 'presence': '-2dB @ 3kHz'},
                'snare': {'low_mid': '+2dB @ 200Hz', 'high': '+3dB @ 5kHz'},
                'bass': {'sub': '+2dB @ 40Hz', 'low_pass': '@ 200Hz'},
                'hats': {'high_shelf': '-3dB @ 10kHz', 'low_pass': '@ 15kHz'}
            },
            'compression': {
                'bus': {'ratio': '4:1', 'attack': '10ms', 'release': '100ms', 'threshold': '-18dB'},
                'parallel': {'blend': '30%', 'ratio': '8:1'}
            },
            'mastering': {
                'limiter': {'ceiling': '-0.3dB', 'release': 'auto'},
                'lufs': '-14',
                'true_peak': '-1dB'
            }
        },
        'streaming': {
            'lufs': '-14',
            'true_peak': '-1dB',
            'dynamics': 'preserved'
        },
        'vinyl': {
            'lufs': '-10',
            'true_peak': '-1dB',
            'saturation': 'light'
        }
    }
    
    def __init__(self, producer: str = 'Conductor Williams'):
        self.producer = producer
        self.style = self.PRODUCER_STYLES.get(producer, self.PRODUCER_STYLES['Conductor Williams'])
    
    def generate_full_arrangement(self, params: Dict) -> Dict:
        """Generate complete song arrangement with all sections."""
        arrangement_type = params.get('arrangement_type', 'radio')
        template = self.ARRANGEMENT_TEMPLATES.get(arrangement_type, self.ARRANGEMENT_TEMPLATES['radio'])
        
        arrangement = {}
        total_bars = 0
        
        for section, bars in template.items():
            energy = self._calculate_section_energy(section, bars)
            elements = self._get_section_elements(section)
            
            arrangement[section] = {
                'bars': bars,
                'energy': energy,
                'elements': elements,
                'tempo': params.get('tempo', 78),
                'key': params.get('key', 'C Minor')
            }
            total_bars += bars
        
        return {
            'sections': arrangement,
            'total_bars': total_bars,
            'duration_seconds': (60 / params.get('tempo', 78)) * total_bars * 4
        }
    
    def _calculate_section_energy(self, section: str, bars: int) -> int:
        """Calculate energy level for a section (1-10)."""
        energy_map = {
            'intro': 3,
            'build': 5,
            'verse1': 6,
            'verse2': 7,
            'pre_hook': 8,
            'hook': 10,
            'drop': 10,
            'bridge': 5,
            'final_hook': 10,
            'outro': 2
        }
        return energy_map.get(section, 5)
    
    def _get_section_elements(self, section: str) -> List[str]:
        """Get musical elements for each section."""
        base_elements = ['drums', 'bass', 'chords']
        
        section_elements = {
            'intro': ['chords'],
            'build': ['drums', 'bass', 'synth_stabs'],
            'verse1': ['drums', 'bass', 'chords'],
            'verse2': ['drums', 'bass', 'chords', 'melody'],
            'pre_hook': ['drums', 'bass', 'chords', 'adlibs'],
            'hook': ['drums', 'bass', 'chords', 'melody', 'layers'],
            'drop': ['drums', 'bass', 'synth'],
            'bridge': ['chords', 'melody', 'strings'],
            'final_hook': ['drums', 'bass', 'chords', 'melody', 'layers', 'brass'],
            'outro': ['chords', 'strings']
        }
        
        elements = section_elements.get(section, base_elements)
        
        # Add producer-specific layers
        if 'layers' in self.style:
            if section in ['hook', 'final_hook']:
                elements.extend(self.style['layers'][:2])
        
        return list(set(elements))  # Remove duplicates
    
    def generate_drum_pattern(self, style: str, bars: int = 4) -> Dict:
        """Generate professional drum pattern based on producer style."""
        if style == 'sampled':
            return self._sampled_drum_pattern(bars)
        elif style == 'raw':
            return self._raw_drum_pattern(bars)
        elif style == 'electronic':
            return self._electronic_drum_pattern(bars)
        elif style == 'dilla_swing':
            return self._dilla_swing_pattern(bars)
        elif style == 'hard_hitting':
            return self._hard_hitting_pattern(bars)
        else:
            return self._standard_pattern(bars)
    
    def _standard_pattern(self, bars: int) -> Dict:
        """Standard 16-step pattern."""
        steps = bars * 4
        return {
            'kick': [1] + [0] * 7 + [1] + [0] * 7,
            'snare': [0] * 4 + [1] + [0] * 3 + [0] * 4 + [1] + [0] * 3,
            'hat': [1] * 4 + [1] * 4 + [1] * 4 + [1] * 4,
            'open_hat': [0] * 16,
            'percussion': [1, 0, 1, 0] * 4
        }
    
    def _sampled_drum_pattern(self, bars: int) -> Dict:
        """Classic boom bap pattern."""
        return {
            'kick': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            'snare': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            'hat': [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
            'open_hat': [0] * 16,
            'percussion': [0] * 16
        }
    
    def _raw_drum_pattern(self, bars: int) -> Dict:
        """Gritty, aggressive pattern."""
        return {
            'kick': [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            'snare': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            'hat': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            'open_hat': [0, 0, 1, 0] * 4,
            'percussion': [1, 0, 0, 1] * 4
        }
    
    def _electronic_drum_pattern(self, bars: int) -> Dict:
        """Modern electronic pattern."""
        return {
            'kick': [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            'snare': [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            'hat': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            'open_hat': [0] * 4 + [1] * 4 + [0] * 4 + [1] * 4,
            'percussion': [0, 0, 1, 0] * 4
        }
    
    def _dilla_swing_pattern(self, bars: int) -> Dict:
        """J Dilla style with swing."""
        return {
            'kick': [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            'snare': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            'hat': [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0],
            'open_hat': [0] * 16,
            'percussion': [1, 1, 0, 0] * 4
        }
    
    def _hard_hitting_pattern(self, bars: int) -> Dict:
        """Metro Boomin style hard hitting."""
        return {
            'kick': [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1],
            'snare': [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            'hat': [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
            'open_hat': [0, 0, 1, 0] * 4,
            'percussion': [1, 0, 1, 0] * 4
        }
    
    def generate_mixing_preset(self) -> Dict:
        """Generate professional mixing preset."""
        preset_name = random.choice(['radio_ready', 'streaming', 'vinyl'])
        preset = self.MIXING_PRESETS.get(preset_name, self.MIXING_PRESETS['radio_ready'])
        
        return {
            'preset_name': preset_name,
            'settings': preset,
            'producer_style': self.style['effects']
        }
    
    def generate_layers(self, section: str, bars: int) -> List[Dict]:
        """Generate additional musical layers."""
        layers = []
        
        if 'chops' in self.style.get('layers', []):
            layers.append({
                'name': 'Soul Chops',
                'type': 'sample',
                'volume': 0.7,
                'pan': -20
            })
        
        if 'strings' in self.style.get('layers', []):
            layers.append({
                'name': 'String Pad',
                'type': 'synth',
                'volume': 0.5,
                'pan': 0
            })
        
        if 'piano' in self.style.get('layers', []):
            layers.append({
                'name': 'Piano Loop',
                'type': 'piano',
                'volume': 0.6,
                'pan': 10
            })
        
        if 'brass' in self.style.get('layers', []) and section in ['hook', 'final_hook']:
            layers.append({
                'name': 'Brass Stabs',
                'type': 'brass',
                'volume': 0.8,
                'pan': 0
            })
        
        return layers


def generate_pro_beat(params: Dict) -> Dict:
    """
    Generate a premium pro-level beat with full arrangement.
    """
    producer = params.get('primary_producer', 'Conductor Williams')
    genre = params.get('genre', 'Hip Hop')
    emotion = params.get('emotion', 'Dark')
    tempo = params.get('tempo', 78)
    key = params.get('key', 'C Minor')
    arrangement_type = params.get('arrangement_type', 'radio')
    
    # Initialize hit maker engine
    engine = HitMakerEngine(producer)
    
    # Generate chord progression
    chords = _generate_chords_for_emotion(emotion, key)
    
    # Generate drum pattern
    drum_style = engine.style['drum_style']
    drum_pattern = engine.generate_drum_pattern(drum_style, bars=4)
    
    # Generate velocities
    velocities = _generate_velocities(drum_pattern)
    
    # Generate bass pattern
    bass_pattern = _generate_bass_pattern(chords, tempo)
    
    # Generate full arrangement
    arrangement = engine.generate_full_arrangement(params)
    
    # Generate mixing preset
    mixing_preset = engine.generate_mixing_preset()
    
    # Generate additional layers
    layers = []
    for section, section_data in arrangement['sections'].items():
        if 'layers' in section_data['elements']:
            section_layers = engine.generate_layers(section, section_data['bars'])
            layers.extend(section_layers)
    
    return {
        # Basic info
        'producer': producer,
        'genre': genre,
        'emotion': emotion,
        'tempo': tempo,
        'key': key,
        
        # Musical data
        'chords': chords,
        'chord_progression_line': ', '.join(chords),
        'drum_grid': drum_pattern,
        'velocities': velocities,
        'bass_pattern': bass_pattern,
        'layers': layers,
        
        # Arrangement
        'arrangement': arrangement,
        
        # Premium features
        'premium': True,
        'producer_style': engine.style,
        'mixing_preset': mixing_preset,
        'arrangement_type': arrangement_type,
        
        # Mastering
        'master': {
            'lufs': -14,
            'true_peak': -1.0,
            'export': '24-bit WAV, MP3 320kbps',
            'format': 'stems + full mix'
        },
        
        # Signature elements
        'signature_elements': {
            'drum_sound': engine.style['drum_style'],
            'bass_sound': engine.style['bass_sound'],
            'chord_voicing': engine.style['chord_voicing'],
            'effects_chain': engine.style['effects']
        },
        
        # Includes
        'includes': [
            'Full arrangement MIDI files',
            'Professional mixing presets',
            'WAV stems (separate tracks)',
            'Full mixdown',
            'Producer signature applied',
            'AI feedback included'
        ]
    }


def _generate_chords_for_emotion(emotion: str, key: str) -> List[str]:
    """Generate chord progression based on emotion."""
    progressions = {
        'Dark': ['Cm', 'Ab', 'Fm', 'G', 'Cm', 'Ab', 'Bb', 'G'],
        'Soulful': ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'G'],
        'Angry': ['Em', 'G', 'D', 'A', 'Em', 'G', 'D', 'A'],
        'Hopeful': ['C', 'G', 'Am', 'F', 'C', 'G', 'F', 'C'],
        'Melancholy': ['Am', 'F', 'C', 'G', 'Em', 'F', 'G', 'Em'],
        'Triumphant': ['C', 'Em', 'F', 'G', 'C', 'Em', 'F', 'G'],
        'Chill': ['Cmaj7', 'Am7', 'Fmaj7', 'G7'],
        'Energetic': ['C', 'F', 'G', 'C', 'F', 'G', 'C', 'F'],
        'Romantic': ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'G'],
        'Aggressive': ['Cm', 'Ab', 'Eb', 'Bb', 'Cm', 'Ab', 'Eb', 'Bb']
    }
    
    return progressions.get(emotion, ['Cm', 'Ab', 'Fm', 'G'])


def _generate_velocities(drum_pattern: Dict) -> Dict:
    """Generate velocity values for each drum hit."""
    velocities = {}
    
    for instr, pattern in drum_pattern.items():
        vel_pattern = []
        for hit in pattern:
            if hit:
                # Add slight variation
                base_vel = random.randint(90, 120)
                vel_pattern.append(base_vel)
            else:
                vel_pattern.append(0)
        velocities[instr] = vel_pattern
    
    return velocities


def _generate_bass_pattern(chords: List[str], tempo: int) -> Dict:
    """Generate bass pattern from chords."""
    bass_notes = {
        'Cm': [36, 0, 0, 0, 43, 0, 0, 0, 48, 0, 0, 0, 43, 0, 0, 0],
        'Ab': [44, 0, 0, 0, 48, 0, 0, 0, 44, 0, 0, 0, 51, 0, 0, 0],
        'Fm': [41, 0, 0, 0, 48, 0, 0, 0, 41, 0, 0, 0, 53, 0, 0, 0],
        'G': [43, 0, 0, 0, 50, 0, 0, 0, 43, 0, 0, 0, 52, 0, 0, 0],
        'Bb': [46, 0, 0, 0, 53, 0, 0, 0, 46, 0, 0, 0, 51, 0, 0, 0],
        'C': [36, 0, 0, 0, 43, 0, 0, 0, 48, 0, 0, 0, 43, 0, 0, 0],
        'Am': [33, 0, 0, 0, 40, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0],
        'F': [29, 0, 0, 0, 36, 0, 0, 0, 41, 0, 0, 0, 36, 0, 0, 0],
        'E': [40, 0, 0, 0, 47, 0, 0, 0, 52, 0, 0, 0, 47, 0, 0, 0],
        'D': [38, 0, 0, 0, 45, 0, 0, 0, 50, 0, 0, 0, 45, 0, 0, 0],
        'A': [33, 0, 0, 0, 40, 0, 0, 0, 45, 0, 0, 0, 40, 0, 0, 0],
    }
    
    notes = bass_notes.get(chords[0] if chords else 'C', [36, 0, 0, 0, 43, 0, 0, 0, 48, 0, 0, 0, 43, 0, 0, 0])
    velocities = [110 if n > 0 else 0 for n in notes]
    
    return {
        'notes': notes,
        'velocities': velocities
    }


if __name__ == '__main__':
    params = {
        'primary_producer': 'Metro Boomin',
        'genre': 'Trap',
        'emotion': 'Dark',
        'tempo': 140,
        'key': 'C Minor',
        'arrangement_type': 'club'
    }
    
    pro_beat = generate_pro_beat(params)
    print(f"Generated PRO beat by {pro_beat['producer']}")
    print(f"Arrangement: {pro_beat['arrangement']['total_bars']} bars")
    print(f"Mixing preset: {pro_beat['mixing_preset']['preset_name']}")
    print(f"Includes: {pro_beat['includes']}")
