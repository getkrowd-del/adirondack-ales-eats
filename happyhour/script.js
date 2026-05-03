let allHH = [];
  const todayDayNum = new Date().getDay() + 1; // 1=Sun, 2=Mon ... 7=Sat

  // ===== HAPPY HOUR DEAL PARSER =====
  // Function: parseDeals()
  // Purpose: Convert API subtitle line breaks into a clean array of deal strings
  // Triggers: Called by renderCards() for each happy hour item
  function parseDeals(subtitle) {
    if (!subtitle) return [];
    return subtitle.split('\n').map(s => s.replace('\r','').trim()).filter(Boolean);
  }

  // ===== HAPPY HOUR CARD RENDERER =====
  // Function: renderCards()
  // Purpose: Build responsive happy hour cards from API data and display them
  // Triggers: Initial API load and day filter button clicks
  function renderCards(items) {
    const grid = document.getElementById('hhGrid');
    if (!items.length) { grid.innerHTML = '<p style="color:var(--text);padding:20px">No happy hour for this day — check back soon!</p>'; return; }
    grid.innerHTML = items.map(h => {
      const isToday = h.day_number === todayDayNum;
      const deals = parseDeals(h.subtitle);
      const hasImg = h.image && h.image.trim();
      const imgHtml = hasImg
        ? `<img class="hh-card-img" src="${h.image}" alt="${h.title}" onerror="this.parentElement.innerHTML='<div class=hh-card-img-placeholder>🍺</div>'">`
        : `<div class="hh-card-img-placeholder">🍺</div>`;
      return `
        <div class="hh-card${isToday ? ' today' : ''}">
          ${isToday ? '<div class="today-badge">🎉 Happening Today!</div>' : ''}
          ${imgHtml}
          <div class="hh-card-header">
            <span class="hh-card-day">${h.day_name}</span>
            <span class="hh-card-time">${h.time_start} – ${h.time_end}</span>
          </div>
          <div class="hh-card-body">
            <div class="hh-card-title">${h.title}</div>
            <div class="hh-deals">
              ${deals.map(d => `<div class="hh-deal">${d}</div>`).join('')}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // ===== HAPPY HOUR API LOADER =====
  // Function: loadHappyHour()
  // Purpose: Fetch active happy hour data, sort it, prioritize today, and render cards
  // Triggers: Runs once on page load
  async function loadHappyHour() {
    try {
      const res = await fetch('https://api.getkrowd.com/v3/happyHour/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31');
      const data = await res.json();
      allHH = Array.isArray(data.happy_hours) ? data.happy_hours.filter(h => h.is_active) : [];
      allHH.sort((a, b) => a.day_number - b.day_number);
      const today = allHH.filter(h => h.day_number === todayDayNum);
      const rest = allHH.filter(h => h.day_number !== todayDayNum);
      allHH = [...today, ...rest];
      renderCards(allHH);
    } catch(e) {
      document.getElementById('hhGrid').innerHTML = '<p style="color:var(--text);padding:20px">Could not load happy hour. Call <a href="tel:+13155993366" style="color:var(--amber)">(315) 599-3366</a>!</p>';
    }
  }

  // ===== DAY FILTER BUTTON HANDLER =====
  // Function: anonymous click handler
  // Purpose: Filter happy hour cards by selected day and update active button styling
  // Triggers: Click on any .day-btn element
  document.querySelectorAll('.day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const day = parseInt(btn.dataset.day);
      renderCards(day === 0 ? allHH : allHH.filter(h => h.day_number === day));
    });
  });

  loadHappyHour();

  // ===== CHAT WIDGET INITIALIZATION =====
  // Purpose: Cache chat DOM elements and track open/loaded states for the embedded assistant
  const chatBtn = document.getElementById('custom-chat-btn'), chatPanel = document.getElementById('chat-panel'), chatIframe = document.getElementById('chat-iframe'), teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;

  // ===== CHAT TOGGLE HANDLER =====
  // Function: anonymous click handler
  // Purpose: Open or close chat panel and lazily load iframe on first open
  // Triggers: Click on floating chat button
  chatBtn.addEventListener('click', () => { chatOpen = !chatOpen; if (chatOpen) { if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; } chatPanel.classList.add('open'); teaser.classList.remove('visible'); teaser.classList.add('hidden'); } else chatPanel.classList.remove('open'); });

  // ===== OUTSIDE CLICK CHAT CLOSER =====
  // Function: anonymous document click handler
  // Purpose: Close chat panel when users click outside the widget
  // Triggers: Click anywhere in the document
  document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });

  // ===== CHAT TEASER DELAY =====
  // Function: setTimeout callback
  // Purpose: Display teaser bubble after a short delay
  // Triggers: Two seconds after page load
  setTimeout(() => teaser.classList.add('visible'), 2000);

  // ===== CHAT TEASER CLOSE HANDLER =====
  // Function: anonymous click handler
  // Purpose: Hide teaser bubble when close button is clicked
  // Triggers: Click on teaser close button
  document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });