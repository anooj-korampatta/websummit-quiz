import { questions } from "./questions.js";
import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

/* -------------------------
   STATE
-------------------------- */
let current = 0;
let score = 0;
let startTime = Date.now();

/* -------------------------
   DOM REFERENCES
-------------------------- */
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const detailsScreen = document.getElementById("detailsScreen");
const resultScreen = document.getElementById("resultScreen");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const counterEl = document.getElementById("questionCounter");

const cargo = document.getElementById("cargo");
const progressTrack = document.getElementById("progressTrack");

const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const submitBtn = document.getElementById("submitBtn");

/* -------------------------
   START QUIZ
-------------------------- */
document.getElementById("startBtn").onclick = () => {
  startScreen.classList.remove("active");
  quizScreen.classList.add("active");
  showQuestion();
};

/* -------------------------
   SHOW QUESTION
-------------------------- */
function showQuestion() {
  const q = questions[current];
  questionEl.innerText = q.q;
  optionsEl.innerHTML = "";

  counterEl.innerText = `${current + 1} / ${questions.length}`;

  // Cargo progress animation
  const progressPercent = current / questions.length;
  const trackWidth = progressTrack.offsetWidth;
  const cargoWidth = cargo.offsetWidth;

  cargo.style.left =
    `${progressPercent * (trackWidth - cargoWidth)}px`;

  // Render options as TOUCH CARDS
  q.options.forEach((opt, i) => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.innerHTML = `<div class="option-label">${opt}</div>`;

    card.addEventListener("click", () => handleAnswer(i));
    optionsEl.appendChild(card);
  });
}

/* -------------------------
   HANDLE ANSWER
-------------------------- */
function handleAnswer(i) {
  if (i === questions[current].answer) score++;
  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    quizScreen.classList.remove("active");
    detailsScreen.classList.add("active");
  }
}

/* -------------------------
   GIFT LOGIC
-------------------------- */
function getGift(score) {
  if (score <= 4) {
    return {
      label: "☕ Coffee Voucher",
      message: "Please go to the Gift Counter and collect your Coffee Voucher."
    };
  }
  if (score === 5) {
    return {
      label: "🎁 Bronze Gift",
      message: "Please go to the Gift Counter and collect your Bronze Gift."
    };
  }
  if (score === 6) {
    return {
      label: "🧢 Silver Gift",
      message: "Please go to the Gift Counter and collect your Silver Gift."
    };
  }
  return {
    label: "🏅 Premium Gift",
    message: "Congratulations! Please go to the Gift Counter and collect your Premium Gift."
  };
}

/* -------------------------
   CONFETTI POPPER (LOTTIE)
-------------------------- */
function playConfettiPopper() {
  const container = document.getElementById("lottieConfetti");

  // Hard reset (important for replay)
  container.innerHTML = "";

  lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "https://assets9.lottiefiles.com/packages/lf20_touohxv0.json"
    // TRUE burst / popper style
  });
}

/* -------------------------
   SUBMIT → SHOW SCORE
-------------------------- */
submitBtn.onclick = () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  // Validation
  if (!name) {
    alert("Please enter your name");
    return;
  }

  if (!phone || !/^[0-9]{8,15}$/.test(phone)) {
    alert("Please enter a valid mobile number");
    return;
  }

  const gift = getGift(score);

  // SHOW RESULT IMMEDIATELY (expo-safe UX)
  detailsScreen.classList.remove("active");
  resultScreen.classList.add("active");

  document.getElementById("scoreCircle").innerText = `${score} / 8`;
  document.getElementById("giftCategory").innerText = gift.label;
  document.getElementById("giftMessage").innerText = gift.message;

  // 🎉 CONFETTI POPPER (only for winners)
  if (score >= 1) {
    playConfettiPopper();
  }

  // Save to Firebase in background (never block UI)
  addDoc(collection(db, "quizAttempts"), {
    name,
    phone,
    score,
    gift: gift.label,
    timeTaken: Math.floor((Date.now() - startTime) / 1000),
    createdAt: serverTimestamp()
  }).catch(err => console.error("Firestore save failed:", err));

  // Auto reset
  setTimeout(() => location.reload(), 20000);
};
