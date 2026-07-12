# BARKSDALE MUSIC GROUP

**Professional Beat Generation for Everyone**

BARKSDALE MUSIC GROUP is a professional beat generation platform that exports to ALL major DAWs. Generate pro-quality MIDI beats and export directly to GarageBand, FL Studio, FL Studio Mobile, Logic Pro, Ableton Live, and BandLab.

---

## 🚀 Live App

- **Frontend**: https://barksdale410.github.io/Barksdale-Music-Group/
- **Backend API**: https://barksdale-music-group-7abg.onrender.com

---

## 🎛️ Producer Templates

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

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Beat Generation | 32+ producer styles across 4 categories |
| 📤 Multi-DAW Export | GarageBand, FL Studio, FL Studio Mobile, Logic Pro, Ableton, BandLab |
| 🔒 Locked Gain Staging | Professional mixing presets (non-editable) |
| ⚠️ Auto-Normalize Warning | Visible on every export action |
| 📱 Mobile-First Design | Max-width 480px, touch-friendly 44px targets |
| 🌙 Dark Theme | #0a0a0a / #111111 / #1a1a1a backgrounds |
| 🟠 Orange-Gold Accents | #f0883e primary / #e65c1a secondary |
| 📁 Project Management | Save and load beat projects |
| ⚡ Scaler EQ Warning | Max 4 instances recommended for iPhone 14 |

---

## 🎚️ Mixing Presets (Locked)

| Track | Target Level |
|-------|-------------|
| Kick | -12dB |
| Snare | -15dB |
| Bass | -14dB |
| Melody | -18dB |
| Hi-Hats | -20dB |
| FX | -22dB |
| Mastering | -9 LUFS / -1dB True Peak |

**Bus Processing**: 2.5:1 compression, 10ms attack, 100ms release, -18dB threshold

---

## 📁 File Structure

```
barksdale-music-group/
├── index.html                    (complete merged frontend)
├── README.md
├── chords/
│   ├── progression.txt           (default: Cm, Ab, Fm, G)
│   └── library.csv
├── midi/
│   └── .gitkeep
├── backend/
│   ├── server.py                 (FastAPI — all endpoints)
│   ├── requirements.txt
│   └── scripts/
│       ├── chord_to_midi.py
│       └── multi_track_midi_advanced.py
├── templates/
│   └── [32 producer template JSONs]
└── .github/
    └── workflows/
        ├── enable-pages.yml
        └── generate_midi.yml
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/options` | GET | List all producers, genres, emotions |
| `/api/templates` | GET | List all producer templates |
| `/api/templates/{id}` | GET | Get specific template |
| `/api/chords` | GET/POST | Get/save chord progression |
| `/api/generate` | POST | Generate a beat |
| `/api/generate/advanced` | POST | Generate with template |
| `/api/download/{beat_id}` | GET | Download MIDI ZIP |
| `/api/mixing/presets` | GET | Get locked gain staging presets |
| `/api/export/warning` | POST | Get auto-normalize warning |
| `/api/health` | GET | Health check |

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
python server.py

# Open frontend
cd ..
# Serve index.html or open directly in browser
```

---

## 🚀 Deployment

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Connect GitHub repo
3. Root Directory: `backend/`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Health check: GET `/api/options`

### Frontend (GitHub Pages)
1. Enable GitHub Pages in repo settings
2. Source: main branch, / (root)
3. App auto-deploys!

---

## 📋 Chord Progression Format

**Always single comma-separated line** — never Roman numerals, never multi-line.

Example:
```
Cm, Ab, Fm, G
```

---

## ⚠️ Critical Rules

1. Mobile-first. Max-width 480px. Every element touch-friendly (44px min).
2. Dark theme only. #0a0a0a / #111111 / #1a1a1a backgrounds.
3. Orange-gold accents only. #f0883e primary / #e65c1a secondary.
4. No external CSS frameworks. Vanilla CSS and vanilla JS only.
5. All Scaler EQ instances: maximum 4 active on iPhone 14.
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
