/* ============================================================
   IGS CONVENTION CENTRE — Main JavaScript
   (Updated from Sree Ganesha Mahal original)
   ============================================================ */

/* === ACTIVE NAV LINK === */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* === MOBILE NAV TOGGLE === */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
    });
  });
}

/* === NAVBAR SCROLL EFFECT === */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* === SCROLL REVEAL === */
function initScrollReveal() {
  // Add js-loaded to body so animations.css activates reveal classes
  document.body.classList.add('js-loaded');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.events-grid, .facilities-grid, .blog-grid, .pricing-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      if (!child.classList.contains('reveal')) {
        child.classList.add('reveal', `stagger-${(i % 8) + 1}`);
      }
    });
  });
}

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent.replace(/[^\d.]/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const isDecimal = target % 1 !== 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = easeOut(progress) * target;
    el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString('en-IN')) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => observer.observe(el));
}

/* === LEAD CAPTURE POPUP (shows after 20 seconds) === */
function initPopup() {
  const overlay = document.getElementById('leadPopup');
  if (!overlay) return;
  if (sessionStorage.getItem('popup-dismissed')) return;
  setTimeout(() => overlay.classList.add('show'), 20000);
  const closeBtn = overlay.querySelector('.popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('show');
      sessionStorage.setItem('popup-dismissed', 'true');
    });
  }
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      sessionStorage.setItem('popup-dismissed', 'true');
    }
  });
  const popupForm = document.getElementById('leadForm');
  if (popupForm) {
    popupForm.addEventListener('submit', e => {
      e.preventDefault();
      overlay.classList.remove('show');
      sessionStorage.setItem('popup-dismissed', 'true');
      showToast('Thank you! We will contact you soon.', 'success');
    });
  }
}

/* === TOAST NOTIFICATION === */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* === FAQ ACCORDION === */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* === SMOOTH SCROLL === */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* === IMAGE FALLBACKS === */
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.background = 'linear-gradient(135deg, #F0E8D5 0%, #E5D9C0 100%)';
      this.style.minHeight = '200px';
      this.removeAttribute('src');
    });
  });
}

/* === TESTIMONIALS SLIDER === */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.t-dot');
  if (!track || !dots.length) return;
  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  if (total <= 3) return;
  function goTo(index) {
    current = (index + total) % total;
    const perView = window.innerWidth < 768 ? 1 : 3;
    const offset = current * (100 / perView);
    track.style.transform = `translateX(-${offset}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  let timer = setInterval(() => goTo(current + 1), 4500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4500);
  });
}

/* === LOAD EVENTS === */
async function loadHomeEvents() {
  const container = document.getElementById('homeEventsList');
  if (!container) return;
  try {
    const res = await fetch('data/events.json');
    const events = await res.json();
    container.innerHTML = events.slice(0, 6).map(ev => `
      <div class="event-card reveal">
        <div class="event-card-image">
          <img src="${ev.image}" alt="${ev.event_name}" loading="lazy">
          <span class="event-category">${ev.category}</span>
        </div>
        <div class="event-card-body">
          <h3>${ev.event_name}</h3>
          <p>${ev.description.substring(0, 90)}...</p>
          <div class="event-price">₹${ev.base_price.toLocaleString('en-IN')}<span>/ starting from</span></div>
          <a href="booking.html?event=${ev.id}" class="btn btn-crimson">Book This Event</a>
        </div>
      </div>
    `).join('');
    initScrollReveal();
  } catch (e) {
    if (container) container.innerHTML = '<p style="text-align:center;padding:32px;color:var(--text-light);">Events loading soon.</p>';
  }
}

/* === LOAD TESTIMONIALS === */
async function loadHomeTestimonials() {
  const container = document.getElementById('testimonialsTrack');
  if (!container) return;
  try {
    const res = await fetch('data/testimonials.json');
    const items = await res.json();
    container.innerHTML = items.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-stars">${'★'.repeat(t.rating)}</div>
        <p class="testimonial-text">"${t.review}"</p>
        <div class="testimonial-author">
          <div class="author-avatar">${t.initials}</div>
          <div class="author-info">
            <span class="name">${t.name}</span>
            <span class="event">${t.event_type} · ${t.event_date}</span>
          </div>
        </div>
      </div>
    `).join('');
    const dotsContainer = document.querySelector('.testimonials-nav');
    if (dotsContainer) {
      dotsContainer.innerHTML = items.map((_, i) => `<span class="t-dot ${i===0?'active':''}"></span>`).join('');
    }
    initTestimonialsSlider();
  } catch (e) {}
}

/* === LOAD BLOG === */
async function loadHomeBlog() {
  const container = document.getElementById('homeBlogList');
  if (!container) return;
  try {
    const res = await fetch('data/blog.json');
    const posts = await res.json();
    container.innerHTML = posts.slice(0, 3).map(post => `
      <div class="blog-card reveal">
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
          <span class="blog-category-badge">${post.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span>${new Date(post.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
            <span>${post.author}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.short_description}</p>
          <a href="blog-post.html?slug=${post.slug}" class="read-more">Read More →</a>
        </div>
      </div>
    `).join('');
    initScrollReveal();
  } catch (e) {}
}

/* === AVAILABILITY CALENDAR === */
const muhuratDates = ["2026-01-28","2026-02-06","2026-02-08","2026-02-13","2026-02-15","2026-02-16","2026-02-20","2026-03-05","2026-03-06","2026-03-08","2026-03-15","2026-03-16","2026-03-25","2026-04-06","2026-04-12","2026-04-13","2026-04-16","2026-04-20","2026-04-23","2026-04-30","2026-05-08","2026-05-13","2026-05-14","2026-05-18","2026-05-28","2026-05-29","2026-06-04","2026-06-07","2026-06-17","2026-06-18","2026-06-24","2026-06-25","2026-07-02","2026-07-05","2026-07-12","2026-08-23","2026-08-30","2026-08-31","2026-09-07","2026-09-13","2026-09-17","2026-10-25","2026-10-30","2026-11-01","2026-11-11","2026-11-13","2026-11-15","2026-11-16","2026-11-20","2026-11-29","2026-12-04","2026-12-06","2026-12-10","2026-12-13","2026-12-14"];
let calYear, calMonth;

function renderCalendar(year, month) {
  const calEl = document.getElementById('calendarGrid');
  const calTitle = document.getElementById('calendarTitle');
  if (!calEl) return;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  if (calTitle) calTitle.textContent = monthNames[month] + ' ' + year;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  let html = dayNames.map(d => '<div class="cal-day-name">'+d+'</div>').join('');
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = year+'-'+String(month+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isToday = d===today.getDate() && month===today.getMonth() && year===today.getFullYear();
    const isPast = new Date(year,month,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
    const isMuhurat = muhuratDates.includes(dateStr);
    let cls = 'cal-day'+(isPast?' past':isMuhurat?' available':' available')+(isToday?' today':'');
    html += '<div class="'+cls+'" data-date="'+dateStr+'">'+d+'</div>';
  }
  calEl.innerHTML = html;
  calEl.querySelectorAll('.cal-day.available').forEach(day => {
    day.style.cursor = 'pointer';
    day.addEventListener('click', () => { window.location.href = 'booking.html?date='+day.dataset.date; });
  });
}

function initCalendar() {
  const calEl = document.getElementById('calendarGrid');
  if (!calEl) return;
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar(calYear, calMonth);
  document.getElementById('calPrev')?.addEventListener('click', () => {
    calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar(calYear, calMonth);
  });
  document.getElementById('calNext')?.addEventListener('click', () => {
    calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar(calYear, calMonth);
  });
}

/* === INIT ALL === */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileNav();
  initNavbarScroll();
  initScrollReveal();
  initCounters();
  initPopup();
  initFaq();
  initSmoothScroll();
  initImageFallbacks();
  initCalendar();
  loadHomeEvents();
  loadHomeTestimonials();
  loadHomeBlog();
});
