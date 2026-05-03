async function loadEvents() {
  try {
    const res = await fetch('https://api.getkrowd.com/v3/events/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31&days=60');
    const data = await res.json();
    const events = Array.isArray(data.events) ? data.events : [];
    const container = document.getElementById('eventsContainer');
    if (!events.length) { container.innerHTML = '<p style="color:var(--text);grid-column:1/-1">No upcoming events — check back soon!</p>'; return; }
    container.innerHTML = events.map(ev => {
      const hasPhoto = ev.photo && ev.photo.trim();
      const photoHtml = hasPhoto ? `<img class="event-card-img" src="${ev.photo}" alt="${ev.title}" onerror="this.style.display='none'">` : `<div class="event-card-img-placeholder">🎸</div>`;
      const datebar = ev.recurring
        ? `<div class="event-recurring-bar"><span>🔁</span><span class="recur-label">${ev.date_label}</span></div>`
        : `<div class="event-date-bar"><div class="day">${ev.day_of_month}</div><div class="month-time"><span class="month">${ev.month_short} ${ev.sdate ? ev.sdate.substring(0,4) : ''}</span><span class="time">${ev.time_start}${ev.time_end ? ' – ' + ev.time_end : ''}</span></div></div>`;
      const timeHtml = ev.recurring ? `<div class="event-time">⏰ ${ev.time_start}${ev.time_end ? ' – ' + ev.time_end : ''}</div>` : '';
      return `<div class="event-card">${photoHtml}${datebar}<div class="event-body"><div class="event-tag">🎸 Live Music</div><div class="event-title">${ev.title}</div><div class="event-desc">${ev.short_desc || ''}</div>${timeHtml}</div></div>`;
    }).join('');
  } catch(e) { document.getElementById('eventsContainer').innerHTML = '<p style="color:var(--text)">Could not load events. Call <a href="tel:+13155993366" style="color:var(--amber)">(315) 599-3366</a>!</p>'; }
}
loadEvents();
const chatBtn = document.getElementById('custom-chat-btn'), chatPanel = document.getElementById('chat-panel'), chatIframe = document.getElementById('chat-iframe'), teaser = document.getElementById('chat-teaser');
let chatLoaded = false, chatOpen = false;
chatBtn.addEventListener('click', () => { chatOpen = !chatOpen; if (chatOpen) { if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; } chatPanel.classList.add('open'); teaser.classList.remove('visible'); teaser.classList.add('hidden'); } else chatPanel.classList.remove('open'); });
document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });
setTimeout(() => teaser.classList.add('visible'), 2000);
document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });