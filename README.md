# Joseph in the Hot Seat, from Amina

A quiz-show party game for teens, from Hyderabad to Dubai. There are 7 questions on a prize ladder (1,000 → 1 Crore "party points"),
a 30-second clock, two lifelines (**50:50** and **Ask Amina**) and a "Did you know?" fact after every answer.
Live music and sound effects are made in the browser, with a mute button. At the end, the real prize is revealed:
**an invitation to Amina's party**, with the time in both cities, a live countdown, the details, "Add to calendar" and a WhatsApp reply.

It's inspired by TV quiz shows, but the name, look, music and ladder are all original. No KBC name, logo or theme music is used.

Plain HTML/CSS/JS, no build step, no libraries, no audio files.

```
index.html   page structure (4 screens)
style.css    look & feel (orange + brown stage). Colours are in :root
script.js    ALL content is in CONFIG + QUESTIONS at the top
.nojekyll    tells GitHub Pages to serve files as-is
```

---

## ⚠️ Check the party time first

The form says **23 Oct 2026, 00:00 (Asia/Dubai)**. That is midnight at the *start* of 23 Oct, which has already passed,
so the countdown currently shows "That party's a wrap". If that's not right, change these two lines in `script.js`:
```js
date: "2026-10-23",   // YYYY-MM-DD
time: "00:00",        // 24h, e.g. "19:00" for 7 PM Dubai time
```

---

## 1. Personalise

| Setting | What it does |
|---|---|
| `from`, `to`, `showName`, `greeting`, `introText` | Names and first-screen text |
| `me` / `them` | City, flag, **IANA time zone**, lat/lon (for the live distance) |
| `timerSeconds`, `timeoutLine` | Seconds per question (`0` = off) |
| `ladder`, `prizeUnit` | One prize per question, lowest first |
| `lifelines` | Turn 50:50 or "Ask Amina" on/off |
| `music` | `on`, and the music and sound-effect volumes. Players can mute with 🔊 |
| `ask`, `yesText`, `noText`, `noHint` | The invitation question. "Can't make it" always works and offers WhatsApp |
| `event` | Date, time, **zone that time is written in**, duration, calendar title/location, detail cards |
| `badge`, `successTitle`, `message`, `signoff` | Final screen. `{prize}`, `{prizeUnit}`, `{duration}` are filled in |
| `whatsapp.number` | Where replies go, digits only with country code. `""` hides the buttons |
| `ntfy` | Off (not requested). To turn it on: set a new topic `pp-party-oct26-<openssl rand -hex 6>` and `enabled: true` |
| `brand.show` | "Made with Play Planet" line |

**Questions**: `correct` = index (0 = first) or `"all"` for a trick question. `hint` is what "Ask Amina" says,
and `fact` is the "Did you know?" line. `type: "distance"` / `"time"` questions are generated live.
Placeholders: `{from} {to} {km} {myCity} {theirCity} {myTime} {gap} {meVsThem}`.
The joke question (#5) is an **editable example**. The form said "Jokes", so drop in your own inside jokes.

---

## 2. Test locally
```bash
cd amina-and-joseph
python3 -m http.server 8000
# open http://localhost:8000/?quiet
```
Phone on same Wi-Fi: `http://<your-computer-ip>:8000/?quiet`.

## 3. Push to GitHub
Create an empty repo at https://github.com/new (no README), then:
```bash
cd amina-and-joseph
git init            # skip if the folder already has .git
git add .
git commit -m "Joseph in the Hot Seat"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 4. Turn on GitHub Pages
Repo → **Settings → Pages** → **Deploy from a branch** → **main**, **/ (root)** → Save.
Link: `https://<your-username>.github.io/<repo-name>/`

## 5. After every change: bump `?v=`
In `index.html` raise the number on **both** lines (`style.css?v=1` → `?v=2`, `script.js?v=1` → `?v=2`), then
`git add . && git commit -m "Update" && git push`.

## 6. Notes
- Times use `Intl` with IANA zones. Hyderabad (UTC+5:30) is computed as 1 hr 30 min ahead of Dubai.
- The calendar file stores UTC times and has a 15-minute reminder.
- Music starts only after "Take the hot seat" (phones block sound before a tap), pauses when the tab is hidden,
  and the mute choice is remembered on that phone.
- Respects **Reduce Motion**: the spotlight, floating notes and bouncing are off, and the confetti falls gently.
