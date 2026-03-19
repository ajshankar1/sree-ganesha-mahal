let availabilityData = { muhurat: [] };
let calYear, calMonth;
async function loadAvailability() {
  try {
    const res = await fetch('data/availability.json');
    availabilityData = await res.json();
  } catch {
    console.warn('Using empty availability data');
  }
}
function renderCalendar(year, month) {
  const calEl = document.getElementById('calendarGrid');
  const calTitle = document.getElementById('calendarTitle');
  if (!calEl) return;
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  if (calTitle) calTitle.textContent = `${monthNames[month]} ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const isPast = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isMuhurat = availabilityData.muhurat?.includes(dateStr);
    let className = 'cal-day';
    let title = '';
    if (isPast) {
      className += ' past';
    } else if (isMuhurat) {
      className += ' available';
      title = 'Muhurat Date — Available';
    } else {
      className += ' available';
      title = 'Available';
    }
    if (isToday) className += ' today';
    html += `<div class="${className}" title="${title}" data-date="${dateStr}">${d}</div>`;
  }
  calEl.innerHTML = html;
  calEl.querySelectorAll('.cal-day.available').forEach(day => {
    day.style.cursor = 'pointer';
    day.addEventListener('click', () => {
      const date = day.dataset.date;
      const dateInput = document.getElementById("event-date"); if(dateInput){ dateInput.value = date; };
    });
  });
}
function initCalendar() {
  const calEl = document.getElementById('calendarGrid');
  if (!calEl) return;
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  document.getElementById('calPrev')?.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar(calYear, calMonth);
  });
  document.getElementById('calNext')?.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar(calYear, calMonth);
  });
  loadAvailability().then(() => renderCalendar(calYear, calMonth));
}
document.addEventListener('DOMContentLoaded', initCalendar);
```

**Ctrl+S** → Push:
```
cd "C:\Users\Welcome\Desktop\SGM" && git add . && git commit -m "simplify calendar" && git push origin main
