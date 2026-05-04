const API_URL = 'https://api.getkrowd.com/v3/beer/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31';
  let allBeers = [];

  function normalize(beer) {
    const b = {};
    Object.keys(beer).forEach(k => b[k.toLowerCase()] = beer[k]);
    return {
      title: b.title || 'House Brew',
      style: b.beer_type || b.category_name || 'Draft Ale',
      description: b.description || 'Ask your bartender for tasting notes on this pour.',
      image: b.image || 'https://brewpub.getkrowd.com/images/adkalelogo.png',
      abv: b.abv ? (b.abv.toString().includes('%') ? b.abv : `${b.abv}%`) : null,
      ibu: b.ibu && b.ibu !== "0" ? b.ibu : null,
      price: b.price && b.price !== "" ? `$${b.price}` : null,
      status: b.status || b.availability || 'On Tap'
    };
  }

  function render(beers) {
    const grid = document.getElementById('beerGrid');
    if (!beers.length) { grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:60px;opacity:0.6;">No brews found matching that search.</p>'; return; }
    
    grid.innerHTML = beers.map(b => `
      <div class="beer-card">
        <div class="beer-img-container">
          <div class="beer-badge">${b.status}</div>
          <img class="beer-img" src="${b.image}" alt="${b.title}" onerror="this.src='https://brewpub.getkrowd.com/images/adkalelogo.png'">
        </div>
        <div class="beer-body">
          <div class="beer-title">${b.title}</div>
          <div class="beer-style">${b.style}</div>
          <div class="beer-desc">${b.description}</div>
          <div class="beer-footer">
            <div class="beer-stats">
              ${b.abv ? `<span class="stat-tag">ABV ${b.abv}</span>` : ''}
              ${b.ibu ? `<span class="stat-tag">IBU ${b.ibu}</span>` : ''}
            </div>
            ${b.price ? `<div class="beer-price">${b.price}</div>` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  async function load() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const raw = data.beers || data.BEERS || (Array.isArray(data) ? data : []);
      allBeers = raw.map(normalize);
      
      const styles = [...new Set(allBeers.map(b => b.style))].sort();
      const filter = document.getElementById('styleFilter');
      styles.forEach(s => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = s;
        filter.appendChild(opt);
      });

      render(allBeers);
    } catch (e) {
      document.getElementById('beerGrid').innerHTML = '<p style="grid-column:1/-1;text-align:center">Failed to load tap list. Please refresh the page.</p>';
    }
  }

  function handleFilters() {
    const search = document.getElementById('beerSearch').value.toLowerCase();
    const style = document.getElementById('styleFilter').value;
    
    const filtered = allBeers.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(search) || b.description.toLowerCase().includes(search);
      const matchesStyle = !style || b.style === style;
      return matchesSearch && matchesStyle;
    });
    render(filtered);
  }

  document.getElementById('beerSearch').addEventListener('input', handleFilters);
  document.getElementById('styleFilter').addEventListener('change', handleFilters);

  load();