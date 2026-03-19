/* ============================================================
   SREE GANESHA MAHAL — CRM Dashboard
   ============================================================ */

function loadDashboard() {
  const bookings = JSON.parse(localStorage.getItem('sgm_bookings') || '[]');
  const leads = JSON.parse(localStorage.getItem('sgm_leads') || '[]');

  // Summary stats
  document.getElementById('stat-bookings').textContent = bookings.length;
  document.getElementById('stat-leads').textContent = leads.length;
  document.getElementById('stat-pending').textContent = bookings.filter(b => b.status === 'Pending').length;

  // Calculate estimated revenue
  let revenue = 0;
  bookings.forEach(b => {
    const guests = b.guests || 0;
    if (guests <= 200) revenue += 40000;
    else if (guests <= 400) revenue += 65000;
    else if (guests <= 700) revenue += 90000;
    else revenue += 125000;
  });
  document.getElementById('stat-revenue').textContent = '₹' + revenue.toLocaleString('en-IN');

  renderBookingsTable(bookings);
  renderLeadsTable(leads);
}

function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookingsBody');
  if (!tbody) return;
  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:32px;color:#888;">No booking enquiries yet.</td></tr>';
    return;
  }
  tbody.innerHTML = bookings.slice().reverse().map(b => `
    <tr>
      <td>${b.id || '—'}</td>
      <td>${b.name || '—'}</td>
      <td>${b.phone || '—'}</td>
      <td>${b.event_type || '—'}</td>
      <td>${b.event_date ? new Date(b.event_date).toLocaleDateString('en-IN') : '—'}</td>
      <td>${b.guests || '—'}</td>
      <td><span class="status-badge ${(b.status||'').toLowerCase()}">${b.status || 'Pending'}</span></td>
      <td>
        <button onclick="deleteBooking('${b.id}')" class="del-btn" title="Delete">🗑</button>
        <a href="https://wa.me/91${(b.phone||'').replace(/\D/g,'')}?text=${encodeURIComponent('Hello '+b.name+', Thank you for your enquiry at Sree Ganesha Mahal. We would like to follow up on your booking request for '+b.event_type+' on '+b.event_date+'. Please let us know a convenient time to discuss.')}" target="_blank" class="wa-btn" title="WhatsApp">💬</a>
      </td>
    </tr>
  `).join('');
}

function renderLeadsTable(leads) {
  const tbody = document.getElementById('leadsBody');
  if (!tbody) return;
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:32px;color:#888;">No leads captured yet.</td></tr>';
    return;
  }
  tbody.innerHTML = leads.slice().reverse().map((l, i) => `
    <tr>
      <td>${l.name || '—'}</td>
      <td>${l.phone || '—'}</td>
      <td>${l.event_date || '—'}</td>
      <td>${l.source || 'Website'}</td>
      <td>${l.timestamp ? new Date(l.timestamp).toLocaleDateString('en-IN') : '—'}</td>
    </tr>
  `).join('');
}

function deleteBooking(id) {
  if (!confirm('Delete this booking enquiry?')) return;
  let bookings = JSON.parse(localStorage.getItem('sgm_bookings') || '[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('sgm_bookings', JSON.stringify(bookings));
  loadDashboard();
}

function clearAll(type) {
  if (!confirm(`Clear all ${type}? This cannot be undone.`)) return;
  localStorage.removeItem(`sgm_${type}`);
  loadDashboard();
}

function exportCSV(type) {
  const data = JSON.parse(localStorage.getItem(`sgm_${type}`) || '[]');
  if (data.length === 0) { alert('No data to export.'); return; }

  const keys = Object.keys(data[0]);
  const csvRows = [
    keys.join(','),
    ...data.map(row => keys.map(k => `"${(row[k] || '').toString().replace(/"/g, '""')}"`).join(','))
  ];
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sgm-${type}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function filterBookings() {
  const search = document.getElementById('bookingSearch')?.value.toLowerCase() || '';
  let bookings = JSON.parse(localStorage.getItem('sgm_bookings') || '[]');
  if (search) {
    bookings = bookings.filter(b =>
      (b.name||'').toLowerCase().includes(search) ||
      (b.phone||'').includes(search) ||
      (b.event_type||'').toLowerCase().includes(search)
    );
  }
  renderBookingsTable(bookings);
}

document.addEventListener('DOMContentLoaded', loadDashboard);
window.deleteBooking = deleteBooking;
window.clearAll = clearAll;
window.exportCSV = exportCSV;
window.filterBookings = filterBookings;
