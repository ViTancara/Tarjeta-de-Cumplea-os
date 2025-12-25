
const $ = (s) => document.querySelector(s);

const yes = $("#yes");
const no = $("#no");
const final = $("#final");
const card = $("#card");

// ✅ Estado inicial FORZADO (después de definir final y card)
final.hidden = true;
final.classList.remove("active");
card.classList.remove("hidden");


const toNameEl = $("#toName");
const toName2El = $("#toName2");
const fromNameEl = $("#fromName");

const copyBtn = $("#copyBtn");
const restartBtn = $("#restartBtn");
const moreConfetti = $("#moreConfetti");

const musicBtn = $("#musicBtn");
const audio = $("#audio");

let musicUnlocked = false;
let musicOn = false;

// Personalización por URL: ?para=Ana&de=Isaias
const params = new URLSearchParams(location.search);
const para = params.get("para");
const de = params.get("de");

const safe = (t) => (t ? decodeURIComponent(t).slice(0, 40) : null);


if (safe(para)) {
  toNameEl.textContent = safe(para);
  toName2El.textContent = safe(para);
} else {
  toNameEl.textContent = "✨";
  toName2El.textContent = "✨";
}

if (safe(de)) fromNameEl.textContent = safe(de);

// ---- Música: se desbloquea con interacción (evita bloqueo del navegador)
function unlockMusic() {
  if (musicUnlocked) return;
  musicUnlocked = true;
  audio.volume = 0;
  audio.play().then(() => {
    musicOn = true;
    if (musicBtn) {
      musicBtn.textContent = "Música ⏸️";
      musicBtn.setAttribute("aria-pressed", "true");
    }
  }).catch(() => {
    // Si no deja, no pasa nada; el botón seguirá intentando
  });
}

document.body.addEventListener("click", unlockMusic, { once: true });

// Toggle música desde el botón
musicBtn.addEventListener("click", async () => {
  try {
    if (!musicUnlocked) unlockMusic();

    if (!musicOn) {
      await audio.play();
      musicOn = true;
      musicBtn.textContent = "Música ⏸️";
      musicBtn.setAttribute("aria-pressed", "true");
    } else {
      audio.pause();
      musicOn = false;
      musicBtn.textContent = "Música ▶️";
      musicBtn.setAttribute("aria-pressed", "false");
    }
  } catch {
    alert("Tu navegador bloqueó la música. Intenta tocar primero la tarjeta y luego el botón.");
  }
});

// ---- Confetti PRO
function fireConfetti() {
  const duration = 4000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      startVelocity: 30,
      spread: 360,
      ticks: 70,
      origin: { x: Math.random(), y: 0.2 }
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function bigConfetti() {
  confetti({
    particleCount: 180,
    spread: 70,
    startVelocity: 45,
    origin: { y: 0.6 }
  });
}

// ---- Botón NO: se escapa + cambia mensajes
const noMessages = [
  "¿Segura? 😳",
  "Piénsalo... 🙈",
  "No seas mala 😅",
  "Mira el otro botón 👀",
  "Última oportunidad 😌",
  "Te juro que vale la pena 🎁",
  "Ya pues… 👉👈"
];

let tries = 0;

function moveNoButton() {
  const box = document.querySelector(".options");
  const rect = box.getBoundingClientRect();
  const btnRect = no.getBoundingClientRect();

  const padding = 6;
  const maxX = rect.width - btnRect.width - padding * 2;
  const maxY = rect.height - btnRect.height - padding * 2;

  const x = padding + Math.random() * Math.max(10, maxX);
  const y = padding + Math.random() * Math.max(10, maxY);

  no.style.left = `${x}px`;
  no.style.top = `${y}px`;
}

no.addEventListener("mouseenter", () => {
  tries++;
  no.textContent = noMessages[Math.floor(Math.random() * noMessages.length)];
  moveNoButton();
});

no.addEventListener("click", () => {

if (navigator.vibrate) navigator.vibrate([20, 30, 20]);

  tries++;
  no.textContent = "😅";
  moveNoButton();
});

async function playMusic() {
  try {
    if (!musicUnlocked) musicUnlocked = true;
    audio.volume = 0.5;
    await audio.play();
    musicOn = true;

    if (musicBtn) {
      musicBtn.textContent = "Música ⏸️";
      musicBtn.setAttribute("aria-pressed", "true");
    }
  } catch (e) {
    console.log("Música bloqueada:", e);
  }
}

function softConfetti() {
  confetti({
    particleCount: 10,
    spread: 60,
    startVelocity: 30,
    gravity: 0.8,
    scalar: 0.9,
    origin: { y: 0.6 }
  });
}


// ---- Botón SÍ: abre final + confetti
yes.addEventListener("click", async () => {

  if (navigator.vibrate) navigator.vibrate([30,40,30]);

  await playMusic(); // si ya lo tienes
  bigConfetti();
  fireConfetti();

  // 1) Fade out de la tarjeta
  card.classList.add("hidden");

  // 2) Espera a que termine la transición del card
  setTimeout(() => {
    // 3) Mostrar final (primero lo sacas de hidden)
    final.hidden = false;

    // 4) En el siguiente frame, activa fade in
    requestAnimationFrame(() => final.classList.add("active"));

    softConfetti(); // tu confeti suave
  }, 450); // igual o un poquito más que tu CSS (.45s)
});



// Más confetti
moreConfetti.addEventListener("click", () => {
  bigConfetti();
  fireConfetti();
});

// Copiar link
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    copyBtn.textContent = "¡Copiado! ✅";
    setTimeout(() => (copyBtn.textContent = "Copiar link 🔗"), 1200);
  } catch {
    prompt("Copia este link:", location.href);
  }
});

// Reiniciar
restartBtn.addEventListener("click", () => location.reload());

