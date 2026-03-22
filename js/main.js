/* ============================================================
   SREE GANESHA MAHAL — Main JavaScript
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
  const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = prefix + value.toLocaleString('en-IN') + suffix;
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
      const data = {
        name: popupForm.querySelector('[name="name"]').value,
        phone: popupForm.querySelector('[name="phone"]').value,
        event_date: popupForm.querySelector('[name="event_date"]').value,
        source: 'Popup',
        timestamp: new Date().toISOString()
      };
      saveLead(data);
      overlay.classList.remove('show');
      sessionStorage.setItem('popup-dismissed', 'true');
      showToast('Thank you! We will contact you soon.', 'success');
    });
  }
}

/* === SAVE LEAD === */
function saveLead(data) {
  try {
    const leads = JSON.parse(localStorage.getItem('sgm_leads') || '[]');
    leads.push(data);
    localStorage.setItem('sgm_leads', JSON.stringify(leads));
  } catch (e) {
    console.warn('Could not save lead:', e);
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
      this.style.opacity = '0.6';
      this.removeAttribute('src');
    });
  });
}

/* === TESTIMONIALS SLIDER — FIXED === */
function initTestimonialsSlider() {
  const track = document.querySelector('.testimonials-track');
  const dots = document.querySelectorAll('.t-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  if (total <= 3) return;

  function getPerView() {
    return window.innerWidth < 768 ? 1 : 3;
  }

  function goTo(index) {
    current = (index + total) % total;
    const perView = getPerView();
    // Calculate card width including gap as percentage of track
    const cardWidthPercent = 100 / perView;
    const gapPercent = (28 / track.offsetWidth) * 100;
    const offset = current * (cardWidthPercent + gapPercent);
    track.style.transform = `translateX(-${offset}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Re-calculate on resize
  window.addEventListener('resize', () => goTo(current));

  let timer = setInterval(() => goTo(current + 1), 4500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 4500);
  });
}

/* === LOAD EVENTS ON HOME PAGE === */
async function loadHomeEvents() {
  const container = document.getElementById('homeEventsList');
  if (!container) return;
  try {
    const res = await fetch('data/events.json');
    const events = await res.json();
    const shown = events.slice(0, 6);
    container.innerHTML = shown.map(ev => `
      <div class="event-card reveal">
        <div class="event-card-image">
          <img src="${ev.image}" alt="${ev.event_name}" loading="lazy">
          <span class="event-category">${ev.category}</span>
        </div>
        <div class="event-card-body">
          <h3>${ev.event_name}</h3>
          <p>${ev.description.substring(0, 90)}...</p>
          <div class="event-price">
            ₹${ev.base_price.toLocaleString('en-IN')}
            <span>/ starting from</span>
          </div>
          <a href="booking.html?event=${ev.id}" class="btn btn-crimson">Book This Event</a>
        </div>
      </div>
    `).join('');
    initScrollReveal();
  } catch (e) {
    console.warn('Could not load events:', e);
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
  } catch (e) {
    console.warn('Could not load testimonials:', e);
  }
}

/* === LOAD BLOG POSTS === */
async function loadHomeBlog() {
  const container = document.getElementById('homeBlogList');
  if (!container) return;
  try {
    const res = await fetch('data/blog.json');
    const posts = await res.json();
    const shown = posts.slice(0, 3);
    container.innerHTML = shown.map(post => `
      <div class="blog-card reveal">
        <div class="blog-card-image">
          <img src="${post.image}" alt="${post.title}" loading="lazy">
          <span class="blog-category-badge">${post.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
            <span><i class="fas fa-user"></i> ${post.author}</span>
          </div>
          <h3>${post.title}</h3>
          <p>${post.short_description}</p>
          <a href="blog-post.html?slug=${post.slug}" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    `).join('');
    initScrollReveal();
  } catch (e) {
    console.warn('Could not load blog:', e);
  }
}

/* === BOOKING FORM — URL PARAM PRE-FILL === */
function prefillFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const event = params.get('event');
  if (event) {
    const sel = document.querySelector(`[data-event-id="${event}"]`);
    if (sel) sel.classList.add('selected');
  }
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
  loadHomeEvents();
  loadHomeTestimonials();
  loadHomeBlog();
  prefillFromUrl();
});
