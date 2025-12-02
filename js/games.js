// Все вопросы с пометкой сложности
const allQuestions = [
  {
    code: `let x = 2;
let y = "2";
console.log(x + y);`,
    options: ["4", '"22"', "NaN"],
    answer: '"22"',
    difficulty: "easy",
  },
  {
    code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
    options: ["3", "4", "5"],
    answer: "4",
    difficulty: "easy",
  },
  {
    code: `console.log(typeof null);`,
    options: ['"null"', '"object"', '"undefined"'],
    answer: '"object"',
    difficulty: "medium",
  },
  {
    code: `for (let i = 0; i < 3; i++) {}
console.log(i);`,
    options: ["3", "2", "Ошибка"],
    answer: "Ошибка",
    difficulty: "medium",
  },
  {
    code: `const a = [1, 2, 3];
a[10] = 99;
console.log(a.length);`,
    options: ["4", "11", "10"],
    answer: "11",
    difficulty: "hard",
  },
  {
    code: `console.log(0.1 + 0.2 === 0.3);`,
    options: ["true", "false"],
    answer: "false",
    difficulty: "hard",
  },
];

let currentQuestions = []; // список вопросов для текущей игры
let currentIndex = 0;
let answered = false;
let gameStarted = false;
let score = 0;
let bestScore = 0;

// ссылки на элементы
let scoreEl,
  bestScoreEl,
  questionNumberEl,
  questionTotalEl,
  nextBtn,
  restartBtn,
  startBtn,
  gameBlock,
  difficultyEl;

// --- служебные функции ---

function shuffle(array) {
  // Фишер–Йетс, честная рандомизация
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadBestScore() {
  const stored = localStorage.getItem("cyblight_quiz_highscore");
  bestScore = stored ? Number(stored) : 0;
  if (bestScoreEl) bestScoreEl.textContent = bestScore;
}

function saveBestScore() {
  localStorage.setItem("cyblight_quiz_highscore", String(bestScore));
}

// Обновление статуса в панельке (вопрос / всего / счёт / рекорд)
function updateStatusBar() {
  if (questionNumberEl) {
    questionNumberEl.textContent =
      currentQuestions.length === 0 ? 0 : currentIndex + 1;
  }
  if (questionTotalEl) {
    questionTotalEl.textContent = currentQuestions.length;
  }
  if (scoreEl) {
    scoreEl.textContent = score;
  }
  if (bestScoreEl) {
    bestScoreEl.textContent = bestScore;
  }
}

// --- Рендер вопроса ---

function renderQuestion() {
  if (!currentQuestions.length) return;

  const q = currentQuestions[currentIndex];
  const codeEl = document.getElementById("quiz-code");
  const optionsEl = document.getElementById("quiz-options");
  const resultEl = document.getElementById("quiz-result");
  const explanationEl = document.getElementById("quiz-explanation");

  codeEl.textContent = q.code;
  optionsEl.innerHTML = "";
  resultEl.textContent = "";
  if (explanationEl) explanationEl.textContent = "";
  answered = false;
  resultEl.style.color = "";

  updateStatusBar();

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "quiz-option-btn";

    btn.addEventListener("click", () => {
      if (answered) return;

      answered = true;
      const isCorrect = opt === q.answer;

      document.querySelectorAll(".quiz-option-btn").forEach((b) => {
        b.disabled = true;
        if (b.textContent === q.answer) {
          b.style.borderColor = "#7CFC00";
          b.style.color = "#7CFC00";
        }
        if (b === btn && !isCorrect) {
          b.style.borderColor = "#ff6b6b";
          b.style.color = "#ff6b6b";
        }
      });

      if (isCorrect) {
        score += 5; // +5 очков
        updateStatusBar();
        resultEl.textContent = "✅ Правильно! +5 очков";
        resultEl.style.color = "#7CFC00";
      } else {
        resultEl.textContent = `❌ Неправильно. Правильный ответ: ${q.answer}`;
        resultEl.style.color = "#ff6b6b";
        if (navigator.vibrate) navigator.vibrate(150);
      }
    });

    optionsEl.appendChild(btn);
  });
}

// --- Завершение / рестарт ---

function finishGame() {
  gameStarted = false;

  const codeEl = document.getElementById("quiz-code");
  const optionsEl = document.getElementById("quiz-options");
  const resultEl = document.getElementById("quiz-result");
  const explanationEl = document.getElementById("quiz-explanation");

  codeEl.textContent = "Игра завершена!";
  optionsEl.innerHTML = "";

  // обновляем рекорд
  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
    resultEl.textContent = `Новый рекорд! 🎉 ${score} очков`;
  } else {
    resultEl.textContent = `Твой финальный счёт: ${score} очков 🎉`;
  }
  resultEl.style.color = "#7CFC00";

  if (explanationEl) explanationEl.textContent = "";
  if (nextBtn) nextBtn.disabled = true;
}

function restartGame() {
  if (startBtn) startBtn.style.display = "none";
  if (gameBlock) gameBlock.style.display = "block";

  score = 0;
  currentIndex = 0;
  answered = false;
  gameStarted = true;

  if (nextBtn) nextBtn.disabled = false;

  // пересобираем список вопросов по выбранной сложности + перемешиваем
  setupQuestionsByDifficulty();
  renderQuestion();
}

// --- Настройка вопросов по сложности ---

function setupQuestionsByDifficulty() {
  const diff = difficultyEl ? difficultyEl.value : "medium"; // по умолчанию

  if (diff === "easy" || diff === "medium" || diff === "hard") {
    currentQuestions = allQuestions.filter((q) => q.difficulty === diff);
  } else {
    currentQuestions = [...allQuestions];
  }

  // на всякий случай
  shuffle(currentQuestions);
  currentIndex = 0;

  if (!currentQuestions.length) {
    alert("Для выбранной сложности пока нет вопросов 🙃");
  }

  updateStatusBar();
}

// --- Инициализация ---

document.addEventListener("DOMContentLoaded", () => {
  startBtn = document.getElementById("start-quiz");
  gameBlock = document.getElementById("code-quiz");
  nextBtn = document.getElementById("quiz-next");
  restartBtn = document.getElementById("quiz-restart");

  scoreEl = document.getElementById("quiz-score");
  bestScoreEl = document.getElementById("quiz-best");
  questionNumberEl = document.getElementById("quiz-number");
  questionTotalEl = document.getElementById("quiz-total");
  difficultyEl = document.getElementById("quiz-difficulty");

  if (gameBlock) gameBlock.style.display = "none";

  loadBestScore();
  updateStatusBar();

  // старт игры
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      restartGame();
    });
  }

  // смена сложности (если меняешь до старта — просто подготовим список)
  if (difficultyEl) {
    difficultyEl.addEventListener("change", () => {
      if (!gameStarted) {
        setupQuestionsByDifficulty();
      }
    });
  }

  // следующий вопрос
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!gameStarted) return;

      if (!answered) {
        alert("Сначала выбери ответ!");
        return;
      }

      if (currentIndex >= currentQuestions.length - 1) {
        finishGame();
      } else {
        currentIndex++;
        renderQuestion();
      }
    });
  }

  // начать заново
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      restartGame();
    });
  }
});
