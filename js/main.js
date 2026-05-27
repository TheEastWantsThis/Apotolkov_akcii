// Menu
function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('open');
}

// Modal
function openModal() {
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
  // reset form
  const f = document.getElementById('modal-form');
  if (f) { f.reset(); f.style.display = ''; }
  const s = document.getElementById('modal-success');
  if (s) s.style.display = 'none';
  const btn = document.getElementById('modal-submit');
  if (btn) { btn.textContent = 'Записаться на замер'; btn.disabled = false; }
}
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Bind all open-modal triggers
document.querySelectorAll('.open-modal').forEach(el => {
  el.addEventListener('click', openModal);
});

// Modal form submit
function submitModal(e) {
  e.preventDefault();
  const btn = document.getElementById('modal-submit');
  btn.textContent = 'Отправляем...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('modal-form').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';
    setTimeout(closeModal, 2800);
  }, 1200);
}

// Contact form submit
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  btn.textContent = 'Отправляем...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('success-msg').style.display = 'block';
    btn.textContent = '✓ Отправлено!';
    e.target.reset();
  }, 1200);
}

// Specialists switcher
let currentSpec = 0;
function showSpec(index) {
  document.querySelectorAll('.spec-card').forEach((c, i) => c.classList.toggle('active', i === index));
  document.querySelectorAll('.spec-tab').forEach((t, i) => t.classList.toggle('active', i === index));
  currentSpec = index;
}
setInterval(() => showSpec((currentSpec + 1) % 2), 10000);

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Countdown to end of month
function updateCountdown() {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const diff = Math.max(0, end - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  document.querySelectorAll('.cd-days').forEach(el => el.textContent = pad(d));
  document.querySelectorAll('.cd-hours').forEach(el => el.textContent = pad(h));
  document.querySelectorAll('.cd-mins').forEach(el => el.textContent = pad(m));
  document.querySelectorAll('.cd-secs').forEach(el => el.textContent = pad(s));
}
setInterval(updateCountdown, 1000);
updateCountdown();

// Nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

// Auto popup — after 30s or at 50% scroll depth, once per session
(function () {
  let shown = false;

  function showAutoPopup() {
    if (shown) return;
    if (sessionStorage.getItem('autoPopupShown')) return;
    shown = true;
    document.getElementById('auto-popup').classList.add('show');
  }

  window.closeAutoPopup = function () {
    document.getElementById('auto-popup').classList.remove('show');
    sessionStorage.setItem('autoPopupShown', '1');
  };

  window.submitAutoPopup = function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('.auto-popup-btn');
    btn.textContent = '✓ Записаны!';
    btn.style.background = 'var(--green)';
    btn.disabled = true;
    e.target.style.display = 'none';
    document.getElementById('auto-popup-success').style.display = 'block';
    sessionStorage.setItem('autoPopupShown', '1');
    setTimeout(window.closeAutoPopup, 2500);
  };

  setTimeout(showAutoPopup, 30000);

  window.addEventListener('scroll', function () {
    const scrolled = window.scrollY + window.innerHeight;
    if (scrolled >= document.body.scrollHeight * 0.5) {
      showAutoPopup();
    }
  }, { passive: true });
}());

// Fade-in on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
