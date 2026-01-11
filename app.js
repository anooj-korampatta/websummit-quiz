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
const resultScreen = document.getElementById("resultScreen");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressEl = document.getElementById("progress");
const counterEl = document.getElementById("questionCounter");

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
   QUIZ FLOW
-------------------------- */
function showQuestion() {
  const q = questions[current];
  questionEl.innerText = q.q;
  optionsEl.innerHTML = "";

  progressEl.style.width = `${(current / questions.length) * 100}%`;
  counterEl.innerText = `${current + 1} / ${questions.length}`;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => handleAnswer(i);
    optionsEl.appendChild(btn);
  });
}

function handleAnswer(i) {
  if (i === questions[current].answer) score++;
  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
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
   SHOW RESULT
-------------------------- */
function showResult() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  const gift = getGift(score);

  document.getElementById("scoreCircle").innerText = `${score} / 8`;
  document.getElementById("giftCategory").innerText = gift.label;
  document.getElementById("giftMessage").innerText = gift.message;
}

/* -------------------------
   SUBMIT WITH VALIDATION
-------------------------- */
submitBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  // 🔒 Validation
  if (!name) {
    alert("Please enter your name");
    nameInput.focus();
    return;
  }

  if (!phone) {
    alert("Please enter your mobile number");
    phoneInput.focus();
    return;
  }

  if (!/^[0-9]{8,15}$/.test(phone)) {
    alert("Please enter a valid mobile number");
    phoneInput.focus();
    return;
  }

  try {
    await addDoc(collection(db, "quizAttempts"), {
      name: name,
      phone: phone,
      score: score,
      gift: getGift(score).label,
      timeTaken: Math.floor((Date.now() - startTime) / 1000),
      createdAt: serverTimestamp()
    });

    alert("Thank you! Please proceed to the gift counter.");
    setTimeout(() => location.reload(), 4000);

  } catch (error) {
    console.error("Firestore submit error:", error);
    alert("Submission failed. Please try again.");
  }
};
