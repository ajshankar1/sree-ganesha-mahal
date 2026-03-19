/* ============================================================
   SREE GANESHA MAHAL — WhatsApp Integration
   HOW TO CHANGE PHONE: Update the phoneNumber variable below
   ============================================================ */

// HOW TO EDIT: Change this to your WhatsApp number (country code + number, no +)
const WHATSAPP_NUMBER = '918870007991';
const DEFAULT_MESSAGE = 'Hello, I would like to enquire about booking Sree Ganesha Mahal.';

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_MESSAGE)}`;
}

function initWhatsApp() {
  // Update all whatsapp links dynamically
  document.querySelectorAll('[data-wa-btn]').forEach(btn => {
    const customMsg = btn.dataset.waMsg || DEFAULT_MESSAGE;
    btn.href = buildWhatsAppUrl(customMsg);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
  });

  // Main float button
  const floatBtn = document.getElementById('waFloat');
  if (floatBtn) {
    floatBtn.href = buildWhatsAppUrl(DEFAULT_MESSAGE);
    floatBtn.target = '_blank';
    floatBtn.rel = 'noopener noreferrer';
  }
}

document.addEventListener('DOMContentLoaded', initWhatsApp);
