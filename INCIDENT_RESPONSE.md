# 🚨 INCIDENT: Render Deploy Failure - Action Plan

**Severity:** P1 - Production Impact  
**Status:** Investigating  
**Current State:** Production instance running on last working deploy  
**Target:** Zero downtime fix within 2 hours  

---

## 📋 IMMEDIATE ACTIONS (0-15 min)

### 1. 🔧 Code Fix (DONE ✅)
```diff
# backend/requirements.txt - ALREADY FIXED
fastapi==0.104.0
uvicorn==0.24.0
requests==2.31.0
python-dotenv==1.0.0
pretty_midi==0.2.9
+ setuptools>=68.0.0  # ← FIXED
```
✅ `setuptools>=68.0.0` already added to requirements.txt

---

## 🚀 ZERO-DOWNTIME DEPLOYMENT STRATEGY

### Phase 1: Health Check Verification (15-20 min)
- [ ] 1.1 Open Render Dashboard → barksdale-music-group
- [ ] 1.2 Confirm **current production instance** status: 🟢 Healthy
- [ ] 1.3 Note current deploy timestamp and version
- [ ] 1.4 Document current health check endpoint: `GET /api/health`

### Phase 2: Preview Deploy (20-40 min)
- [ ] 2.1 Create **Preview Environment** (if available) OR use manual deploy
- [ ] 2.2 Trigger new deploy with fixed requirements
- [ ] 2.3 Monitor build logs for `setuptools` installation
- [ ] 2.4 Wait for instance to pass health check: `GET /api/health` → `{"status": "healthy"}`

### Phase 3: Blue-Green Traffic Swap (40-60 min)
- [ ] 3.1 **Preview health check passes?** → Continue to 3.2
- [ ] 3.2 **Preview health check fails?** → Rollback and investigate logs
- [ ] 3.3 Swap traffic: Preview → Production (atomic switch)
- [ ] 3.4 Verify production health: `GET /api/health`
- [ ] 3.5 Test critical endpoint: `GET /api/options`
- [ ] 3.6 Test MIDI generation: `POST /api/generate`

### Phase 4: Verification (60-90 min)
- [ ] 4.1 Test all critical paths:
  - [ ] `POST /api/generate` - Beat generation
  - [ ] `GET /api/download/{beat_id}` - MIDI ZIP download
  - [ ] `GET /api/encyclopedia` - Chord library
  - [ ] `GET /api/circle-of-fifths` - Key reference
- [ ] 4.2 Check Render logs for any errors
- [ ] 4.3 Monitor error rate for 15 minutes
- [ ] 4.4 **OLD INSTANCE REMAINS LIVE** until new passes all checks

---

## 👥 ACTION OWNERS

| Role | Owner | Task |
|------|-------|------|
| **Deploy Lead** | DevOps/Backend | Execute deploy, monitor logs |
| **Frontend Verify** | Dev | Test UI at https://barksdale410.github.io/Barksdale-Music-Group/ |
| **API Verify** | Backend | Test endpoints at https://barksdale-music-group-7abg.onrender.com |
| **SME** | Senior Dev | Final sign-off, rollback if needed |

---

## ⏱️ TIMELINE

```
00:00 - START: Confirm production is live 🟢
00:05 - Verify requirements.txt fix applied
00:15 - Trigger new deploy
00:30 - Preview passes health check?
00:45 - Traffic swap initiated
01:00 - Post-swap verification begins
01:30 - All checks green? → RESOLVED ✅
02:00 - HARD DEADLINE
```

---

## 🔄 ROLLBACK PROCEDURE (If Needed)

If new deploy fails at any point:
1. [ ] Stop new deploy
2. [ ] Old instance remains live (zero downtime preserved)
3. [ ] Investigate build logs
4. [ ] Fix and redeploy

---

## 📊 SUCCESS CRITERIA

| Check | Endpoint | Expected |
|-------|----------|----------|
| Health | `/api/health` | `{"status": "healthy"}` |
| Options | `/api/options` | Returns producers/genres/emotions |
| Generate | `/api/generate` (POST) | Returns beat_id |
| Download | `/api/download/{id}` | Returns ZIP file |
| Encyclopedia | `/api/encyclopedia` | Returns chord data |
| Circle | `/api/circle-of-fifths` | Returns 12 keys |

---

## 🔮 LONG-TERM ENHANCEMENTS

### 1. 📈 MIDI Pipeline Improvements
- [ ] Add structured logging for MIDI generation
- [ ] Implement MIDI generation time alerts (>5s = warning)
- [ ] Add MIDI quality metrics (note density, velocity distribution)
- [ ] Cache frequently used chord progressions

### 2. 🖥️ Infrastructure Monitoring
- [ ] Integrate Render health check improvements
- [ ] Add `/api/metrics` endpoint (request count, latency, error rate)
- [ ] Set up PagerDuty/OpsGenie alerts for deploy failures
- [ ] Add uptime monitoring (Better Uptime or similar)
- [ ] Implement request tracing with correlation IDs

### 3. 🎨 UI Refresh (Phase 2)
- [ ] Audit mobile experience on iPhone 14
- [ ] Add dark mode toggle (current is dark-only)
- [ ] Improve template card interactions
- [ ] Add real-time chord visualization
- [ ] Implement drag-and-drop drum grid

### 4. 🧪 Testing & Quality
- [ ] Add Playwright tests for critical paths
- [ ] Implement API contract testing
- [ ] Add load testing (k6 or Locust)
- [ ] Set up GitHub Actions CI/CD pipeline

### 5. 💰 Monetization Infrastructure
- [ ] Implement tier-based API access
- [ ] Add usage metering for Free tier (5 drills/day)
- [ ] Set up Stripe integration for Pro/Studio tiers
- [ ] Add rate limiting per tier

---

## 📝 POST-INCIDENT ACTIONS

After resolution, document:
- [ ] What triggered the failure
- [ ] How long detection took
- [ ] Total fix time
- [ ] What worked in the response
- [ ] What could improve

---

**INCIDENT COMMAND CENTER**

- Render Dashboard: https://dashboard.render.com
- Production URL: https://barksdale-music-group-7abg.onrender.com
- Frontend URL: https://barksdale410.github.io/Barksdale-Music-Group/
- Health Endpoint: `/api/health`

---

*Last Updated: 2026-07-12*
