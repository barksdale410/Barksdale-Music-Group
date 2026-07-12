# 🚨 HOTFIX: ModuleNotFoundError pkg_resources - ACTION PLAN

**Status:** IN PROGRESS  
**Priority:** P0 - Production Down  
**Target:** Zero downtime restore

---

## ⏱️ TIMELINE

| Time | Action |
|------|--------|
| T+0 | ✅ Confirmed: setuptools>=60.0.0 in requirements.txt |
| T+1 | ✅ Confirmed: pip upgrade in buildCommand |
| T+2 | ⚠️ ISSUE: No runtime.txt - Python version unknown |
| T+3 | 📋 This plan created |

---

## 📋 STEP 1: IMMEDIATE ROLLBACK (30 seconds)

### Render Dashboard GUI:
1. Go to: https://dashboard.render.com
2. Select: **barksdale-music-group**
3. Navigate: **Deployments** tab
4. Find: **Last successful deploy** (green checkmark)
5. Click: **Actions → Rollback** → **Confirm**

### Render CLI (if installed):
```bash
render deploy --rollback <deployment-id>
```

**Expected Result:** Production restored in <60 seconds

---

## 📋 STEP 2: ROOT CAUSE ANALYSIS

### Current State:
```
✅ requirements.txt has: setuptools>=60.0.0
✅ render.yaml buildCommand: pip install --upgrade pip setuptools wheel
❌ NO runtime.txt - Python version defaults to Render's choice
⚠️ Python 3.14 detected in error logs - PRE-RELEASE, not stable
```

### The Problem:
- `pretty_midi==0.2.9` uses `pkg_resources` from setuptools
- Python 3.14 is pre-release and may have breaking changes
- `pkg_resources` deprecated in favor of `importlib.metadata`

---

## 📋 STEP 3: PERMANENT FIX

### File: runtime.txt (CREATE)
```
python-3.12.7
```

### File: backend/requirements.txt (UPDATE)
```diff
# BARKSDALE MUSIC GROUP v3.0 Backend Requirements
fastapi==0.104.0
uvicorn==0.24.0
requests==2.31.0
python-dotenv==1.0.0
pretty_midi==0.2.10
+ wheel>=0.40.0
+ setuptools>=65.0.0
```

### File: render.yaml (ALREADY CORRECT)
```yaml
buildCommand: pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
```

---

## 📋 STEP 4: LOCAL TEST (Docker Simulation)

### Clean rebuild simulation:
```bash
# Create fresh venv
python3.12 -m venv /tmp/test_venv
source /tmp/test_venv/bin/activate

# Simulate Render build
pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt

# Test import
python -c "import pretty_midi; print('pretty_midi OK')"
python -c "from pkg_resources import DistributionNotFound; print('pkg_resources OK')"

# Deactivate
deactivate
rm -rf /tmp/test_venv
```

---

## 📋 STEP 5: DEPLOYMENT STRATEGY

### Option A: Hotfix Branch (Recommended)
```bash
# Create hotfix branch
git checkout -b hotfix/pkg_resources_fix

# Commit changes
git add -A
git commit -m "fix: pin Python 3.12, upgrade pretty_midi, ensure setuptools"

# Push to hotfix branch
git push origin hotfix/pkg_resources_fix

# Deploy from hotfix branch on Render
# (Preview environment)
```

### Option B: Direct to Main (After local test passes)
```bash
git checkout main
git pull origin main
git merge hotfix/pkg_resources_fix
git push origin main
```

---

## 📋 STEP 6: POST-DEPLOYMENT VERIFICATION

### Critical Health Checks:

| # | Check | Command/Action | Expected |
|---|-------|----------------|----------|
| 1 | Health endpoint | `curl https://barksdale-music-group-7abg.onrender.com/api/health` | `{"status": "healthy"}` |
| 2 | Options endpoint | `curl https://barksdale-music-group-7abg.onrender.com/api/options` | Returns producers list |
| 3 | Beat generation | `curl -X POST https://barksdale-music-group-7abg.onrender.com/api/generate -H "Content-Type: application/json" -d '{"producer":"Conductor Williams","genre":"Hip Hop","emotion":"Dark","chords":"Cm, Ab, Fm, G"}'` | Returns beat_id |
| 4 | MIDI download | Visit frontend, generate, download | ZIP downloads |
| 5 | Encyclopedia | `curl https://barksdale-music-group-7abg.onrender.com/api/encyclopedia` | Returns chord data |

---

## 📋 STEP 7: FALLBACK / ROLLBACK

### If new deploy fails:
```bash
# Instant rollback via Render Dashboard
# OR via Render CLI:
render deploy --rollback <working-deployment-id>
```

### Verify rollback:
```bash
curl https://barksdale-music-group-7abg.onrender.com/api/health
# Should return {"status": "healthy"} within 30 seconds
```

---

## ✅ SUCCESS CRITERIA

- [ ] Production returns to healthy state
- [ ] All 5 health checks pass
- [ ] No new errors in Render logs
- [ ] pretty_midi imports successfully
- [ ] pkg_resources is available

---

## 🔧 EXECUTE THESE FILES NOW

### 1. Create runtime.txt
```bash
echo "python-3.12.7" > runtime.txt
```

### 2. Update requirements.txt
```bash
cat > backend/requirements.txt << 'EOF'
# BARKSDALE MUSIC GROUP v3.0 Backend Requirements
fastapi==0.104.0
uvicorn==0.24.0
requests==2.31.0
python-dotenv==1.0.0
pretty_midi==0.2.10
wheel>=0.40.0
setuptools>=65.0.0
EOF
```

### 3. Commit and push
```bash
git add -A
git commit -m "fix: pin Python 3.12.7, upgrade pretty_midi to 0.2.10"
git push origin main
```

---

## 📊 RENDER LOGS TO WATCH

After deploy, check for:
- `Successfully installed setuptools-`
- `Successfully installed pretty_midi-`
- `Application startup complete`
- Any `ModuleNotFoundError`

---

*Created: 2026-07-12*
