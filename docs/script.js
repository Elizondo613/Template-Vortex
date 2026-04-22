/* ═══════════════════════════════════
   VORTEX E-SPORTS — script.js
═══════════════════════════════════ */

// ── AOS ──
AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 50 });

// ── Custom cursor glow ──
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
window.addEventListener('resize', () => { if (window.innerWidth > 768) mobileMenu.classList.remove('open'); });

// ── Countdown to next match ──
// Set the target date here (YYYY-MM-DD)
const targetDate = new Date('2025-04-26T18:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) {
    document.getElementById('cd-days').textContent = '00';
    document.getElementById('cd-hours').textContent = '00';
    document.getElementById('cd-mins').textContent = '00';
    document.getElementById('cd-secs').textContent = '00';
    return;
  }
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs  = Math.floor((diff % (1000 * 60)) / 1000);
  document.getElementById('cd-days').textContent  = String(days).padStart(2, '0');
  document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cd-mins').textContent  = String(mins).padStart(2, '0');
  document.getElementById('cd-secs').textContent  = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Hero stat counters ──
function animateCount(el, end, duration = 1600) {
  const format = el.dataset.format;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(end * ease);
    if (format === 'money') {
      el.textContent = '$' + (current >= 1000000
        ? (current / 1000000).toFixed(1) + 'M'
        : current >= 1000 ? (current / 1000).toFixed(0) + 'K' : current);
    } else if (format === 'plain') {
      el.textContent = current;
    } else {
      el.textContent = current.toLocaleString();
    }
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (format === 'money') el.textContent = '$4.2M';
      else if (format === 'plain') el.textContent = end;
      else el.textContent = end.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

const statEls = document.querySelectorAll('.hstat-val');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      animateCount(entry.target, parseInt(entry.target.dataset.count));
    }
  });
}, { threshold: 0.4 });
statEls.forEach(el => statObserver.observe(el));

// ── Game tag switching ──
document.querySelectorAll('.game-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    document.querySelectorAll('.game-tag').forEach(t => t.classList.remove('active'));
    tag.classList.add('active');
  });
});

// ── Join form ──
function handleJoin(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('joinSuccess');
  btn.textContent = 'Submitting...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Submit Application';
    btn.disabled = false;
    success.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => success.classList.add('hidden'), 6000);
  }, 1400);
}

// ── Player card tilt on hover ──
document.querySelectorAll('.player-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});