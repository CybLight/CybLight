const quizQuestions = [
  {
    code: `let x = 2;
let y = "2";
console.log(x + y);`,
    options: ["4", '"22"', "NaN"],
    answer: '"22"',
  },
  {
    code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
    options: ["3", "4", "5"],
    answer: "4",
  },
  {
    code: `console.log(typeof null);`,
    options: ['"null"', '"object"', '"undefined"'],
    answer: '"object"',
  },
];

let currentIndex = 0;
let answered = false; // чтобы знать, ответил ли пользователь

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  const codeEl = document.getElementById("quiz-code");
  const optionsEl = document.getElementById("quiz-options");
  const resultEl = document.getElementById("quiz-result");

  codeEl.textContent = q.code;
  optionsEl.innerHTML = "";
  resultEl.textContent = "";
  answered = false; // сбрасываем состояние ответа

  // очистка цвета результата
  resultEl.style.color = "";

  // создаем кнопки вариантов
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "quiz-option-btn";

    btn.addEventListener("click", () => {
      if (answered) return; // нельзя выбрать ещё раз

      answered = true;

      // подсветка выбранного варианта
      document.querySelectorAll(".quiz-option-btn").forEach((b) => {
        b.disabled = true;
        if (b.textContent === q.answer) {
          b.style.borderColor = "#7CFC00";
          b.style.color = "#7CFC00";
        }
        if (b === btn && opt !== q.answer) {
          b.style.borderColor = "#ff6b6b";
          b.style.color = "#ff6b6b";
        }
      });

      // результат
      if (opt === q.answer) {
        resultEl.textContent = "✅ Правильно!";
        resultEl.style.color = "#7CFC00";
      } else {
        resultEl.textContent = `❌ Неправильно. Правильный ответ: ${q.answer}`;
        resultEl.style.color = "#ff6b6b";

        // лёгкая вибрация на мобильных
        if (navigator.vibrate) navigator.vibrate(150);
      }
    });

    optionsEl.appendChild(btn);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();

  const nextBtn = document.getElementById("quiz-next");

  nextBtn.addEventListener("click", () => {
    if (!answered) {
      // не давать перейти к следующему вопросу
      alert("Сначала выбери ответ!");
      return;
    }

    currentIndex = (currentIndex + 1) % quizQuestions.length;
    renderQuestion();
  });
});
