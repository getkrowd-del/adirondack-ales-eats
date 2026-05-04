let allSpecials = [];

  function renderSpecials(specials) {
    const grid = document.getElementById('specialsGrid');
    if (!specials.length) { grid.innerHTML = '<p style="color:var(--text);grid-column:1/-1;padding:20px">No specials for this day — check back soon!</p>'; return; }
    grid.innerHTML = specials.map(s => {
      const hasImg = s.image && s.image.trim();
      const imgHtml = hasImg ? `<img class="special-card-img" src="${s.image}" alt="${s.title}" onerror="this.style.display='none'">` : `<div class="special-card-img-placeholder">🏷️</div>`;
      const recurBadge = s.is_recurring ? `<div class="recurring-badge">🔁 Every ${s.day_name}</div>` : '';
      return `
        <div class="special-card">
          ${imgHtml}
          <div class="special-day-bar">
            <span class="special-day-label">${s.day_name || 'Special'}</span>
            ${s.price ? `<span class="special-price-badge">${s.price}</span>` : ''}
          </div>
          <div class="special-body">
            <div class="special-title">${s.title}</div>
            <div class="special-desc">${s.description || ''}</div>
            ${recurBadge}
          </div>
        </div>`;
    }).join('');
  }

  async function loadSpecials() {
    try {
      const res = await fetch('https://api.getkrowd.com/v3/specials/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31');
      const data = await res.json();
      allSpecials = Array.isArray(data.specials) ? data.specials : [];
      renderSpecials(allSpecials);
    } catch(e) {
      document.getElementById('specialsGrid').innerHTML = '<p style="color:var(--text);grid-column:1/-1">Could not load specials. Call <a href="tel:+13155993366" style="color:var(--amber)">(315) 599-3366</a>!</p>';
    }
  }

  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const day = parseInt(tab.dataset.day);
      renderSpecials(day === 0 ? allSpecials : allSpecials.filter(s => s.day_number === day));
    });
  });

  loadSpecials();

  // Chat
  const chatBtn = document.getElementById('custom-chat-btn'), 
        chatPanel = document.getElementById('chat-panel'), 
        chatIframe = document.getElementById('chat-iframe'), 
        teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;

  chatBtn.addEventListener('click', () => { 
    chatOpen = !chatOpen; 
    if (chatOpen) { 
      if (!chatLoaded) { 
        chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; 
        chatLoaded = true; 
      } 
      chatPanel.classList.add('open'); 
      teaser.classList.remove('visible'); 
      teaser.classList.add('hidden'); 
    } else {
      chatPanel.classList.remove('open'); 
    }
  });

  document.addEventListener('click', e => { 
    if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { 
      chatPanel.classList.remove('open'); 
      chatOpen = false; 
    } 
  });

  setTimeout(() => teaser.classList.add('visible'), 2000);
  
  document.getElementById('teaser-close-btn').addEventListener('click', () => { 
    teaser.classList.remove('visible'); 
    teaser.classList.add('hidden'); 
  });