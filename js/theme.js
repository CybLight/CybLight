(function () {
    const body = document.body;
    const btn = document.getElementById('themeToggle');

    if (!btn) return;

    // читаем сохранённую тему
    const saved = localStorage.getItem('theme');

    if (saved === 'dark') {
      body.classList.add('dark');
      btn.textContent = 'Светлая тема';
    } else {
      body.classList.remove('dark');
      btn.textContent = 'Тёмная тема';
    }

    btn.addEventListener('click', () => {
      const isDark = body.classList.toggle('dark');
      btn.textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  })();
