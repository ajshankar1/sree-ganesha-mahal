/* ============================================================
   SREE GANESHA MAHAL — Multi-Step Booking Form
   ============================================================ */

const eventCategories = {
  'Marriage Functions': ['Wedding', 'Reception', 'Engagement', 'Mehendi', 'Sangeet', 'Haldi'],
  'Religious Functions': ['Seemantham', 'Naming Ceremony', 'Upanayanam', 'Ayush Homam', 'Satyanarayana Pooja'],
  'Family Celebrations': ['Birthday Party', 'Baby Shower', 'Anniversary'],
  'House Functions': ['Housewarming', 'Gruhapravesam'],
  'Corporate Events': ['Conference', 'Seminar', 'Product Launch', 'Business Meeting'],
  'Social Events': ['Cultural Programs', 'Community Gathering', 'Exhibition']
};

const categoryIcons = {
  'Marriage Functions': 'fa-heart',
  'Religious Functions': 'fa-om',
  'Family Celebrations': 'fa-birthday-cake',
  'House Functions': 'fa-home',
  'Corporate Events': 'fa-briefcase',
  'Social Events': 'fa-users'
};

let formData = {
  category: '',
  event_type: '',
  event_date: '',
  guests: 200,
  addons: [],
  rooms: 1,
  name: '',
  phone: '',
  email: '',
  message: ''
};

let currentStep = 1;
const totalSteps = 5;

function initBookingForm() {
  const formWrap = document.getElementById('bookingFormWrap');
  if (!formWrap) return;

  // Step 1: Event Categories
  const catContainer = document.getElementById('categoryOptions');
  if (catContainer) {
    catContainer.innerHTML = Object.keys(eventCategories).map(cat => `
      <div class="event-type-option" data-category="${cat}">
        <i class="fas ${categoryIcons[cat] || 'fa-calendar'}" style="font-size:1.5rem;color:var(--crimson);display:block;margin-bottom:6px;"></i>
        <span style="font-family:var(--font-ui);font-size:0.82rem;color:var(--text-mid);">${cat}</span>
      </div>
    `).join('');

    catContainer.querySelectorAll('.event-type-option').forEach(opt => {
      opt.addEventListener('click', () => {
        catContainer.querySelectorAll('.event-type-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        formData.category = opt.dataset.category;
        clearError('step1-error');
      });
    });
  }

  // Check URL params
  const params = new URLSearchParams(window.location.search);
  if (params.get('date')) {
    const dateInput = document.getElementById('event-date');
    if (dateInput) dateInput.value = params.get('date');
  }

  renderStep(1);
}

function renderStep(step) {
  currentStep = step;
  document.querySelectorAll('.form-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === step);
  });

  // Update progress
  document.querySelectorAll('.step-item').forEach((item, i) => {
    item.classList.remove('active', 'completed');
    if (i + 1 === step) item.classList.add('active');
    if (i + 1 < step) item.classList.add('completed');
  });

  // Step-specific logic
  if (step === 2) renderEventTypes();
  if (step === 4) renderAddons();
}

function renderEventTypes() {
  const container = document.getElementById('eventTypeOptions');
  if (!container || !formData.category) return;

  const types = eventCategories[formData.category] || [];
  container.innerHTML = types.map(type => `
    <div class="event-type-option" data-type="${type}">
      <i class="fas fa-check-circle" style="font-size:1.2rem;color:var(--crimson);display:block;margin-bottom:6px;"></i>
      <span style="font-family:var(--font-ui);font-size:0.82rem;color:var(--text-mid);">${type}</span>
    </div>
  `).join('');

  container.querySelectorAll('.event-type-option').forEach(opt => {
    if (opt.dataset.type === formData.event_type) opt.classList.add('selected');
    opt.addEventListener('click', () => {
      container.querySelectorAll('.event-type-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      formData.event_type = opt.dataset.type;
      clearError('step2-error');
    });
  });
}

function renderAddons() {
  const container = document.getElementById('addonsOptions');
  if (!container) return;
  container.innerHTML = `
    <div class="addons-grid">
      <label class="addon-item">
        <input type="checkbox" value="decoration" class="addon-check" ${formData.addons.includes('decoration')?'checked':''}>
        <span style="font-family:var(--font-ui);font-size:0.88rem;color:var(--text-mid);">
          <strong>Premium Decoration</strong>
        </span>
        <span class="addon-price">+₹20,000</span>
      </label>
      <label class="addon-item">
        <input type="checkbox" value="dining" class="addon-check" ${formData.addons.includes('dining')?'checked':''}>
        <span style="font-family:var(--font-ui);font-size:0.88rem;color:var(--text-mid);">
          <strong>Dining Hall</strong>
        </span>
        <span class="addon-price">+₹10,000</span>
      </label>
      <label class="addon-item">
        <input type="checkbox" value="rooms" class="addon-check" ${formData.addons.includes('rooms')?'checked':''}>
        <span style="font-family:var(--font-ui);font-size:0.88rem;color:var(--text-mid);">
          <strong>Guest Rooms</strong>
        </span>
        <span class="addon-price">₹2,000/room</span>
      </label>
      <label class="addon-item">
        <input type="checkbox" value="catering" class="addon-check" ${formData.addons.includes('catering')?'checked':''}>
        <span style="font-family:var(--font-ui);font-size:0.88rem;color:var(--text-mid);">
          <strong>Catering</strong>
        </span>
        <span class="addon-price">₹350/plate</span>
      </label>
    </div>
    <div id="rooms-addon-wrap" style="display:${formData.addons.includes('rooms')?'block':'none'};margin-top:16px;">
      <label class="form-label" style="font-family:var(--font-ui);font-size:0.78rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-mid);">Number of Rooms</label>
      <input type="number" id="rooms-count" min="1" max="5" value="${formData.rooms}" style="width:120px;padding:10px;border:1px solid var(--ivory-deeper);border-radius:4px;margin-top:8px;">
    </div>
  `;

  container.querySelectorAll('.addon-check').forEach(cb => {
    cb.addEventListener('change', () => {
      formData.addons = Array.from(container.querySelectorAll('.addon-check:checked')).map(c => c.value);
      const roomsWrap = document.getElementById('rooms-addon-wrap');
      if (roomsWrap) roomsWrap.style.display = formData.addons.includes('rooms') ? 'block' : 'none';
    });
  });
}

function nextStep() {
  if (!validateStep(currentStep)) return;
  saveStepData(currentStep);
  if (currentStep < totalSteps) renderStep(currentStep + 1);
}

function prevStep() {
  if (currentStep > 1) renderStep(currentStep - 1);
}

function saveStepData(step) {
  if (step === 3) {
    formData.event_date = document.getElementById('event-date')?.value || '';
  }
  if (step === 4) {
    formData.guests = parseInt(document.getElementById('guest-count')?.value || 200);
    formData.rooms = parseInt(document.getElementById('rooms-count')?.value || 1);
  }
  if (step === 5) {
    formData.name = document.getElementById('contact-name')?.value || '';
    formData.phone = document.getElementById('contact-phone')?.value || '';
    formData.email = document.getElementById('contact-email')?.value || '';
    formData.message = document.getElementById('contact-message')?.value || '';
  }
}

function validateStep(step) {
  if (step === 1) {
    if (!formData.category) {
      showError('step1-error', 'Please select an event category.');
      return false;
    }
  }
  if (step === 2) {
    if (!formData.event_type) {
      showError('step2-error', 'Please select an event type.');
      return false;
    }
  }
  if (step === 3) {
    const dateVal = document.getElementById('event-date')?.value;
    if (!dateVal) {
      showError('step3-error', 'Please select an event date.');
      return false;
    }
    formData.event_date = dateVal;
  }
  if (step === 4) {
    const guests = parseInt(document.getElementById('guest-count')?.value);
    if (!guests || guests < 1) {
      showError('step4-error', 'Please enter expected guest count.');
      return false;
    }
  }
  if (step === 5) {
    const name = document.getElementById('contact-name')?.value;
    const phone = document.getElementById('contact-phone')?.value;
    if (!name) { showError('step5-error', 'Please enter your name.'); return false; }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s/g,''))) {
      showError('step5-error', 'Please enter a valid 10-digit phone number.');
      return false;
    }
  }
  return true;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

async function submitBooking() {
  saveStepData(5);
  if (!validateStep(5)) return;

  const booking = {
    ...formData,
    id: 'BK' + Date.now(),
    timestamp: new Date().toISOString(),
    status: 'Pending'
  };

  // Save to localStorage
  try {
    const bookings = JSON.parse(localStorage.getItem('sgm_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('sgm_bookings', JSON.stringify(bookings));
  } catch (e) {}

  // Show success
  document.getElementById('bookingFormWrap').style.display = 'none';
  const successEl = document.getElementById('bookingSuccess');
  if (successEl) {
    successEl.style.display = 'block';
    document.getElementById('booking-ref')?.setAttribute('textContent', booking.id);
    successEl.querySelector('.booking-id')?.textContent && (successEl.querySelector('.booking-id').textContent = booking.id);
  }

  // WhatsApp follow-up
  const wa = `https://wa.me/918870007991?text=${encodeURIComponent(
    `Hello, I have submitted a booking enquiry for Sree Ganesha Mahal.\n\nBooking ID: ${booking.id}\nEvent: ${booking.event_type}\nDate: ${booking.event_date}\nGuests: ${booking.guests}\nName: ${booking.name}\nPhone: ${booking.phone}`
  )}`;
  document.getElementById('wa-followup')?.setAttribute('href', wa);

  if (window.showToast) window.showToast('Booking enquiry submitted! We will contact you soon.', 'success');
}

document.addEventListener('DOMContentLoaded', initBookingForm);

// Expose for inline onclick
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitBooking = submitBooking;
