/* ==========================================================
   Joseph in the Hot Seat, from Amina: quiz show + party invite
   Play Planet house build. Edit only the blocks marked ✏️.
   An original quiz-show format (prize ladder + lifelines). No borrowed names, logos or music.
   ========================================================== */

/* ==========================================================
   ✏️ CONFIG: everything personal lives here.
   ========================================================== */
const CONFIG = {
  from: "Amina",                  // who made the game
  to: "Joseph",                   // who plays it
  showName: "Hot Seat",           // the show's name (shown in the fancy font)

  greeting: "{from} presents",
  introText:
    "Seven questions stand between you and the grand prize. Some are smart, some are silly, " +
    "and at least one is a trick. Lights, camera… think fast!",

  // Where each person is. tz must be an IANA zone. lat/lon are used for the live distance.
  me:   { city: "Hyderabad", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 17.385,  lon: 78.4867 }, // Amina
  them: { city: "Dubai",     flag: "🇦🇪", tz: "Asia/Dubai",   lat: 25.2048, lon: 55.2708 }, // Joseph

  timerSeconds: 30,               // seconds per question. 0 = no timer
  timeoutLine: "Time's up! ⏰",
  // Prize for each question (one per question, lowest first). Shown as "party points".
  ladder: ["1,000", "5,000", "10,000", "50,000", "1 Lakh", "10 Lakh", "1 Crore"],
  prizeUnit: "party points",
  lifelines: { fifty: true, askFrom: true },  // 50:50 and "Ask Amina" (shows the hint). false hides one

  // Music & sound effects (made live in the browser, no audio files). Starts after "Take the hot seat".
  music: { on: true, volume: 0.35, sfxVolume: 0.6 },

  // After the results: the invitation question and its two honest answers.
  ask: { before: "Your real prize: an invite to", highlight: "{from}'s party", after: "! Are you coming?" },
  yesText: "I'm in! 🎉",
  noText: "Can't make it",
  noHint: "No worries at all! Let {from} know on WhatsApp.",

  // The event. date + time are the wall-clock time in event.tz.
  event: {
    date: "2026-10-23",           // YYYY-MM-DD
    time: "00:00",                // 24h HH:MM  ⚠️ please confirm (see README)
    tz: "Asia/Dubai",             // the zone that date/time is written in
    durationMinutes: 120,
    calendarTitle: "{from}'s party 🎉",
    calendarLocation: "Anantapuri",
    details: [
      { icon: "📍", label: "Where",      value: "Anantapuri" },
      { icon: "👗", label: "Dress code", value: "Party wear" },
      { icon: "⏳", label: "How long",   value: "{duration}" },
      { icon: "😂", label: "Bring",      value: "Your best joke (Amina has been practising hers)" },
    ],
  },

  badge: "You're invited 🎟️",
  successTitle: "See you at the party, {to}! 🎉",
  message: "You won {prize} {prizeUnit}. They're worth absolutely nothing… except entry to the best party in {theirCity}.",
  signoff: "Amina👩‍🎤",

  // WhatsApp reply: digits only with country code. "" hides the buttons.
  whatsapp: { number: "96890471977", yesText: "I'm in! See you at the party 🎉", noText: "Sorry, I can't make it to the party 🙏" },

  // Not requested for this game: kept off. See README to switch on.
  ntfy: { enabled: false, server: "https://ntfy.sh", topic: "", label: "Party Oct 26", clickUrl: "", priorityOnFinish: 4 },

  brand: { show: true },          // small "Made with Play Planet" line
};

/* ==========================================================
   ✏️ QUESTIONS
   correct: index of the right option (0 = first), or "all" for a trick question.
   type "distance" / "time": options are built live from the cities above.
   hint: what "Ask Amina" says. fact: a short "did you know" shown after answering.
   Placeholders: {from} {to} {km} {myCity} {theirCity} {myTime} {gap} {meVsThem}
   ⚠️ Joke questions are EDITABLE EXAMPLES. Swap in your own inside jokes.
   ========================================================== */
const QUESTIONS = [
  {
    emoji: "🕌",
    q: "Which city is famous for the Charminar and its biryani?",
    options: ["Hyderabad", "Dubai", "Chennai", "{from}'s kitchen"],
    correct: 0,
    hint: "It's where I'm sitting right now 😉",
    right: "Correct! Off to a flying start.",
    wrong: "Nope, it's Hyderabad. My city, my biryani 😤",
    fact: "Did you know? The Charminar was built in 1591, which makes it over 430 years old.",
  },
  {
    emoji: "🏙️",
    q: "The Burj Khalifa, the tallest building in the world, is in which city?",
    options: ["Abu Dhabi", "Doha", "Dubai", "Riyadh"],
    correct: 2,
    hint: "Look out of your window, {to}.",
    right: "Easy for a local! ✅",
    wrong: "It's in Dubai. Your own city, {to}! 😅",
    fact: "Did you know? It is about 828 metres tall, more than twice the height of the Eiffel Tower.",
  },
  {
    type: "distance",
    emoji: "✈️",
    q: "Roughly how far is {myCity} from {theirCity}, as the crow flies?",
    hint: "It's a bit over two thousand km.",
    right: "Spot on! {km} km.",
    wrong: "It's about {km} km. A short flight for a good party.",
    fact: "Did you know? \"As the crow flies\" means the straight-line distance, ignoring roads and flight paths.",
  },
  {
    type: "time",
    emoji: "🕰️",
    q: "Quick! What time is it in {myCity} right now?",
    hint: "{myCity} is {gap} {meVsThem} {theirCity}.",
    right: "Right on time! ⏱️",
    wrong: "It's {myTime} in {myCity}.",
    fact: "Did you know? India uses a half-hour time zone (UTC+5:30), so {myCity} is {gap} {meVsThem} {theirCity}.",
  },
  { // EDITABLE EXAMPLE
    emoji: "📚",
    q: "Why did the maths book look so sad?",
    options: ["It lost its cover", "It had too many problems", "Nobody read it", "It failed the exam"],
    correct: 1,
    hint: "Think homework… lots and lots of homework.",
    right: "Ha! Too many problems. Relatable. 😂",
    wrong: "It had too many problems! 😂 (Groan allowed.)",
    fact: "Fun fact: a joke built on a double meaning like this is called a pun.",
  },
  {
    emoji: "🔴",
    q: "Which planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    correct: 2,
    hint: "Its name is also a chocolate bar 🍫",
    right: "Correct! Mars it is. 🚀",
    wrong: "It's Mars! 🚀",
    fact: "Did you know? Mars looks red because its soil is full of iron oxide, which is basically rust.",
  },
  {
    emoji: "🍢",
    q: "Final question! What's the best party snack?",
    options: ["Samosa", "Shawarma", "Biryani (yes, it counts)", "Whatever {from} brings"],
    correct: "all",
    hint: "You literally can't lose this one.",
    right: "Trick question! Every answer wins. Snacks are never wrong. 🎉",
    fact: "Bonus: the party has snacks. That's the real answer.",
  },
];

/* ✏️ Notes shown with the final prize (highest first; min = % of questions right) */
const SCORE_NOTES = [
  { min: 100, text: "A perfect game! The audience is on its feet. 👏" },
  { min: 70,  text: "Brilliant! Brains AND jokes. Dangerous combination. 😎" },
  { min: 40,  text: "Solid run! You'd survive a pop quiz… just about. 😄" },
  { min: 0,   text: "The questions won this round. But everyone's a winner tonight! 🎈" },
];

/* ==========================================================
   Helpers (no need to edit below this line)
   ========================================================== */
const $ = (id) => document.getElementById(id);
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const QUIET = new URLSearchParams(location.search).has("quiet");
const SID = Math.random().toString(36).slice(2, 6);

const fmt = (date, tz, opts) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(date);
const fmtTime = (date, tz) => fmt(date, tz, { hour: "numeric", minute: "2-digit" });
const fmtDate = (date, tz) => fmt(date, tz, { weekday: "short", day: "numeric", month: "short" });
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pad = (n) => String(n).padStart(2, "0");
const kmText = (n) => n.toLocaleString("en-US");

function tzOffsetMin(tz, ms) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(new Date(ms)).map((x) => [x.type, x.value])
  );
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - Math.floor(ms / 1000) * 1000) / 60000;
}
function zonedToDate(dateStr, timeStr, tz) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const wanted = Date.UTC(y, m - 1, d, hh, mm);
  let ts = wanted - tzOffsetMin(tz, wanted) * 60000;
  ts = wanted - tzOffsetMin(tz, ts) * 60000;
  return new Date(ts);
}
function distanceKm(a, b) {
  const r = (x) => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}
const KM = distanceKm(CONFIG.me, CONFIG.them);
function gapInfo() {
  const now = Date.now();
  const diff = tzOffsetMin(CONFIG.me.tz, now) - tzOffsetMin(CONFIG.them.tz, now);
  const a = Math.abs(diff), h = Math.floor(a / 60), m = a % 60;
  const gap = diff === 0 ? "" : [h ? `${h} hr` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
  return { gap, meVsThem: diff > 0 ? "ahead of" : diff < 0 ? "behind" : "the same time as" };
}
function durationText(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return [h ? `${h} hour${h > 1 ? "s" : ""}` : "", m ? `${m} min` : ""].filter(Boolean).join(" ");
}

const EVENT_START = CONFIG.event ? zonedToDate(CONFIG.event.date, CONFIG.event.time, CONFIG.event.tz) : null;
const EVENT_END = CONFIG.event ? new Date(EVENT_START.getTime() + CONFIG.event.durationMinutes * 60000) : null;

let score = 0;
const prizeNow = () => (score > 0 ? LADDER[Math.min(score, LADDER.length) - 1] : "0");

function fill(text) {
  if (text == null) return "";
  const now = new Date();
  const g = gapInfo();
  return String(text)
    .replaceAll("{from}", CONFIG.from)
    .replaceAll("{to}", CONFIG.to)
    .replaceAll("{km}", kmText(KM))
    .replaceAll("{myCity}", CONFIG.me.city)
    .replaceAll("{theirCity}", CONFIG.them.city)
    .replaceAll("{myTime}", fmtTime(now, CONFIG.me.tz))
    .replaceAll("{theirTime}", fmtTime(now, CONFIG.them.tz))
    .replaceAll("{gap}", g.gap)
    .replaceAll("{meVsThem}", g.meVsThem)
    .replaceAll("{prize}", prizeNow())
    .replaceAll("{prizeUnit}", CONFIG.prizeUnit)
    .replaceAll("{duration}", CONFIG.event ? durationText(CONFIG.event.durationMinutes) : "")
    .replaceAll("{eventDate}", EVENT_START ? fmtDate(EVENT_START, CONFIG.them.tz) : "")
    .replaceAll("{eventTime}", EVENT_START ? fmtTime(EVENT_START, CONFIG.them.tz) : "");
}

// One prize per question; if the lists don't match, fill gaps with simple numbers
const LADDER = QUESTIONS.map((_, i) => CONFIG.ladder[i] || kmText(1000 * 2 ** i));

function notify(title, message, { tags = [], priority = 3 } = {}) {
  const n = CONFIG.ntfy;
  if (QUIET || !n || !n.enabled || !n.topic) return;
  try {
    const body = { topic: n.topic, title: `[${n.label}] ${title}`, message: `${message} · #${SID}`, tags, priority };
    if (n.clickUrl) body.click = n.clickUrl;
    fetch(n.server.replace(/\/+$/, "") + "/", { method: "POST", body: JSON.stringify(body), keepalive: true }).catch(() => {});
  } catch (_) {}
}

function showScreen(from, to) {
  const swap = () => { from.hidden = true; from.classList.remove("leaving"); to.hidden = false; to.scrollTop = 0; };
  if (REDUCED) return swap();
  from.classList.add("leaving");
  setTimeout(swap, 340);
}

/* ==========================================================
   🎵 Sound: tiny synth built with the Web Audio API (no files)
   ========================================================== */
const Sound = (() => {
  let ac = null, master, music, sfx, loopId = null, step = 0, nextT = 0, mode = null;
  let on = CONFIG.music.on;
  try { const saved = localStorage.getItem("hotseat-sound"); if (saved !== null) on = saved === "1"; } catch (_) {}
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const SONGS = {
    // thinking music: A minor, steady and a little tense
    quiz:  { bpm: 104, chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 56, 59]] },
    // party music: C major, bouncy
    party: { bpm: 124, chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]] },
  };

  function init() {
    if (ac) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ac = new AC();
      master = ac.createGain(); master.gain.value = on ? 1 : 0; master.connect(ac.destination);
      music = ac.createGain(); music.gain.value = CONFIG.music.volume; music.connect(master);
      sfx = ac.createGain(); sfx.gain.value = CONFIG.music.sfxVolume; sfx.connect(master);
      return true;
    } catch (_) { ac = null; return false; }
  }
  function tone(freq, t, dur, type, out, vol) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
  }
  function schedule() {
    const song = SONGS[mode];
    const s16 = 60 / song.bpm / 4;
    while (nextT < ac.currentTime + 0.2) {
      const ch = song.chords[Math.floor(step / 16) % song.chords.length];
      const s = step % 16;
      if (s % 4 === 0) tone(mtof(ch[0] - 12), nextT, 0.32, "triangle", music, 0.45);          // bass
      if (s % 2 === 0) tone(mtof(ch[(s / 2) % 3] + 12), nextT, 0.12, "square", music, 0.05);  // arpeggio
      if (s === 0) ch.forEach((m) => tone(mtof(m), nextT, s16 * 15, "sine", music, 0.08));    // pad
      if (mode === "party" && s % 4 === 2) tone(mtof(ch[2] + 24), nextT, 0.06, "triangle", music, 0.05); // sparkle
      nextT += s16; step++;
    }
  }
  function play(newMode) {
    if (!init() || !SONGS[newMode]) return;
    if (ac.state === "suspended") ac.resume();
    if (mode === newMode && loopId) return;
    stop();
    mode = newMode; step = 0; nextT = ac.currentTime + 0.05;
    loopId = setInterval(schedule, 50);
    schedule();
  }
  function stop() { if (loopId) clearInterval(loopId); loopId = null; }
  function fx(name) {
    if (!ac || !on) return;
    const t = ac.currentTime + 0.01;
    const seq = {
      lock:    [[72, 0, 0.1], [79, 0.08, 0.14]],
      right:   [[72, 0, 0.15], [76, 0.1, 0.15], [79, 0.2, 0.15], [84, 0.3, 0.35]],
      wrong:   [[64, 0, 0.2], [60, 0.18, 0.2], [55, 0.36, 0.45]],
      tick:    [[88, 0, 0.05]],
      fanfare: [[67, 0, 0.18], [72, 0.16, 0.18], [76, 0.32, 0.18], [79, 0.48, 0.5], [84, 0.48, 0.6]],
    }[name] || [];
    seq.forEach(([m, d, dur]) => tone(mtof(m), t + d, dur, name === "wrong" ? "sawtooth" : "triangle", sfx, name === "tick" ? 0.15 : 0.35));
  }
  function setOn(v) {
    on = v;
    try { localStorage.setItem("hotseat-sound", v ? "1" : "0"); } catch (_) {}
    if (master) master.gain.setTargetAtTime(v ? 1 : 0, ac.currentTime, 0.05);
  }
  document.addEventListener("visibilitychange", () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else ac.resume();
  });
  return { play, stop, fx, setOn, isOn: () => on };
})();

function paintSoundBtn() {
  const b = $("soundBtn");
  b.textContent = Sound.isOn() ? "🔊" : "🔇";
  b.setAttribute("aria-pressed", String(Sound.isOn()));
  b.setAttribute("aria-label", Sound.isOn() ? "Music on. Tap to mute" : "Music off. Tap to unmute");
}
$("soundBtn").addEventListener("click", () => { Sound.setOn(!Sound.isOn()); paintSoundBtn(); });
paintSoundBtn();

/* ===== Floating background ===== */
(function makeFloaters() {
  if (REDUCED) return;
  const box = $("bgFloat");
  const emojis = ["✨", "🎵", "⭐", "🎶", "🧡", "🎉"];
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 12 + Math.random() * 18 + "px";
    s.style.animationDuration = 11 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

/* ==========================================================
   1. INTRO
   ========================================================== */
document.title = `${CONFIG.to} in the ${CONFIG.showName}`;
$("greeting").textContent = fill(CONFIG.greeting);
$("toName").textContent = CONFIG.to;
$("showName").textContent = CONFIG.showName;
$("introText").textContent = fill(CONFIG.introText);
["meCity", "tMeCity"].forEach((id) => ($(id).textContent = CONFIG.me.city));
["themCity", "tThemCity"].forEach((id) => ($(id).textContent = CONFIG.them.city));
["meFlag", "tMeFlag"].forEach((id) => ($(id).textContent = CONFIG.me.flag));
["themFlag", "tThemFlag"].forEach((id) => ($(id).textContent = CONFIG.them.flag));
$("distance").textContent = kmText(KM) + " km apart";
$("askBtn").textContent = `Ask ${CONFIG.from} 💡`;
$("fiftyBtn").hidden = !CONFIG.lifelines.fifty;
$("askBtn").hidden = !CONFIG.lifelines.askFrom;
if (CONFIG.brand.show) { $("brand1").hidden = false; $("brand2").hidden = false; }

const rules = [
  `${QUESTIONS.length} questions`,
  CONFIG.timerSeconds ? `${CONFIG.timerSeconds}s each` : "",
  `${[CONFIG.lifelines.fifty, CONFIG.lifelines.askFrom].filter(Boolean).length} lifelines`,
  `Top prize: ${LADDER[LADDER.length - 1]}`,
].filter(Boolean);
rules.forEach((r) => { const li = document.createElement("li"); li.textContent = r; $("rules").appendChild(li); });

function tickClocks() {
  const now = new Date();
  $("meClock").textContent = fmtTime(now, CONFIG.me.tz);
  $("themClock").textContent = fmtTime(now, CONFIG.them.tz);
}
tickClocks();
setInterval(tickClocks, 15000);

notify(`${CONFIG.to} opened the page`, fmtTime(new Date(), CONFIG.them.tz) + " his time", { tags: ["eyes"] });

// Build the small ladder strip
LADDER.forEach(() => $("strip").appendChild(document.createElement("li")));

$("startBtn").addEventListener("click", () => {
  Sound.play("quiz");
  showScreen($("introScreen"), $("quizScreen"));
  renderQuestion();
});

/* ==========================================================
   2. QUIZ
   ========================================================== */
let qIndex = 0;
let answered = false;
let timerId = null;
const results = [];   // true / false per question (for the ladder strip)
const picked = [];

function buildDynamic(item) {
  if (item.type === "distance") {
    const right = kmText(KM) + " km";
    const round = (f) => kmText(Math.round((KM * f) / 50) * 50) + " km";
    const opts = shuffle([right, round(0.4), round(1.8), round(3.1)]);
    return { options: opts, correct: opts.indexOf(right) };
  }
  if (item.type === "time") {
    const now = Date.now();
    const right = fmtTime(new Date(now), CONFIG.me.tz);
    const set = new Set([right]);
    [-90, 90, 60, -150, 120].forEach((min) => set.add(fmtTime(new Date(now + min * 60000), CONFIG.me.tz)));
    const opts = shuffle([...set].slice(0, 4));
    return { options: opts, correct: opts.indexOf(right) };
  }
  return { options: item.options.map(fill), correct: item.correct };
}

function paintStrip() {
  [...$("strip").children].forEach((li, i) => {
    li.className = i < results.length ? (results[i] ? "won" : "missed") : i === qIndex ? "now" : "";
  });
}

function renderQuestion() {
  const item = QUESTIONS[qIndex];
  item._live = buildDynamic(item);
  answered = false;

  $("qCount").textContent = `Question ${qIndex + 1} of ${QUESTIONS.length}`;
  $("qPrize").textContent = LADDER[Math.min(score, LADDER.length - 1)];
  paintStrip();
  $("qEmoji").textContent = item.emoji || "🎤";
  $("qText").textContent = fill(item.q);
  $("qFeedback").textContent = "";
  $("qFeedback").className = "feedback";
  $("qFact").textContent = "";
  $("qHint").textContent = "";
  $("nextBtn").hidden = true;
  $("fiftyBtn").disabled = usedFifty;
  $("askBtn").disabled = usedAsk || !item.hint;

  const box = $("qOptions");
  box.textContent = "";
  item._live.options.forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "option";
    const badge = document.createElement("b");
    badge.textContent = "ABCD"[i] || i + 1;
    const span = document.createElement("span");
    span.textContent = text;
    b.append(badge, span);
    b.addEventListener("click", () => answer(i));
    box.appendChild(b);
  });

  const body = $("qBody");
  body.classList.remove("swap");
  void body.offsetWidth;
  body.classList.add("swap");
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  const total = CONFIG.timerSeconds;
  $("clock").hidden = !total;
  if (!total) return;
  const end = Date.now() + total * 1000;
  let lastSec = total + 1;
  const tick = () => {
    const left = Math.max(0, end - Date.now());
    const sec = Math.ceil(left / 1000);
    $("clockNum").textContent = sec;
    $("clockFg").style.strokeDashoffset = String(119.4 * (1 - left / (total * 1000)));
    $("clock").classList.toggle("low", left < 6000);
    if (sec !== lastSec) {
      if (sec <= 5 && sec > 0) Sound.fx("tick");
      if (sec === 10 || sec === 5) $("clockSr").textContent = `${sec} seconds left`;
      lastSec = sec;
    }
    if (left <= 0) { clearInterval(timerId); if (!answered) answer(-1); }
  };
  tick();
  timerId = setInterval(tick, 100);
}

let usedFifty = false, usedAsk = false;
$("fiftyBtn").addEventListener("click", () => {
  if (usedFifty || answered) return;
  usedFifty = true;
  $("fiftyBtn").disabled = true;
  const { options, correct } = QUESTIONS[qIndex]._live;
  const keep = correct === "all" ? (Math.random() * options.length) | 0 : correct;
  const others = shuffle(options.map((_, i) => i).filter((i) => i !== keep));
  const btns = [...$("qOptions").children];
  others.slice(0, Math.max(0, options.length - 2)).forEach((i) => { btns[i].classList.add("gone"); btns[i].disabled = true; });
  Sound.fx("lock");
});
$("askBtn").addEventListener("click", () => {
  if (usedAsk || answered) return;
  usedAsk = true;
  $("askBtn").disabled = true;
  $("qHint").textContent = `${CONFIG.from} says: “${fill(QUESTIONS[qIndex].hint)}”`;
  Sound.fx("lock");
});

function answer(i) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);
  const item = QUESTIONS[qIndex];
  const { options, correct } = item._live;
  const isTrick = correct === "all";
  const timedOut = i < 0;
  const ok = isTrick ? !timedOut : i === correct;
  if (ok) score++;
  results[qIndex] = ok;
  picked[qIndex] = timedOut ? "(time ran out)" : options[i];

  [...$("qOptions").children].forEach((b, j) => {
    b.disabled = true;
    if (isTrick || j === correct) b.classList.add("correct");
    else if (j === i) b.classList.add("wrong");
    else b.classList.add("dim");
  });
  $("fiftyBtn").disabled = $("askBtn").disabled = true;

  const fb = $("qFeedback");
  const line = fill(ok ? item.right : item.wrong || item.right);
  fb.textContent = timedOut ? `${fill(CONFIG.timeoutLine)} ${isTrick ? "Every answer was right… but you had to pick one!" : line}` : line;
  fb.className = "feedback " + (ok ? "good" : "meh");
  $("qFact").textContent = fill(item.fact);
  Sound.fx(ok ? "right" : "wrong");
  paintStrip();

  notify(`Q${qIndex + 1} ${ok ? "right" : "wrong"}`, `${fill(item.q)}\n→ ${picked[qIndex]}`, { tags: [ok ? "white_check_mark" : "x"] });

  const last = qIndex === QUESTIONS.length - 1;
  $("nextBtn").textContent = last ? "Reveal my prize 🏆" : "Next question →";
  $("nextBtn").hidden = false;
  $("nextBtn").focus({ preventScroll: true });
}

$("nextBtn").addEventListener("click", () => {
  qIndex++;
  if (qIndex < QUESTIONS.length) return renderQuestion();
  showResults();
});

/* ==========================================================
   3. RESULTS + INVITE
   ========================================================== */
function waLink(text) {
  const num = (CONFIG.whatsapp.number || "").replace(/\D/g, "");
  if (!num) return "";
  const reply = [fill(text), `Hot Seat score: ${score}/${QUESTIONS.length} (${prizeNow()} ${CONFIG.prizeUnit})`, ...picked.map((a, n) => `${n + 1}. ${a}`)].join("\n");
  return `https://wa.me/${num}?text=${encodeURIComponent(reply)}`;
}

function showResults() {
  Sound.stop();
  Sound.fx("fanfare");
  const pct = Math.round((score / QUESTIONS.length) * 100);
  const note = (SCORE_NOTES.find((s) => pct >= s.min) || SCORE_NOTES[SCORE_NOTES.length - 1]).text;
  notify(`Final: ${score}/${QUESTIONS.length}`, note, { tags: ["trophy"], priority: CONFIG.ntfy.priorityOnFinish });

  showScreen($("quizScreen"), $("askScreen"));
  $("prizeUnit").textContent = CONFIG.prizeUnit;
  $("meterNote").textContent = `${score} of ${QUESTIONS.length} right. ${note}`;

  const ladder = $("ladder");
  ladder.textContent = "";
  LADDER.forEach((p, i) => {
    const li = document.createElement("li");
    const a = document.createElement("span"); a.textContent = String(i + 1);
    const b = document.createElement("span"); b.textContent = p;
    li.append(a, b);
    if (i < score) li.className = "won";
    ladder.appendChild(li);
  });

  const q = $("askQ");
  q.textContent = "";
  q.append(fill(CONFIG.ask.before) + " ");
  const s = document.createElement("span");
  s.className = "script";
  s.textContent = fill(CONFIG.ask.highlight);
  q.append(s, fill(CONFIG.ask.after));
  $("yesBtn").textContent = CONFIG.yesText;
  $("noBtn").textContent = CONFIG.noText;
  $("waNo").textContent = `Tell ${CONFIG.from} on WhatsApp 💬`;

  const target = prizeNow();
  if (REDUCED || score === 0) { $("prizeBig").textContent = target; return; }
  // reveal the prize by stepping up the ladder
  let i = 0;
  const up = () => { $("prizeBig").textContent = LADDER[i]; i++; if (i < score) setTimeout(up, 260); };
  setTimeout(up, 400);
}

let saidNo = false;
$("noBtn").addEventListener("click", () => {
  $("askHint").textContent = fill(CONFIG.noHint);
  const href = waLink(CONFIG.whatsapp.noText);
  if (href) { $("waNo").href = href; $("waNo").hidden = false; }
  if (!saidNo) notify(`${CONFIG.to} can't make it`, `Score ${score}/${QUESTIONS.length}`, { tags: ["pensive"], priority: CONFIG.ntfy.priorityOnFinish });
  saidNo = true;
});

$("yesBtn").addEventListener("click", () => {
  notify(`${CONFIG.to} is coming!`, `Score ${score}/${QUESTIONS.length}`, { tags: ["tada"], priority: CONFIG.ntfy.priorityOnFinish });
  Sound.play("party");
  showScreen($("askScreen"), $("successScreen"));
  renderSuccess();
  setTimeout(confettiBurst, REDUCED ? 0 : 250);
});

/* ==========================================================
   4. SUCCESS
   ========================================================== */
let cdTimer = null;
function renderSuccess() {
  $("badge").textContent = fill(CONFIG.badge);
  $("successTitle").textContent = fill(CONFIG.successTitle);
  $("message").textContent = fill(CONFIG.message);
  $("signoff").textContent = CONFIG.signoff;

  if (CONFIG.event) {
    $("eventBox").hidden = false;
    $("calendarBtn").hidden = false;
    $("tMeTime").textContent = fmtTime(EVENT_START, CONFIG.me.tz);
    $("tMeDate").textContent = fmtDate(EVENT_START, CONFIG.me.tz) + ` · ${CONFIG.from}'s time`;
    $("tThemTime").textContent = fmtTime(EVENT_START, CONFIG.them.tz);
    $("tThemDate").textContent = fmtDate(EVENT_START, CONFIG.them.tz) + " · your time";
    const ul = $("details");
    ul.textContent = "";
    CONFIG.event.details.forEach((d) => {
      const li = document.createElement("li");
      const ic = document.createElement("span"); ic.textContent = d.icon || "•";
      const box = document.createElement("div");
      const sm = document.createElement("small"); sm.textContent = d.label;
      const st = document.createElement("strong"); st.textContent = fill(d.value);
      box.append(sm, st);
      li.append(ic, box);
      ul.appendChild(li);
    });
    tickCountdown();
    clearInterval(cdTimer);
    cdTimer = setInterval(tickCountdown, 1000);
  } else {
    $("eventBox").hidden = true;
    $("calendarBtn").hidden = true;
  }

  const href = waLink(CONFIG.whatsapp.yesText);
  if (href) { $("waBtn").href = href; $("waBtn").textContent = `Tell ${CONFIG.from} on WhatsApp 💬`; $("waBtn").hidden = false; }
}

function tickCountdown() {
  const now = Date.now();
  const digits = $("cdDigits");
  if (now >= EVENT_END.getTime()) {
    $("cdLabel").textContent = "That party's a wrap. Thanks for coming! 🧡";
    digits.hidden = true;
    return;
  }
  if (now >= EVENT_START.getTime()) {
    $("cdLabel").textContent = "The party is happening right now! 🎶";
    digits.hidden = true;
    return;
  }
  digits.hidden = false;
  $("cdLabel").textContent = "Party starts in";
  let s = Math.floor((EVENT_START.getTime() - now) / 1000);
  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;
  $("cdD").textContent = d; $("cdH").textContent = pad(h); $("cdM").textContent = pad(m); $("cdS").textContent = pad(s);
}

const icsDate = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsEscape = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
function buildIcs() {
  const desc = [fill(CONFIG.message), "", ...CONFIG.event.details.map((d) => `${d.label}: ${fill(d.value)}`)].join("\n");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Play Planet//Hot Seat//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${icsDate(EVENT_START)}-hotseat-${CONFIG.event.date}@playplanet`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(EVENT_START)}`,
    `DTEND:${icsDate(EVENT_END)}`,
    `SUMMARY:${icsEscape(fill(CONFIG.event.calendarTitle))}`,
    `LOCATION:${icsEscape(fill(CONFIG.event.calendarLocation))}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Party in 15 minutes", "TRIGGER:-PT15M", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
$("calendarBtn").addEventListener("click", () => {
  const url = URL.createObjectURL(new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url; a.download = "party.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
});

$("againBtn").addEventListener("click", () => { confettiBurst(); Sound.fx("fanfare"); });

/* ==========================================================
   Confetti: canvas, stars + rectangles
   ========================================================== */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;
function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener("resize", sizeCanvas);
sizeCanvas();

function confettiBurst() {
  const colors = ["#ff9a3c", "#ffc674", "#e0660f", "#fff3e4", "#b5651d", "#ffd9a8"];
  const n = REDUCED ? 40 : innerWidth < 600 ? 160 : 260;
  for (let i = 0; i < n; i++) {
    const fromLeft = i % 2 === 0;
    pieces.push({
      x: REDUCED ? Math.random() * innerWidth : fromLeft ? -10 : innerWidth + 10,
      y: REDUCED ? -20 - Math.random() * innerHeight * 0.5 : innerHeight * (0.55 + Math.random() * 0.3),
      vx: REDUCED ? 0 : (fromLeft ? 1 : -1) * (4 + Math.random() * 8),
      vy: REDUCED ? 2 + Math.random() * 2 : -(9 + Math.random() * 10),
      w: 6 + Math.random() * 7, h: 8 + Math.random() * 10,
      rot: Math.random() * Math.PI, vr: REDUCED ? 0 : (Math.random() - 0.5) * 0.3,
      color: colors[(Math.random() * colors.length) | 0],
      star: Math.random() < 0.25, life: 0,
    });
  }
  if (!raf) raf = requestAnimationFrame(drawConfetti);
}
function drawStar(r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    ctx.lineTo(Math.sin(a) * rr, -Math.cos(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
function drawConfetti() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  pieces = pieces.filter((p) => p.y < innerHeight + 40 && p.life < 600);
  for (const p of pieces) {
    p.life++;
    p.vy += REDUCED ? 0 : 0.25;
    p.vx *= 0.985;
    p.x += p.vx; p.y += Math.min(p.vy, 7); p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    if (p.star) drawStar(p.w);
    else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life / 8)) + 2);
    ctx.restore();
  }
  raf = pieces.length ? requestAnimationFrame(drawConfetti) : null;
  if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
}
