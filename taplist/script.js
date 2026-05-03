async function loadBeers() {
  try {
    const res = await fetch('https://api.getkrowd.com/v3/beer/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31');
    const data = await res.json();
    const beers = Array.isArray(data.beers) ? data.beers.filter(b => !b.is_archived) : [];
    const grid = document.getElementById('beerGrid');
    if (!beers.length) { grid.innerHTML = '<p style="color:var(--text)">Check back soon!</p>'; return; }
    grid.innerHTML = beers.map(b => `
      <div class="tap-item">
        ${b.image ? `<img class="tap-item-img" src="${b.image}" alt="${b.title}" onerror="this.style.display='none'">` : ''}
        <div class="tap-item-body">
          <div class="tap-header">
            <div><div class="tap-name">${b.title}</div><div class="tap-style">${b.beer_type || 'Craft Beer'}</div></div>
            ${b.abv ? `<span class="tap-abv">${b.abv} ABV</span>` : ''}
          </div>
          <div class="tap-desc">${b.description || ''}</div>
          <div class="tap-footer">
            <span class="tap-price">${b.price ? '$' + b.price : 'Ask your server'}</span>
            <span class="tap-status"><span class="tap-dot"></span> On Tap</span>
          </div>
        </div>
      </div>`).join('');
  } catch(e) { document.getElementById('beerGrid').innerHTML = '<p style="color:var(--text)">Tap list unavailable — ask your server!</p>'; }
}
loadBeers();

// Chat
const chatBtn = document.getElementById('custom-chat-btn'), chatPanel = document.getElementById('chat-panel'), chatIframe = document.getElementById('chat-iframe'), teaser = document.getElementById('chat-teaser');
let chatLoaded = false, chatOpen = false;
chatBtn.addEventListener('click', () => { chatOpen = !chatOpen; if (chatOpen) { if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; } chatPanel.classList.add('open'); teaser.classList.remove('visible'); teaser.classList.add('hidden'); } else chatPanel.classList.remove('open'); });
document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });
setTimeout(() => teaser.classList.add('visible'), 2000);
document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });