// ---------------------------------------------------------------
// EDIT ME: replace these placeholder questions with your own.
// `correct` is the index (0, 1 or 2) of the right answer.
// ---------------------------------------------------------------
const QUESTIONS = [
  {
    q: "What is Ms. Hyde's favorite time of day?",
    answers: ["Sunrise", "Midnight", "Lunch hour"],
    correct: 1,
  },
  {
    q: "What does Ms. Hyde never leave home without?",
    answers: ["Her mask", "An umbrella", "A notebook"],
    correct: 0,
  },
  {
    q: "Which drink would Ms. Hyde order?",
    answers: ["Chamomile tea", "Orange juice", "Black coffee, no sugar"],
    correct: 2,
  },
  {
    q: "Where would Ms. Hyde most likely be found on a Friday night?",
    answers: ["At a quiet library", "Dancing until closing", "Asleep by nine"],
    correct: 1,
  },
  {
    q: "What is Ms. Hyde's signature color?",
    answers: ["Crimson", "Mint green", "Beige"],
    correct: 0,
  },
];

const VERDICTS = [
  "Who are you? Ms. Hyde has never met you.",
  "Barely a glimmer of recognition.",
  "You've caught a glimpse behind the mask.",
  "You know Ms. Hyde rather well.",
  "Almost perfect. Ms. Hyde is watching you.",
  "Flawless. You and Ms. Hyde are clearly acquainted.",
];

// ---------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const RANKS = ["A", "2", "3", "4", "5"];
const SUITS = ["♠", "♥", "♣", "♦"];
const screens = { intro: $("intro"), quiz: $("quiz"), results: $("results") };

let index = 0;
let score = 0;
let answered = false;

function show(name) {
  Object.entries(screens).forEach(([k, el]) => el.classList.toggle("active", k === name));
  window.scrollTo(0, 0);
}

function loadQuestion() {
  const item = QUESTIONS[index];
  answered = false;

  const suit = SUITS[index % SUITS.length];
  const red = suit === "♥" || suit === "♦";
  for (const id of ["corner-tl", "corner-br"]) {
    const c = $(id);
    c.innerHTML = `${RANKS[index] || index + 1}<br>${suit}`;
    c.classList.toggle("red", red);
  }
  $("progress").textContent = `Question ${index + 1} of ${QUESTIONS.length}`;
  $("score-live").textContent = `Score: ${score}`;
  $("question-text").textContent = item.q;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("next").hidden = true;
  $("next").textContent = index === QUESTIONS.length - 1 ? "See my score" : "Next";

  const list = $("answers");
  list.innerHTML = "";
  item.answers.forEach((text, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.type = "button";
    btn.innerHTML = `<span></span><span class="icon" aria-hidden="true"></span>`;
    btn.firstChild.textContent = text;
    btn.addEventListener("click", () => choose(i));
    li.appendChild(btn);
    list.appendChild(li);
  });

  // Put the mask back over the question.
  $("question-layer").setAttribute("aria-hidden", "true");
  $("mask").classList.remove("lifted");
  $("mask").hidden = false;
}

function liftMask() {
  $("mask").classList.add("lifted");
  $("question-layer").removeAttribute("aria-hidden");
  // Move focus to the first answer once revealed.
  setTimeout(() => {
    const first = document.querySelector(".answer-btn");
    if (first && !answered) first.focus({ preventScroll: true });
  }, 400);
}

function choose(i) {
  if (answered) return;
  answered = true;

  const item = QUESTIONS[index];
  const buttons = [...document.querySelectorAll(".answer-btn")];
  const isRight = i === item.correct;

  buttons.forEach((b, n) => {
    b.disabled = true;
    if (n === item.correct) {
      b.classList.add("correct");
      b.querySelector(".icon").textContent = "✓";
    } else if (n === i) {
      b.classList.add("incorrect");
      b.querySelector(".icon").textContent = "✗";
    } else {
      b.classList.add("dim");
    }
  });

  const fb = $("feedback");
  if (isRight) {
    score++;
    fb.textContent = "Correct! Ms. Hyde approves.";
    fb.classList.add("good");
  } else {
    fb.textContent = `Incorrect. The answer was "${item.answers[item.correct]}".`;
    fb.classList.add("bad");
  }
  $("score-live").textContent = `Score: ${score}`;
  $("next").hidden = false;
  $("next").focus({ preventScroll: true });
}

function next() {
  index++;
  if (index < QUESTIONS.length) {
    loadQuestion();
  } else {
    $("final-score").textContent = score;
    document.querySelector("#results .out-of").textContent = ` / ${QUESTIONS.length}`;
    const scaled = Math.round((score / QUESTIONS.length) * (VERDICTS.length - 1));
    $("verdict").textContent = VERDICTS[scaled];
    show("results");
  }
}

function start() {
  index = 0;
  score = 0;
  loadQuestion();
  show("quiz");
}

$("start").addEventListener("click", start);
$("restart").addEventListener("click", start);
$("mask").addEventListener("click", liftMask);
$("next").addEventListener("click", next);
