(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const progress = $('#scrollProgress');
  const backTop = $('#backTop');
  const menu = $('.desktop-nav');
  const menuToggle = $('#menuToggle');
  const themeToggle = $('#themeToggle');

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    backTop.classList.toggle('visible', scrollY > 500);
    const sections = $$('main section[id]');
    let current = 'home';
    sections.forEach(section => { if (scrollY >= section.offsetTop - 160) current = section.id; });
    $$('.desktop-nav a').forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  menuToggle.addEventListener('click', () => {
    const opened = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    menuToggle.textContent = opened ? '×' : '☰';
  });
  $$('.desktop-nav a').forEach(link => link.addEventListener('click', () => menu.classList.remove('open')));
  backTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light') document.body.classList.add('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☾' : '☼';
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const theme = document.body.classList.contains('light') ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', theme);
    themeToggle.textContent = theme === 'light' ? '☾' : '☼';
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
  $$('.reveal').forEach(el => observer.observe(el));

  $$('[data-filter-group="projects"] .filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      $$('[data-filter-group="projects"] .filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      $$('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
  $('#year').textContent = new Date().getFullYear();
})();
