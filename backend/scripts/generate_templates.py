import json
import os

# Template configurations for all producers
PRODUCERS = {
    "daringer": {
        "name": "Daringer",
        "category": "cinematic_boom_bap",
        "description": "Dark, sample-heavy, gritty boom bap",
        "characteristic": "Lo-fi, sample-driven darkness",
        "tempo_range": {"min": 70, "max": 88},
        "key": "F Minor",
        "color": "#8b0000"
    },
    "conductor_daringer_hybrid": {
        "name": "Conductor Williams x Daringer Hybrid",
        "category": "cinematic_boom_bap",
        "description": "Orchestral samples meet gritty boom bap",
        "characteristic": "Cinematic darkness with lo-fi texture",
        "tempo_range": {"min": 72, "max": 86},
        "key": "C Minor",
        "color": "#ff4500"
    },
    "big_ghost_swiss_beatz": {
        "name": "Big Ghost Ltd x Swiss Beatz",
        "category": "cinematic_boom_bap",
        "description": "Dark, ominous boom bap with horror vibes",
        "characteristic": "Horror-tinged, sample-heavy darkness",
        "tempo_range": {"min": 68, "max": 85},
        "key": "A Minor",
        "color": "#4a0e0e"
    },
    "alchemist": {
        "name": "The Alchemist",
        "category": "cinematic_boom_bap",
        "description": "Smooth, jazz-influenced, premium boom bap",
        "characteristic": "Jazz chords, lo-fi textures, effortless flow",
        "tempo_range": {"min": 75, "max": 95},
        "key": "G Minor",
        "color": "#daa520"
    },
    "nicholas_craven": {
        "name": "Nicholas Craven",
        "category": "cinematic_boom_bap",
        "description": "Dark, minimalist, sample-based production",
        "characteristic": "Minimal drums, heavy bass, eerie samples",
        "tempo_range": {"min": 65, "max": 82},
        "key": "D Minor",
        "color": "#2f4f4f"
    },
    "premier": {
        "name": "DJ Premier",
        "category": "cinematic_boom_bap",
        "description": "Classic boom bap, sample collage, conscious rap",
        "characteristic": "Sample-heavy, scratch elements, boom bap pioneer",
        "tempo_range": {"min": 80, "max": 95},
        "key": "E Minor",
        "color": "#ff6b00"
    },
    "pete_rock": {
        "name": "Pete Rock",
        "category": "cinematic_boom_bap",
        "description": "Soulful boom bap, jazz loops, live feel",
        "characteristic": "Soul samples, live drums, warm bass",
        "tempo_range": {"min": 85, "max": 100},
        "key": "C Major",
        "color": "#ff8c00"
    },
    "ninth_wonder": {
        "name": "9th Wonder",
        "category": "cinematic_boom_bap",
        "description": "Academic boom bap, soul samples, conscious themes",
        "characteristic": "Soul samples, choir elements, academic approach",
        "tempo_range": {"min": 75, "max": 90},
        "key": "A Minor",
        "color": "#f4a460"
    },
    "rza": {
        "name": "RZA",
        "category": "cinematic_boom_bap",
        "description": "Wu-Tang sound, martial arts samples, dark",
        "characteristic": "Kung fu samples, dark piano, boom bap god",
        "tempo_range": {"min": 70, "max": 90},
        "key": "F Minor",
        "color": "#8b4513"
    },
    "madlib": {
        "name": "Madlib",
        "category": "cinematic_boom_bap",
        "description": "Experimental, genre-blending, sample wizard",
        "characteristic": "Eclectic samples, unconventional structures",
        "tempo_range": {"min": 60, "max": 100},
        "key": "C Minor",
        "color": "#9400d3"
    },
    "hitmen_90s": {
        "name": "The Hitmen (90s SP-1200 Era)",
        "category": "hitmen_bad_boy",
        "description": "Bad Boy era, classic hip-hop, sample-heavy",
        "characteristic": "Puffy Daddy, easy mo mo, 90s sample style",
        "tempo_range": {"min": 85, "max": 100},
        "key": "Eb Major",
        "color": "#ff1493"
    },
    "hitmen_2000s": {
        "name": "The Hitmen (2000s Interpolation Era)",
        "category": "hitmen_bad_boy",
        "description": "2000s Bad Boy, interpolation, polished production",
        "characteristic": "Clever hooks, modern R&B, polished sound",
        "tempo_range": {"min": 80, "max": 100},
        "key": "F Major",
        "color": "#ff69b4"
    },
    "metro_boomin": {
        "name": "Metro Boomin",
        "category": "hip_hop_trap",
        "description": "Trap, 808s, dark synths, stacked hi-hats",
        "characteristic": "Dark trap, 808 bass, haunting melodies",
        "tempo_range": {"min": 140, "max": 160},
        "key": "C Minor",
        "color": "#8b00ff"
    },
    "timbaland": {
        "name": "Timbaland",
        "category": "hip_hop_trap",
        "description": "Off-beat production, unique rhythms, innovative",
        "characteristic": "Syncopated drums, futuristic sounds, odd time",
        "tempo_range": {"min": 85, "max": 120},
        "key": "D Minor",
        "color": "#00ced1"
    },
    "just_blaze": {
        "name": "Just Blaze",
        "category": "hip_hop_trap",
        "description": "Anthemic, gospel samples, high energy",
        "characteristic": "Gospel samples, stadium energy, big drums",
        "tempo_range": {"min": 80, "max": 105},
        "key": "F Minor",
        "color": "#ffd700"
    },
    "kanye": {
        "name": "Kanye West",
        "category": "hip_hop_trap",
        "description": "Innovative, genre-defining, soul samples",
        "characteristic": "Soul samples, auto-tune, chipmunk soul",
        "tempo_range": {"min": 85, "max": 110},
        "key": "Ab Major",
        "color": "#f0883e"
    },
    "dre": {
        "name": "Dr. Dre",
        "category": "hip_hop_trap",
        "description": "West Coast G-funk, smooth, polished",
        "characteristic": "G-funk, synthesizer heavy, smooth West Coast",
        "tempo_range": {"min": 90, "max": 110},
        "key": "C Minor",
        "color": "#ff4500"
    },
    "mannie_fresh": {
        "name": "Mannie Fresh",
        "category": "hip_hop_trap",
        "description": "New Orleans bounce, high energy, party",
        "characteristic": "Bounce rhythm, call and response, party energy",
        "tempo_range": {"min": 100, "max": 130},
        "key": "D Major",
        "color": "#00ff7f"
    },
    "jermaine_dupri": {
        "name": "Jermaine Dupri",
        "category": "hip_hop_trap",
        "description": "Atlanta hip-hop, R&B crossover, bounce",
        "characteristic": "So So Def bass, R&B hooks, Atlanta sound",
        "tempo_range": {"min": 80, "max": 105},
        "key": "Bb Major",
        "color": "#ff6347"
    },
    "babyface": {
        "name": "Babyface",
        "category": "rb_soul",
        "description": "Smooth R&B, soft production, hit songwriter",
        "characteristic": "Smooth R&B, lush chords, pop crossover",
        "tempo_range": {"min": 70, "max": 95},
        "key": "Eb Major",
        "color": "#ffc0cb"
    },
    "bryan_michael_cox": {
        "name": "Bryan-Michael Cox",
        "category": "rb_soul",
        "description": "Contemporary R&B, modern production, hooks",
        "characteristic": "Modern R&B, creative chords, catchy hooks",
        "tempo_range": {"min": 75, "max": 100},
        "key": "F Major",
        "color": "#dda0dd"
    },
    "darkchild": {
        "name": "Rodney Jerkins (Darkchild)",
        "category": "rb_soul",
        "description": "Dark, powerful R&B, gospel influence",
        "characteristic": "Dark production, gospel chords, powerful vocals",
        "tempo_range": {"min": 70, "max": 100},
        "key": "C Minor",
        "color": "#800080"
    },
    "dmile": {
        "name": "D'Mile",
        "category": "rb_soul",
        "description": "Silky R&B, modern production, atmosphere",
        "characteristic": "Silky chords, atmospheric, modern vibe",
        "tempo_range": {"min": 65, "max": 90},
        "key": "G Major",
        "color": "#ba55d3"
    },
    "raphael_saadiq": {
        "name": "Raphael Saadiq",
        "category": "rb_soul",
        "description": "Live instrumentation, classic soul, organic",
        "characteristic": "Live band, classic soul, organic sound",
        "tempo_range": {"min": 75, "max": 100},
        "key": "A Minor",
        "color": "#cd853f"
    },
    "james_poyser": {
        "name": "James Poyser",
        "category": "rb_soul",
        "description": "Neo-soul, keyboard heavy, jazzy",
        "characteristic": "Jazzy chords, neo-soul, keyboard dominant",
        "tempo_range": {"min": 70, "max": 95},
        "key": "D Minor",
        "color": "#9370db"
    },
    "kaytranada": {
        "name": "Kaytranada",
        "category": "rb_soul",
        "description": "Electronic, funk, house influences, modern",
        "characteristic": "Funk samples, electronic elements, dance vibes",
        "tempo_range": {"min": 100, "max": 125},
        "key": "C Minor",
        "color": "#00bfff"
    },
    "nineteen85": {
        "name": "Nineteen85",
        "category": "rb_soul",
        "description": "Drake producer, minimalist, atmospheric",
        "characteristic": "Minimalist approach, atmospheric pads, modern",
        "tempo_range": {"min": 70, "max": 100},
        "key": "F Minor",
        "color": "#4682b4"
    },
    "illangelo": {
        "name": "Illangelo",
        "category": "rb_soul",
        "description": "Dark R&B, moody, atmospheric, The Weeknd",
        "characteristic": "Dark atmosphere, moody chords, cinematic",
        "tempo_range": {"min": 60, "max": 85},
        "key": "C Minor",
        "color": "#1e1e1e"
    },
    "noah40": {
        "name": "Noah '40' Shebib",
        "category": "rb_soul",
        "description": "Dark, moody, minimalist, Drake collaborator",
        "characteristic": "Dark 808s, minimal chords, emotional depth",
        "tempo_range": {"min": 65, "max": 90},
        "key": "D Minor",
        "color": "#2f4f4f"
    },
    "frank_dukes": {
        "name": "Frank Dukes",
        "category": "rb_soul",
        "description": "Global sounds, world music influence, modern",
        "characteristic": "World samples, global influence, modern production",
        "tempo_range": {"min": 70, "max": 100},
        "key": "E Minor",
        "color": "#d2691e"
    },
    "jack_antonoff": {
        "name": "Jack Antonoff",
        "category": "rb_soul",
        "description": "Pop production, indie influence, modern hits",
        "characteristic": "Pop sensibilities, indie influences, modern production",
        "tempo_range": {"min": 100, "max": 130},
        "key": "C Major",
        "color": "#ff7f50"
    }
}

def generate_drum_grid(bpm, pattern="boom_bap"):
    if pattern == "trap":
        steps = []
        for i in range(16):
            step = {"step": i+1, "velocity": 100}
            if i % 4 == 0:
                step["kick"] = 1
            else:
                step["kick"] = 0
            if i in [3, 11]:
                step["snare"] = 1
            else:
                step["snare"] = 0
            if i % 2 == 0:
                step["hat_closed"] = 1
            else:
                step["hat_closed"] = 0
            if i in [6, 14]:
                step["hat_open"] = 1
            else:
                step["hat_open"] = 0
            steps.append(step)
    elif pattern == "boom_bap":
        steps = []
        for i in range(16):
            step = {"step": i+1, "velocity": 100}
            if i in [0, 4, 8, 12]:
                step["kick"] = 1
            else:
                step["kick"] = 0
            if i in [2, 6, 10, 14]:
                step["snare"] = 1
            else:
                step["snare"] = 0
            if i in [1, 3, 5, 7, 9, 11, 13, 15]:
                step["hat_closed"] = 1
            else:
                step["hat_closed"] = 0
            step["hat_open"] = 0
            steps.append(step)
    else:
        steps = []
        for i in range(16):
            steps.append({
                "step": i+1, "kick": 1 if i in [0, 8] else 0,
                "snare": 1 if i in [4, 12] else 0,
                "hat_closed": 1 if i % 2 == 0 else 0,
                "hat_open": 0, "velocity": 100
            })
    return steps

def generate_template(producer_id, config):
    if config["category"] == "hip_hop_trap" and "metro" in producer_id:
        pattern = "trap"
    else:
        pattern = "boom_bap"
    
    template = {
        "id": producer_id,
        "name": config["name"],
        "category": config["category"],
        "description": config["description"],
        "characteristic": config["characteristic"],
        "version": "3.0",
        "tempo_range": config["tempo_range"],
        "sections": [
            "INTRO", "VERSE", "PRE-CHORUS", "CHORUS", "POST-CHORUS",
            "BRIDGE", "HOOK", "OUTRO", "INTERLUDE", "BREAK", "TAG"
        ],
        "color": config["color"],
        "producer_os": {
            "title_credits": {
                "producer": config["name"],
                "aka": [],
                "era": "Modern",
                "influences": [],
                "signature": config["characteristic"]
            },
            "sound_palette": {
                "garageband_patches": {
                    "drums": ["Piano Bar Kit", "Lo-Fi Kit", "Vintage Drum Kit"],
                    "bass": ["Modern Bass", "Fingerstyle Bass"],
                    "keys": ["Grand Piano", "Electric Piano"],
                    "strings": ["Sparse Strings", "Orchestral Ensemble"],
                    "samples": []
                },
                "recommended_sounds": [
                    "Piano with reverb",
                    "Dusty drums",
                    "808 bass" if config["category"] == "hip_hop_trap" else "Acoustic bass"
                ]
            },
            "chord_architecture": {
                "key": config["key"],
                "primary_progressions": [
                    "{}m, Ab, Fm, G".format(config["key"][0]) if "Minor" in config["key"] else "{}, Bb, G, C".format(config["key"].split()[0]),
                    "{}, Eb, Fm, Bb".format(config["key"][0]),
                    "Cm, Ab, Bb, G"
                ],
                "pc_sets": ["(0,3,7)", "(0,4,7)"],
                "emotions": ["dark", "soulful", "melancholy"],
                "voice_leading_notes": "Use inversions to keep bass smooth"
            },
            "drum_grid": {
                "pattern_length": 16,
                "bpm": config["tempo_range"]["min"],
                "steps": generate_drum_grid(config["tempo_range"]["min"], pattern),
                "swing": 0.55 if config["category"] == "cinematic_boom_bap" else 0.5,
                "ghost_notes": True
            },
            "bassline": {
                "pattern": "root-fifth-root-fifth-octave",
                "style": "fingerstyle" if "rb_soul" in config["category"] else "pluck",
                "articulation": "staccato",
                "syncopation": "moderate",
                "recommended_notes": ["C1", "G1", "Eb1", "Bb1"]
            },
            "melodic_layers": [
                {
                    "name": "Piano",
                    "type": "harmonic",
                    "position": "center",
                    "pan": 0,
                    "volume": -18,
                    "effects": ["reverb", "EQ"]
                },
                {
                    "name": "Strings" if "cinematic" in config["category"] else "Pad",
                    "type": "ambient",
                    "position": "wide",
                    "pan": -20,
                    "volume": -20,
                    "effects": ["reverb", "compression"]
                }
            ],
            "arrangement_map": {
                "sections": [
                    {"name": "INTRO", "bars": 4, "energy": 20, "instruments": ["drums", "bass"]},
                    {"name": "VERSE 1", "bars": 8, "energy": 40, "instruments": ["drums", "bass", "piano"]},
                    {"name": "CHORUS", "bars": 8, "energy": 80, "instruments": ["drums", "bass", "piano", "strings"]},
                    {"name": "VERSE 2", "bars": 8, "energy": 50, "instruments": ["drums", "bass", "piano"]},
                    {"name": "BRIDGE", "bars": 4, "energy": 30, "instruments": ["piano", "strings"]},
                    {"name": "CHORUS", "bars": 8, "energy": 80, "instruments": ["drums", "bass", "piano", "strings"]},
                    {"name": "OUTRO", "bars": 4, "energy": 40, "instruments": ["drums", "bass"]}
                ],
                "total_bars": 44,
                "energy_curve": [20, 30, 40, 50, 60, 70, 80, 90, 80, 50, 30, 50, 80, 90, 80, 60, 40, 30]
            },
            "fx_chain": {
                "drums": {
                    "compressor": {"ratio": 4, "attack": 10, "release": 50, "threshold": -20},
                    "eq": {"low": "+2dB @ 100Hz", "mid": "-2dB @ 1kHz", "high": "+3dB @ 5kHz"},
                    "reverb": {"type": "room", "decay": 1.5, "wet": 15}
                },
                "bass": {
                    "eq": {"low": "+3dB @ 80Hz", "high": "-3dB @ 2kHz"},
                    "compressor": {"ratio": 4, "attack": 5, "release": 100, "threshold": -15}
                },
                "master": {
                    "limiter": {"ceiling": -0.3, "release": 50},
                    "maximizer": {"amount": 80}
                }
            },
            "vocal_chain": {
                "presets": {
                    "clean": ["EQ", "De-Esser", "Compressor", "Reverb"],
                    "warm": ["Vintage EQ", "Tape Saturation", "Opto Compressor", "Plate Reverb"],
                    "aggressive": ["High-Pass 100Hz", "De-Esser", "FET Compressor", "Delay"],
                    "dark": ["Low-Pass 8kHz", "Vintage Compressor", "Hall Reverb"],
                    "airy": ["High-Pass 200Hz", "Air Band EQ", "Light Compression", "Spring Reverb"]
                },
                "recommended": "warm"
            },
            "mix_checklist": {
                "gain_staging": {
                    "kick": -14,
                    "808_bass": -12,
                    "snare": -14,
                    "hats": -20,
                    "melody": -18,
                    "strings": -22,
                    "brass": -16,
                    "vocals": -16
                },
                "stereo_field": {
                    "kick": "center",
                    "snare": "center",
                    "bass": "center",
                    "hats": "slight right",
                    "melody": "center",
                    "strings": "wide L/R",
                    "brass": "center"
                },
                "checks": [
                    "Kick and bass phase aligned",
                    "Snare mono-compatible",
                    "Bass ducked under vocals",
                    "Reverb pre-fader sends",
                    "Reference at -18dBFS"
                ]
            },
            "mastering_protocol": {
                "scaler_eq": {
                    "instance_1": {"frequency": 80, "gain": -2, "q": 0.7, "type": "low_shelf"},
                    "instance_2": {"frequency": 3000, "gain": 1, "q": 1.5, "type": "high_peak"},
                    "instance_3": {"frequency": 8000, "gain": 2, "q": 1.0, "type": "high_shelf"},
                    "instance_4": {"frequency": 12000, "gain": -1, "q": 0.7, "type": "high_shelf"}
                },
                "compressor": {"ratio": 2, "attack": 10, "release": 100, "threshold": -18},
                "limiter": {"ceiling": -0.3, "release": 50, "link": True},
                "target_lufs": -9,
                "true_peak": -1,
                "warning": "Scaler EQ: max 4 instances on iPhone 14. Use Track Lock/Merge beyond 4."
            }
        },
        "drum_program": 0,
        "bass_program": 33,
        "keys_program": 0,
        "pad_program": 52
    }
    return template

templates_dir = "/workspace/project/Barksdale-Music-Group/templates"
for producer_id, config in PRODUCERS.items():
    template = generate_template(producer_id, config)
    filepath = os.path.join(templates_dir, "{}.json".format(producer_id))
    with open(filepath, 'w') as f:
        json.dump(template, f, indent=2)
    print("Generated: {}.json".format(producer_id))

print("\nAll templates generated successfully!")
