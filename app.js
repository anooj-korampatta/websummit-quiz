import { questions } from "./questions.js";
import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

/* -------------------------
   STATE
-------------------------- */
let current = 0;
let score = 0;
let startTime = Date.now();

/* -------------------------
   DOM READY
-------------------------- */
window.addEventListener("DOMContentLoaded", () => {

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
  const startBtn = document.getElementById("startBtn");

  /* -------------------------
     START QUIZ
  -------------------------- */
  startBtn.addEventListener("click", () => {
    startScreen.classList.remove("active");
    quizScreen.classList.add("active");
    showQuestion();
  });

  /* -------------------------
     SHOW QUESTION
  -------------------------- */
  function showQuestion() {
    const q = questions[current];
    questionEl.innerText = q.q;
    optionsEl.innerHTML = "";

    counterEl.innerText = `${current + 1} / ${questions.length}`;

    const progressPercent = current / questions.length;
    const trackWidth = progressTrack.offsetWidth;
    const cargoWidth = cargo.offsetWidth;

    cargo.style.left =
      `${progressPercent * (trackWidth - cargoWidth)}px`;

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.addEventListener("click", () => handleAnswer(i));
      optionsEl.appendChild(btn);
    });
  }

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
     SUBMIT → SHOW SCORE
  -------------------------- */
  submitBtn.addEventListener("click", async () => {
  console.log("VIEW SCORE clicked");

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }

  if (!phone || !/^[0-9]{8,15}$/.test(phone)) {
    alert("Please enter a valid mobile number");
    return;
  }

  const gift = getGift(score);

  // ✅ SHOW RESULT IMMEDIATELY (DO NOT WAIT FOR FIREBASE)
  detailsScreen.classList.remove("active");
  resultScreen.classList.add("active");

  document.getElementById("scoreCircle").innerText = `${score} / 8`;
  document.getElementById("giftCategory").innerText = gift.label;
  document.getElementById("giftMessage").innerText = gift.message;

  // ⏳ SAVE TO FIREBASE IN BACKGROUND
  try {
    addDoc(collection(db, "quizAttempts"), {
      name,
      phone,
      score,
      gift: gift.label,
      timeTaken: Math.floor((Date.now() - startTime) / 1000),
      createdAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Firestore save failed:", err);
  }

  // 🔁 AUTO RESET
  setTimeout(() => location.reload(), 6000);
});


});
