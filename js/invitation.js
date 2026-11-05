const PARTY = new Date("2026-11-06T18:30:00-05:00").getTime();
const TRACK = "musica/" + encodeURIComponent("💜 Kuromi Happy Birthday Song 🎂 Cute & Cool Sing-Along for Kuromi Fans 🎶.mp3");

const gate = document.querySelector("#gate");
const page = document.querySelector("#page");
const openBtn = document.querySelector("#openBtn");
const musicBtn = document.querySelector("#musicBtn");
const goBtn = document.querySelector("#goBtn");

const daysEl = document.querySelector("#days");
const hoursEl = document.querySelector("#hours");
const minsEl = document.querySelector("#mins");
const secsEl = document.querySelector("#secs");
const countNote = document.querySelector("#countNote");

const music = new Audio(TRACK);
music.loop = true;
music.preload = "auto";
music.volume = 0.9;

let audioOn = false;

function pad(n) {
  return String(n).padStart(2, "0");
}

function updateCountdown() {
  const diff = PARTY - Date.now();
  if (diff <= 0) {
    daysEl.textContent = "00";
    hoursEl.textContent = "00";
    minsEl.textContent = "00";
    secsEl.textContent = "00";
    countNote.textContent = "¡Llegó el gran día! La fiesta de Angela ya empezó.";
    return;
  }
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  daysEl.textContent = pad(days);
  hoursEl.textContent = pad(hours);
  minsEl.textContent = pad(mins);
  secsEl.textContent = pad(secs);
}

function burst() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  const colors = ["#ff4d9a", "#ffd0e6", "#c9a7ff", "#ffffff", "#1a0b14", "#ff77c0", "#8b6cff"];
  const pieces = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 * dpr - Math.random() * canvas.height * 0.3,
    w: (6 + Math.random() * 7) * dpr,
    h: (8 + Math.random() * 10) * dpr,
    vy: (2.2 + Math.random() * 3.4) * dpr,
    vx: (Math.random() - 0.5) * 2.4 * dpr,
    rot: Math.random() * 6,
    vr: (Math.random() - 0.5) * 0.2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035 * dpr;
      p.rot += p.vr;
      if (p.y < canvas.height + 30) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) requestAnimationFrame(tick);
    else canvas.remove();
  }
  tick();
}

function setMusicUi(on) {
  musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
  musicBtn.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
}

function startMusic() {
  const pending = music.play();
  if (!pending) {
    audioOn = true;
    setMusicUi(true);
    return;
  }
  pending.then(() => {
    audioOn = true;
    setMusicUi(true);
  }).catch(() => {
    audioOn = false;
    setMusicUi(false);
  });
}

function stopMusic() {
  music.pause();
  audioOn = false;
  setMusicUi(false);
}

function openInvite() {
  try { startMusic(); } catch (error) { /* la invitación se abre igual */ }
  gate.classList.add("is-leaving");
  page.hidden = false;
  musicBtn.hidden = false;
  burst();
  window.setTimeout(() => gate.remove(), 560);
}

openBtn.addEventListener("click", openInvite);
musicBtn.addEventListener("click", () => (audioOn ? stopMusic() : startMusic()));
goBtn.addEventListener("click", () => burst());

updateCountdown();
window.setInterval(updateCountdown, 1000);
