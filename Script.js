document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Get theme from local storage or system preference
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = systemPrefersDark ? 'dark' : 'light';
    }
    
    applyTheme(currentTheme);

    // Add click event listener to the toggle button
    themeToggleButton.addEventListener('click', () => {
        const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(newTheme);
    });
});

// ===== Simple panorama carousel (3-up, responsive) =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-nav.prev');
  const nextBtn = document.querySelector('.carousel-nav.next');
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;

  function cardsPerView() {
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return 3;
  }

  function updateButtons() {
    const total = track.children.length;
    const perView = cardsPerView();
    prevBtn.disabled = index <= 0;
    nextBtn.disabled = index >= Math.max(0, total - perView);
  }

  function slideTo(i) {
    const firstCard = track.querySelector('.carousel-card');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    // get gap from computed style; fallback to 18
    const gap = parseFloat(getComputedStyle(track).gap) || 18;
    const move = i * (cardWidth + gap);
    track.style.transform = `translateX(-${Math.round(move)}px)`;
    index = i;
    updateButtons();
  }

  prevBtn.addEventListener('click', () => {
    const perView = cardsPerView();
    slideTo(Math.max(0, index - perView));
  });

  nextBtn.addEventListener('click', () => {
    const perView = cardsPerView();
    const maxIndex = Math.max(0, track.children.length - perView);
    slideTo(Math.min(maxIndex, index + perView));
  });

  // Recompute on resize (debounced)
  let rTO;
  window.addEventListener('resize', () => {
    clearTimeout(rTO);
    rTO = setTimeout(() => {
      // clamp index so we don't overshoot
      const perView = cardsPerView();
      index = Math.min(index, Math.max(0, track.children.length - perView));
      slideTo(index);
    }, 120);
  });

  // initial
  window.requestAnimationFrame(() => { slideTo(0); });

  // optional keyboard control
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });
});
