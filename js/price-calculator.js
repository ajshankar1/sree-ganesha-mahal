/* ============================================================
   SREE GANESHA MAHAL — Live Price Calculator
   HOW TO EDIT PRICING: Update /data/pricing.json
   ============================================================ */

async function initPriceCalculator() {
  const calcWrap = document.querySelector('.calculator-wrap');
  if (!calcWrap) return;

  let pricingData;
  try {
    const res = await fetch('data/pricing.json');
    pricingData = await res.json();
  } catch {
    // Fallback pricing
    pricingData = {
      calculator: {
        tiers: [
          { max_guests: 200, price: 40000 },
          { max_guests: 400, price: 65000 },
          { max_guests: 700, price: 90000 },
          { max_guests: 9999, price: 125000 }
        ],
        addons: [
          { id: 'decoration', name: 'Premium Decoration', price: 20000, unit: 'flat' },
          { id: 'dining', name: 'Dining Hall', price: 10000, unit: 'flat' },
          { id: 'rooms', name: 'Guest Rooms', price: 2000, unit: 'per room' },
          { id: 'catering', name: 'Catering', price: 350, unit: 'per plate' }
        ]
      }
    };
  }

  const { tiers, addons } = pricingData.calculator;

  function getBasePrice(guests) {
    for (const tier of tiers) {
      if (guests <= tier.max_guests) return tier.price;
    }
    return tiers[tiers.length - 1].price;
  }

  function calculate() {
    const guests = parseInt(document.getElementById('calc-guests')?.value || 0);
    const rooms = parseInt(document.getElementById('calc-rooms')?.value || 0);
    const plates = parseInt(document.getElementById('calc-plates')?.value || 0);

    const basePrice = getBasePrice(guests);
    let total = basePrice;
    const breakdown = [{ label: 'Hall Rental', amount: basePrice }];

    // Checkboxes
    document.querySelectorAll('.addon-check').forEach(cb => {
      if (cb.checked) {
        const addon = addons.find(a => a.id === cb.value);
        if (!addon) return;
        let amount = 0;
        if (addon.unit === 'flat') {
          amount = addon.price;
        } else if (addon.unit === 'per room') {
          amount = addon.price * rooms;
        } else if (addon.unit === 'per plate') {
          amount = addon.price * guests;
        }
        if (amount > 0) {
          total += amount;
          breakdown.push({ label: addon.name, amount });
        }
      }
    });

    // Update display
    const totalEl = document.getElementById('calc-total');
    if (totalEl) {
      totalEl.textContent = '₹' + total.toLocaleString('en-IN');
    }

    const breakdownEl = document.getElementById('calc-breakdown');
    if (breakdownEl) {
      breakdownEl.innerHTML = breakdown.map(b =>
        `<div class="breakdown-item">
          <span>${b.label}</span>
          <span>₹${b.amount.toLocaleString('en-IN')}</span>
        </div>`
      ).join('') +
      `<div class="breakdown-item total">
        <span>Estimated Total</span>
        <span>₹${total.toLocaleString('en-IN')}</span>
      </div>`;
    }

    // Update tier label
    const tierLabel = document.getElementById('calc-tier-label');
    if (tierLabel) {
      const tier = tiers.find(t => guests <= t.max_guests) || tiers[tiers.length-1];
      tierLabel.textContent = tier.label || '';
    }
  }

  // Bind events
  document.querySelectorAll('.calc-input').forEach(el => {
    el.addEventListener('input', calculate);
    el.addEventListener('change', calculate);
  });
  document.querySelectorAll('.addon-check').forEach(cb => {
    cb.addEventListener('change', () => {
      // Show/hide rooms & plates inputs
      const roomsWrap = document.getElementById('rooms-input-wrap');
      const platesWrap = document.getElementById('plates-input-wrap');
      if (roomsWrap) {
        const roomsCb = document.querySelector('.addon-check[value="rooms"]');
        roomsWrap.style.display = roomsCb?.checked ? 'block' : 'none';
      }
      if (platesWrap) {
        const cateringCb = document.querySelector('.addon-check[value="catering"]');
        platesWrap.style.display = cateringCb?.checked ? 'block' : 'none';
      }
      calculate();
    });
  });

  // Initial calculation
  calculate();
}

document.addEventListener('DOMContentLoaded', initPriceCalculator);
