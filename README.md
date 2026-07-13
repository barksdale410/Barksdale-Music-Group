# BARKSDALE MUSIC GROUP v3.0

**Claude Beats OS - Complete Producer System**

BARKSDALE MUSIC GROUP is a professional beat generation platform powered by Claude Beats OS. Generate pro-quality MIDI beats and export directly to ALL major DAWs.

---

## 🚀 Live App

- **Frontend**: https://barksdale410.github.io/Barksdale-Music-Group/
- **Backend API**: https://barksdale-music-group-7abg.onrender.com

---

## 🎛️ Producer Templates (47 Total)

### CINEMATIC / BOOM BAP
- Conductor Williams
- Daringer
- Conductor Williams × Daringer Hybrid
- Big Ghost Ltd × Swiss Beatz
- The Alchemist
- Nicholas Craven
- DJ Premier
- Pete Rock
- 9th Wonder
- RZA
- Madlib

### THE HITMEN (BAD BOY ERA)
- The Hitmen (90s SP-1200 Era)
- The Hitmen (2000s Interpolation Era)

### HIP HOP / TRAP
- Metro Boomin
- Timbaland
- Just Blaze
- Kanye West
- Dr. Dre
- Mannie Fresh
- Jermaine Dupri
- DJ Mustard
- Murda Beatz
- Swizz Beatz
- DJ Khaled
- Southside
- Mike Will Made-It
- WondaGurl
- Lil Jon
- J. Cole Producers

### R&B / SOUL
- Babyface
- Bryan-Michael Cox
- Rodney Jerkins (Darkchild)
- D'Mile
- Raphael Saadiq
- James Poyser
- Kaytranada
- Nineteen85
- Illangelo
- Noah "40" Shebib
- Frank Dukes
- Jack Antonoff
- Scott Storch
- The Neptunes
- Thundercat
- Post Malone Producers
- Weeknd Producers (Illangelo & DaHeala)

---

## ✨ New Features in v3.0

### Full Producer OS v3.0
- 16-step drum grid with per-step velocity control
- Layer management (add/remove instruments with pan, reverb, delay)
- Arrangement blueprint (bar counts + energy curves for 8 sections)
- Vocal chain presets (Clean, Warm, Aggressive, Dark, Airy)
- Mix checklist with locked gain staging
- Mastering protocol with Scaler EQ chain

### Complete Musician's Encyclopedia
- Chord emotional color, formula, PC set, fingering, inversions
- Decoded symbol popup on chord hover
- Interactive Circle of Fifths
- 15-Minute Daily Drill (track progress via localStorage)
- Voice Leading Suggester with smooth inversion analysis
- Orchestral Color Guide (instrument-to-chord recommendations)
- "Your Turn" exercises with auto-check

### Advanced UI Updates
- 5 bottom tabs: Studio, Templates, Library, Learn, Profile
- Collapsible advanced settings panels
- Template search/filter by category
- Chord library with hover tooltips
- Orchestra Guide in Library tab
- Voice Leading Analyzer in Library tab
- DAW import guides (Coming Soon)

### Monetization Tiers
- **Free**: Basic chords, 5 daily drills, 3 templates
- **Pro ($9.99/mo)**: Full encyclopedia, all templates, voice leading
- **Studio ($29.99/mo)**: All + interactive exercises, 1-on-1 feedback

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Beat Generation | 32+ producer styles across 4 categories |
| 📤 Multi-DAW Export | GarageBand, FL Studio, FL Studio Mobile, Logic Pro, Ableton, BandLab |
| 🥁 Drum Grid | 16-step pattern with velocity control |
| 🔊 Layer Management | Add/remove instruments with FX |
| 📊 Arrangement Map | Energy curves and bar counts |
| 🎤 Vocal Chain | 5 presets (Clean, Warm, Aggressive, Dark, Airy) |
| 🎚️ Locked Gain Staging | Professional mixing presets |
| ⚠️ Auto-Normalize Warning | Visible on every export |
| 📚 Chord Encyclopedia | 50+ chords with emotional colors |
| 🎼 Circle of Fifths | Interactive 12-key reference |
| 🎓 Daily Drill | 15-minute practice tracker |
| 📱 Mobile-First | Max-width 480px, 44px touch targets |
| 🌙 Dark Theme | #0a0a0a / #111111 / #1a1a1a |
| 🟠 Orange-Gold Accents | #f0883e primary |
| ⚡ Scaler EQ Warning | Max 4 instances on iPhone 14 |

---

## 🎚️ Mixing Presets (Locked)

| Track | Target Level |
|-------|-------------|
| Kick | -14dB |
| 808 Bass | -12dB |
| Snare | -14dB |
| Hi-Hats | -20dB |
| Melody | -18dB |
| Strings | -22dB |
| Brass | -16dB |
| Vocals | -16dB |
| **Mastering** | -9 LUFS / -1dB TP |

**Bus Processing**: 2.5:1 compression, 10ms attack, 100ms release, -18dB threshold

---

## 📁 File Structure

```
barksdale-music-group/
├── index.html                    (v3.0 complete frontend)
├── README.md
├── data/                         (v3.0 data files)
│   ├── chords.json               (Chord Encyclopedia)
│   ├── emotion_to_chords.json    (Emotion Mapping)
│   └── circle_of_fifths.json    (12-Key Reference)
├── backend/
│   ├── server.py                 (FastAPI v3.0)
│   ├── requirements.txt
│   └── scripts/
│       └── multi_track_midi.py
├── templates/                    (32 Producer Templates)
│   ├── conductor_williams.json   (Full 11-section template)
│   ├── metro_boomin.json
│   └── ...
└── .github/
    └── workflows/
        └── generate_midi.yml
```

---

## 🔌 API Endpoints

### Core (v1)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/options` | GET | List producers, genres, emotions |
| `/api/templates` | GET | List all templates |
| `/api/templates/{id}` | GET | Get specific template |
| `/api/chords` | GET/POST | Get/save chord progression |
| `/api/generate` | POST | Generate a beat |
| `/api/generate/advanced` | POST | Generate with template |
| `/api/download/{beat_id}` | GET | Download MIDI ZIP |
| `/api/health` | GET | Health check |

### Encyclopedia (v3.0)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/encyclopedia` | GET | Full chord encyclopedia |
| `/api/encyclopedia/chord/{name}` | GET | Chord detail with formula |
| `/api/encyclopedia/chord-types` | GET | All chord types |
| `/api/circle-of-fifths` | GET | Complete Circle of Fifths |
| `/api/circle-of-fifths/key/{key}` | GET | Key-specific info |
| `/api/emotions` | GET | All emotion mappings |
| `/api/emotions/{name}` | GET | Emotion detail |
| `/api/orchestral-guide` | GET | Instrument-to-chord guide |
| `/api/daily-drill` | GET | 15-min drill exercises |
| `/api/voice-leading` | POST | Progression analysis |
| `/api/progressions/by-emotion/{e}` | GET | Progressions for emotion |
| `/api/progressions/by-key/{key}` | GET | Progressions for key |
| `/api/learn/exercises` | GET | Learning exercises |
| `/api/monetization/tiers` | GET | Subscription tiers |
| `/api/daw/guides` | GET | DAW import (Coming Soon) |

---

## 🛠️ Local Development

```bash
# Clone the repo
git clone https://github.com/barksdale410/barksdale-music-group.git
cd barksdale-music-group

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Run the server
python -m uvicorn server:app --host 0.0.0.0 --port 10000

# Open frontend
cd ..
# Serve index.html or open directly in browser
```

---

## 🚀 Deployment

### Backend (Render)
- Root Directory: `backend/`
- Build Command: `pip install -r requirements.txt`
- Start Command: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`

### Frontend (GitHub Pages)
- Source: main branch, / (root)
- Auto-deploys on push to main

---

## 📋 Chord Progression Format

**Always single comma-separated line** — never Roman numerals, never multi-line.

```
Cm, Ab, Fm, G
```

---

## ⚠️ Critical Rules

1. Mobile-first. Max-width 480px. Every element touch-friendly (44px min).
2. Dark theme only. #0a0a0a / #111111 / #1a1a1a backgrounds.
3. Orange-gold accents only. #f0883e primary / #e65c1a secondary.
4. No external CSS frameworks. Vanilla CSS and vanilla JS only.
5. Scaler EQ: max 4 instances on iPhone 14.
6. Gain staging targets are locked and non-editable in UI.
7. Auto-Normalize warning must appear on every export action.
8. Chord progression output is ALWAYS a single comma-separated line.
9. Every template JSON must contain all 11 Producer OS sections.
10. Backend error handling: every API call must have try/catch.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

**Made with ❤️ by BARKSDALE MUSIC GROUP**
**Powered by Claude Beats OS v3.0**
