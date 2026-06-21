// Mobile menu
const burger = document.querySelector('.burger');
const navMenu = document.getElementById('nav-menu');
burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
});
navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// Lead modal and privacy modal
const leadModal = document.getElementById('modal');
const privacyModal = document.getElementById('privacy-modal');
function syncBodyLock() {
  document.body.style.overflow = leadModal.classList.contains('open') || privacyModal.classList.contains('open') ? 'hidden' : '';
}
function openModal() { leadModal.classList.add('open'); syncBodyLock(); }
function closeModal() {
  leadModal.classList.remove('open');
  const form = document.getElementById('modal-form');
  form.reset(); form.style.display = '';
  document.getElementById('modal-success').style.display = 'none';
  const error = form.querySelector('.form-error');
  if (error) error.style.display = 'none';
  syncBodyLock();
}
function openPrivacy() { privacyModal.classList.add('open'); syncBodyLock(); }
function closePrivacy() { privacyModal.classList.remove('open'); syncBodyLock(); }
document.querySelectorAll('.open-modal').forEach(el => el.addEventListener('click', openModal));
document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelectorAll('.privacy-open').forEach(el => el.addEventListener('click', openPrivacy));
document.querySelector('.privacy-close').addEventListener('click', closePrivacy);
leadModal.addEventListener('click', e => { if (e.target === leadModal) closeModal(); });
privacyModal.addEventListener('click', e => { if (e.target === privacyModal) closePrivacy(); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (privacyModal.classList.contains('open')) closePrivacy(); else closeModal();
});

// Real form submission to the server-side mail handler
document.querySelectorAll('.email-lead-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    let errorBox = form.querySelector('.form-error');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.className = 'form-error';
      errorBox.setAttribute('role', 'alert');
      form.appendChild(errorBox);
    }
    errorBox.textContent = '';
    errorBox.style.display = 'none';
    if (form.id === 'lead-form') document.getElementById('success-msg').style.display = 'none';
    button.textContent = 'Отправляем...';
    button.disabled = true;
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const isJson = (response.headers.get('content-type') || '').includes('application/json');
      const result = isJson ? await response.json() : {};
      if (!response.ok) throw new Error(result.message || 'Не удалось отправить заявку.');
      form.reset();
      if (form.id === 'modal-form') {
        form.style.display = 'none';
        document.getElementById('modal-success').style.display = 'block';
      } else {
        const success = document.getElementById('success-msg');
        success.className = 'success-msg';
        success.textContent = result.message || '✓ Заявка отправлена! Мы свяжемся с вами.';
        success.style.display = 'block';
      }
    } catch (error) {
      errorBox.textContent = `${error.message || 'Не удалось отправить заявку.'} Можно связаться с нами по телефону или WhatsApp.`;
      errorBox.style.display = 'block';
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  });
});

// Specialists switcher
let currentSpec = 0;
function showSpec(index) {
  document.querySelectorAll('.spec-card').forEach((card, i) => card.classList.toggle('active', i === index));
  document.querySelectorAll('.spec-tab').forEach((tab, i) => tab.classList.toggle('active', i === index));
  currentSpec = index;
}
document.querySelectorAll('[data-spec-index]').forEach(tab => tab.addEventListener('click', () => showSpec(Number(tab.dataset.specIndex))));
setInterval(() => showSpec((currentSpec + 1) % 2), 10000);

// FAQ
document.querySelectorAll('.faq-q').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(openItem => openItem.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}));

// Countdown to the end of the current month
function updateCountdown() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diff = Math.max(0, end - now);
  const values = { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), mins: Math.floor((diff % 3600000) / 60000), secs: Math.floor((diff % 60000) / 1000) };
  Object.entries(values).forEach(([key, value]) => document.querySelectorAll(`.cd-${key}`).forEach(el => { el.textContent = String(value).padStart(2, '0'); }));
}
setInterval(updateCountdown, 1000); updateCountdown();

// Current section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => { if (window.scrollY >= section.offsetTop - 100) current = section.id; });
  navLinks.forEach(link => { link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : ''; });
}, { passive: true });

// Scroll reveal
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Type cards slideshow
const typeCards = document.querySelectorAll('.type-card');
const slideState = Array(typeCards.length).fill(0);
setInterval(() => typeCards.forEach((card, i) => {
  const slides = card.querySelectorAll('.type-slide');
  const dots = card.querySelectorAll('.type-dot');
  if (slides.length <= 1) return;
  slides[slideState[i]].classList.remove('active'); dots[slideState[i]].classList.remove('active');
  slideState[i] = (slideState[i] + 1) % slides.length;
  slides[slideState[i]].classList.add('active'); dots[slideState[i]].classList.add('active');
}), 15000);
