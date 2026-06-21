const message = [
  "Halo, nggaa.",
  "Gabut aja sih bikin kayak gini. ahahah.",
  "Nggak penting-penting amat, tapi ya lumayan lah.",
  "",
  "Oh iya, cepet besar ya.",
  "Eh tapi kamu udah besar se,",
  "cuma badannya aja yang masih kecil. awokwokwok.",
  "",
  "Yaudah, intinya semoga harimu menyenangkan ya",
  "sampai hari ulang tahunmu datang."
].join("\n");

const birthdayLetterMessage = [
  "Hai, Jinggaa.",
  "",
  "Akhirnya hari yang ditunggu datang juga yaa.",
  "",
  "Semoga hari-harimu ke depan dipenuhi lebih banyak tawa daripada sedih, lebih banyak cerita baik daripada kecewa dan lebih banyak alasan untuk tersenyum tanpa dipaksa.",
  "",
  "Tetap jadi dirimu yang sekarang yaa. Tetap tumbuh dengan caramu sendiri. Tidak perlu terburu-buru menjadi apa pun kokk.",
  "",
  "Dan kalau suatu saat harimu terasa berat, ingat bahwa kamu sudah berhasil melewati banyak hal sampai sejauh ini.",
  "",
  "Terima kasih sudah hadir di dunia ini.",
  "",
  "Selamat ulang tahun, Jinggaa."
].join("\n");

const typewriterEl = document.getElementById("typewriter");
const replayBtn = document.getElementById("replayBtn");
const seedButton = document.getElementById("seedButton");
const introOverlay = document.getElementById("introOverlay");

const birthdayOverlay = document.getElementById("birthdayOverlay");
const giftBox = document.getElementById("giftBox");
const letterScene = document.getElementById("letterScene");
const letterBody = document.getElementById("letterBody");
const confettiLeft = document.getElementById("confettiLeft");
const confettiRight = document.getElementById("confettiRight");

let typingTimer;
let hasStarted = false;
let birthdayStateApplied = false;
let giftOpened = false;
let birthdayReadyAfterIntro = false;

function playTyping(customMessage = message) {
  clearTimeout(typingTimer);
  typewriterEl.innerHTML = "";
  let i = 0;

  function tick() {
    const visible = customMessage.slice(0, i).replace(/\n/g, "<br>");
    typewriterEl.innerHTML = visible + '<span class="cursor">|</span>';
    i++;

    if (i <= customMessage.length) {
      typingTimer = setTimeout(tick, customMessage[i - 1] === "\n" ? 240 : 34);
    } else {
      typewriterEl.innerHTML = visible;
    }
  }

  tick();
}

function startExperience() {
  if (hasStarted) return;
  hasStarted = true;

  document.body.classList.add("started");
  introOverlay.classList.add("hidden");

  if (birthdayReadyAfterIntro || getBirthdayStatus().isBirthday) {
    setTimeout(() => {
      applyBirthdayState();
    }, 600);
    return;
  }

  setTimeout(() => {
    playTyping();
  }, 1500);
}

function getBirthdayStatus() {
  const now = new Date();
  const year = now.getFullYear();

  const startOfBirthday = new Date(year, 5, 22, 0, 0, 0);
  const endOfBirthday = new Date(year, 5, 22, 23, 59, 59);

  if (now >= startOfBirthday && now <= endOfBirthday) {
    return {
      isBirthday: true,
      diff: 0
    };
  }

  let target = startOfBirthday;
  if (now > endOfBirthday) {
    target = new Date(year + 1, 5, 22, 0, 0, 0);
  }

return {
  isBirthday: true,
  diff: 0
};
}

function applyBirthdayState() {
  if (birthdayStateApplied) return;
  birthdayStateApplied = true;
  birthdayOverlay.classList.remove("hidden");
}

function createConfetti(container, side) {
  container.innerHTML = "";

  const colors = ["#8b6b4a", "#b08a68", "#eadcc9", "#aeb798", "#96a27f"];

  for (let i = 0; i < 18; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";

    const x = side === "left"
      ? 40 + Math.random() * 120
      : -(40 + Math.random() * 120);

    const y = -40 - Math.random() * 150;
    const r = `${Math.floor(Math.random() * 360)}deg`;

    piece.style.left = `${25 + Math.random() * 30}px`;
    piece.style.top = `${120 + Math.random() * 40}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--r", r);
    piece.style.animationDelay = `${Math.random() * 0.15}s`;

    container.appendChild(piece);
  }
}

function openGift() {
  if (giftOpened) return;
  if (!letterBody) return;

  giftOpened = true;

  giftBox.classList.add("opened");
  createConfetti(confettiLeft, "left");
  createConfetti(confettiRight, "right");

  setTimeout(() => {
    giftBox.classList.add("hidden");
    letterScene.classList.remove("hidden");

    requestAnimationFrame(() => {
      letterScene.classList.add("show");
    });

    letterBody.innerHTML = birthdayLetterMessage.replace(/\n/g, "<br>");
  }, 420);
}

function updateCounter() {
  const status = getBirthdayStatus();

  if (status.isBirthday) {
    birthdayReadyAfterIntro = true;

    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    if (hasStarted) {
      applyBirthdayState();
    }
    return;
  }

  const totalSeconds = Math.max(0, Math.floor(status.diff / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

seedButton.addEventListener("click", startExperience);
replayBtn.addEventListener("click", () => playTyping());
giftBox.addEventListener("click", openGift);

updateCounter();
setInterval(updateCounter, 1000);

const floatingLeaves = document.getElementById("floatingLeaves");
const leafCount = window.innerWidth < 740 ? 10 : 18;

for (let i = 0; i < leafCount; i++) {
  const leaf = document.createElement("span");
  leaf.className = "floating-leaf";
  leaf.style.left = `${Math.random() * 100}%`;
  leaf.style.animationDuration = `${10 + Math.random() * 8}s`;
  leaf.style.animationDelay = `${Math.random() * 8}s`;
  leaf.style.opacity = `${0.14 + Math.random() * 0.22}`;
  leaf.style.transform = `scale(${0.8 + Math.random() * 1.1})`;
  floatingLeaves.appendChild(leaf);
}
