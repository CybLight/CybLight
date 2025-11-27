const quizQuestions = [
  {
    code: `let x = 2;
let y = "2";
console.log(x + y);`,
    options: ['4', '"22"', 'NaN'],
    answer: '"22"'
  },
  {
    code: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr.length);`,
    options: ['3', '4', '5'],
    answer: '4'
  },
  {
    code: `console.log(typeof null);`,
    options: ['"null"', '"object"', '"undefined"'],
    answer: '"object"'
  }
];

let currentIndex = 0;

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  const codeEl = document.getElementById('quiz-code');
  const optionsEl = document.getElementById('quiz-options');
  const resultEl = document.getElementById('quiz-result');

  codeEl.textContent = q.code;
  optionsEl.innerHTML = '';
  resultEl.textContent = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      if (opt === q.answer) {
        resultEl.textContent = '✅ Правильно!';
        resultEl.style.color = '#7CFC00';
      } else {
        resultEl.textContent = `❌ Неправильно. Правильный ответ: ${q.answer}`;
        resultEl.style.color = '#ff6b6b';
      }
    });
    optionsEl.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderQuestion();

  document.getElementById('quiz-next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % quizQuestions.length;
    renderQuestion();
  });
});
