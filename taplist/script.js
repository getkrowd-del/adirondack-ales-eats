const BEER_API_URL = 'https://api.getkrowd.com/v3/beer/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31';

    let allBeers = [];
    let currentStyleFilter = '';
    let currentSearchTerm = '';

    document.addEventListener('DOMContentLoaded', () => {
      initializeMobileMenu();
      initializeChatWidget();
      initializeTaplistControls();
      fetchAndRenderTaplist();
    });

    function initializeMobileMenu() {
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      if (!hamburger || !mobileMenu) return;
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }

    function initializeChatWidget() {
      const chatBtn = document.getElementById('custom-chat-btn');
      const chatPanel = document.getElementById('chat-panel');
      const chatIframe = document.getElementById('chat-iframe');
      const teaser = document.getElementById('chat-teaser');
      
      let chatLoaded = false;
      let chatOpen = false;

      chatBtn.addEventListener('click', () => {
        chatOpen = !chatOpen;
        if (chatOpen) {
          if (!chatLoaded) {
            chatIframe.src = 'https://paymegpt.com/agents/46866772/embed';
            chatLoaded = true;
          }
          chatPanel.classList.add('open');
          teaser.classList.add('hidden');
        } else {
          chatPanel.classList.remove('open');
        }
      });
      setTimeout(() => { if (!chatOpen) teaser.classList.add('visible'); }, 2000);
      document.getElementById('teaser-close-btn').addEventListener('click', () => teaser.classList.add('hidden'));
    }

    function initializeTaplistControls() {
      document.getElementById('beer-search').addEventListener('input', e => {
        currentSearchTerm = e.target.value.trim().toLowerCase();
        renderFilteredTaplist();
      });
      document.getElementById('beer-style-filter').addEventListener('change', e => {
        currentStyleFilter = e.target.value;
        renderFilteredTaplist();
      });
      document.getElementById('refresh-taplist').addEventListener('click', fetchAndRenderTaplist);
    }

    async function fetchAndRenderTaplist() {
      const message = document.getElementById('taplist-message');
      const grid = document.getElementById('taplist-grid');
      const btn = document.getElementById('refresh-taplist');
      
      setTaplistMessage('Loading the latest beers from the tap list API…', false);
      grid.innerHTML = '';
      btn.disabled = true;
      btn.textContent = 'Refreshing…';

      try {
        // Simple GET request without custom headers avoids CORS preflight blocking
        const response = await fetch(BEER_API_URL);
        if (!response.ok) throw new Error('API Error');
        
        const payload = await response.json();
        allBeers = normalizeBeerPayload(payload);
        
        updateLastUpdated();
        
        if (!allBeers.length) {
          setTaplistMessage('No beers found on tap right now.', false);
        } else {
          setTaplistMessage('', false);
          populateStyleFilter(allBeers);
        }
        renderFilteredTaplist();
      } catch (error) {
        console.error('Fetch error:', error);
        allBeers = [];
        updateLastUpdated('Error');
        setTaplistMessage('We could not load the live tap list from the beer API. Please refresh, or ask your bartender for the latest pours.', true);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Refresh Tap List';
      }
    }

    // Completely case-insensitive payload parsing for Lucee
    function normalizeBeerPayload(payload) {
      if (Array.isArray(payload)) return payload;
      if (!payload || typeof payload !== 'object') return [];

      const lowerPayload = {};
      for (let key in payload) { lowerPayload[key.toLowerCase()] = payload[key]; }

      if (Array.isArray(lowerPayload.beers)) return lowerPayload.beers;
      if (Array.isArray(lowerPayload.data)) return lowerPayload.data;
      if (Array.isArray(lowerPayload.items)) return lowerPayload.items;

      if (lowerPayload.columns && lowerPayload.data && Array.isArray(lowerPayload.columns) && Array.isArray(lowerPayload.data)) {
        return lowerPayload.data.map(row => {
          let obj = {};
          lowerPayload.columns.forEach((col, i) => obj[col.toLowerCase()] = row[i]);
          return obj;
        });
      }

      for (let key in payload) {
        if (Array.isArray(payload[key]) && payload[key].length && typeof payload[key][0] === 'object') {
          return payload[key];
        }
      }
      return [];
    }

    function renderFilteredTaplist() {
      const grid = document.getElementById('taplist-grid');
      const filtered = allBeers.filter(b => {
        const n = normalizeBeerFields(b);
        const search = `${n.name} ${n.style} ${n.description}`.toLowerCase();
        return (!currentSearchTerm || search.includes(currentSearchTerm)) &&
               (!currentStyleFilter || n.style === currentStyleFilter);
      });

      document.getElementById('beer-count').textContent = filtered.length;
      grid.innerHTML = '';
      
      if (allBeers.length && !filtered.length) {
        setTaplistMessage('No beers match your filter.', false);
        return;
      }
      
      setTaplistMessage('', false);
      grid.innerHTML = filtered.map(b => createBeerCardHTML(normalizeBeerFields(b))).join('');
    }

    // Creates the new Dope Card HTML format
    function createBeerCardHTML(beer) {
      let imageHTML = '';
      if (beer.image) {
        imageHTML = `
          <div class="beer-img-container">
            <img src="${beer.image}" alt="${beer.name}" onerror="this.src='https://brewpub.getkrowd.com/images/close-up-happy-men-with-beer-mugs.jpg'">
            <div class="beer-img-overlay"></div>
            <div class="beer-badge">${beer.badge}</div>
          </div>`;
      }

      let statsHTML = '';
      if (beer.abv) statsHTML += `<div class="stat-pill"><span>ABV:</span> ${beer.abv}</div>`;
      if (beer.ibu && beer.ibu !== '0') statsHTML += `<div class="stat-pill"><span>IBU:</span> ${beer.ibu}</div>`;
      
      let priceHTML = beer.price ? `<div class="beer-price">${beer.price}</div>` : '';

      return `
        <article class="beer-card">
          ${imageHTML}
          <div class="beer-body">
            ${!beer.image ? `<div class="beer-badge" style="position:relative; top:0; right:0; margin-bottom:10px; display:inline-block; align-self:flex-start;">${beer.badge}</div>` : ''}
            <h3 class="beer-title">${beer.name}</h3>
            <div class="beer-style">${beer.style}</div>
            <p class="beer-desc">${beer.description}</p>
            <div class="beer-stats">
              <div class="stat-pills">${statsHTML}</div>
              ${priceHTML}
            </div>
          </div>
        </article>`;
    }

    // Case-insensitive field extraction
    function normalizeBeerFields(beer) {
      const b = {};
      for (let key in beer) { b[key.toLowerCase()] = beer[key]; }

      const name = b.title || b.name || b.beer_name || 'House Brew';
      const style = b.beer_type || b.style || b.category || 'Draft Ale';
      const desc = b.description || b.tasting_notes || 'Ask your bartender for details.';
      const img = b.image || b.image_url || '';
      const abvRaw = b.abv || '';
      const ibuRaw = b.ibu || '';
      const priceRaw = b.price || '';
      
      let abv = abvRaw ? (String(abvRaw).includes('%') ? abvRaw : abvRaw + '%') : '';
      let price = priceRaw ? (String(priceRaw).includes('$') ? priceRaw : '$' + parseFloat(priceRaw).toFixed(2)) : '';
      
      let availability = b.availability || b.status || 'Active';
      if (availability.toLowerCase() === 'active') availability = 'On Tap';
      
      let badge = b.tap_no ? `Tap ${b.tap_no}` : availability;

      return { name, style, description: desc, image: img, abv, ibu: ibuRaw, price, badge };
    }

    function populateStyleFilter(beers) {
      const filter = document.getElementById('beer-style-filter');
      const val = filter.value;
      const styles = [...new Set(beers.map(b => normalizeBeerFields(b).style))].filter(Boolean).sort();
      
      filter.innerHTML = '<option value="">All beer styles</option>' + 
        styles.map(s => `<option value="${s}">${s}</option>`).join('');
      if (styles.includes(val)) filter.value = val;
      else currentStyleFilter = '';
    }

    function setTaplistMessage(txt, err) {
      const m = document.getElementById('taplist-message');
      m.textContent = txt;
      m.className = 'taplist-message' + (err ? ' error' : '');
      m.style.display = txt ? 'block' : 'none';
    }

    function updateLastUpdated(txt) {
      document.getElementById('beer-updated').textContent = txt || new Date().toLocaleString([], {month:'short', day:'numeric', hour:'numeric', minute:'2-digit'});
    }