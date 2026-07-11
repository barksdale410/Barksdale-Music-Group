🎵 BARKSDALE MUSIC STUDIO

**Beat Maker for Everyone — No big studio. No thousands of dollars. Just talent.**

Barksdale Music Studio is a professional beat generation platform that exports to ALL major DAWs. Generate pro-quality MIDI beats and export directly to GarageBand, FL Studio, FL Studio Mobile, Logic Pro, Ableton Live, and BandLab.

---

## 🚀 Quick Start

1. **Open the app** → https://barksdale-music-group.onrender.com
2. **Choose your producer** style, genre, and emotion
3. **Generate a beat** in seconds
4. **Export to your DAW** — download MIDI, .flp, or .als files
5. **Make hits!** 🎵

---

## 🎯 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Beat Generation | 10+ producer styles, 8 genres, custom emotions |
| 📤 Multi-DAW Export | GarageBand, FL Studio, FL Studio Mobile, Logic Pro, Ableton |
| 🌐 BandLab Integration | Publish directly to BandLab with one click |
| 🔥 Hit-Maker PRO | Full arrangements, mixing presets, WAV stems ($4.99) |
| 🎓 Free Tutorials | Step-by-step guides for every DAW |
| 🎨 Public Gallery | Share beats, get likes, follow producers |
| 🏆 Beat Battles | Weekly challenges with prizes |
| 🤖 AI Feedback | Get tips to improve your beats |
| 📱 Chromebook Ready | PWA installable, keyboard shortcuts |

---

## 🎹 Supported DAWs

| DAW | File Format | Notes |
|-----|-------------|-------|
| **GarageBand** | MIDI | Universal import |
| **FL Studio Desktop** | .flp / MIDI | Pre-assigned to FPC, FL Keys |
| **FL Studio Mobile** | MIDI | Works on iOS, Android, Chromebook |
| **Logic Pro** | MIDI | Mac only |
| **Ableton Live** | .als / MIDI | FL Studio project alternative |
| **BandLab** | Direct API | Browser-based collaboration |

---

## 💰 Pricing

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Generate beats, download MIDI |
| **Hit-Maker PRO** | $4.99 | Full arrangement, WAV stems, mixing presets |

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

## 🌐 Deploy

### Backend (Render)
1. Create account at [render.com](https://render.com)
2. Connect GitHub repo
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && python server.py`
5. Add environment variables from `.env.example`

### Frontend (GitHub Pages)
1. Enable GitHub Pages in repo settings
2. Set source to `main` branch
3. App auto-deploys!

---

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate` | POST | Generate a new beat |
| `/api/download/{beat_id}` | GET | Download MIDI ZIP |
| `/api/export/flp` | POST | Export as FL Studio project |
| `/api/export/als` | POST | Export as Ableton project |
| `/api/publish/bandlab` | POST | Publish to BandLab |
| `/api/generate/pro` | POST | Generate Hit-Maker PRO beat |
| `/api/gallery` | GET | Browse community beats |
| `/api/battles` | GET | View beat battles |
| `/api/tutorials` | GET | Get tutorials |

---

## ⌨️ Keyboard Shortcuts (Chromebook)

| Shortcut | Action |
|----------|--------|
| `Ctrl + Enter` | Generate beat |
| `Ctrl + 1` | Create tab |
| `Ctrl + 2` | Export tab |
| `Ctrl + 3` | Gallery tab |
| `Ctrl + 4` | Battles tab |

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

**Made with ❤️ by Barksdale Music Group** 
