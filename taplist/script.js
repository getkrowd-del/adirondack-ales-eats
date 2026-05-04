// The exact URL you provided
    const API_URL = 'https://api.getkrowd.com/v3/beer/index.cfm?companyId=1071&apiKey=krwd_55d0f6ea46590c34c08265bdf0fabe6a3296b6546f0a7ee2c500623ad31';

    async function testAPI() {
      const statusEl = document.getElementById('status');
      const listEl = document.getElementById('beer-list');

      try {
        // 1. THE FETCH: Absolutely no extra headers or options. 
        // This guarantees the browser sends a "Simple Request" and avoids CORS preflight checks.
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Server responded with status: ' + response.status);
        }

        // 2. PARSE DATA: Use text() first to safely handle any Lucee quirks before parsing to JSON
        const textData = await response.text();
        const payload = JSON.parse(textData.trim());

        // 3. FIND THE BEERS: Handle various JSON structures
        let beers = [];
        if (Array.isArray(payload)) {
          beers = payload;
        } else if (payload.data && Array.isArray(payload.data)) {
          beers = payload.data;
        } else if (payload.beers && Array.isArray(payload.beers)) {
          beers = payload.beers;
        } else {
          // Dig into the object to find the first array
          for (let key in payload) {
            if (Array.isArray(payload[key])) {
              beers = payload[key];
              break;
            }
          }
        }

        if (beers.length === 0) {
          statusEl.className = 'status';
          statusEl.textContent = 'API connected successfully, but no beers were returned.';
          return;
        }

        // 4. SUCCESS: Display the data
        statusEl.className = 'status success';
        statusEl.textContent = `Success! Loaded ${beers.length} beers.`;

        let html = '';
        beers.forEach(beer => {
          // Normalize keys to lowercase to handle Lucee sending UPPERCASE keys
          const b = {};
          for (let key in beer) {
            b[key.toLowerCase()] = beer[key];
          }

          // Extract basic info
          const name = b.title || b.name || b.beer_name || 'Unnamed Beer';
          const style = b.beer_type || b.style || b.category || 'Unknown Style';
          const desc = b.description || b.tasting_notes || 'No description provided.';
          const abv = b.abv ? ` | ABV: ${b.abv}%` : '';

          html += `
            <div class="beer-item">
              <h2>${name}</h2>
              <div class="beer-style">${style}${abv}</div>
              <p>${desc}</p>
            </div>
          `;
        });

        listEl.innerHTML = html;

      } catch (error) {
        // 5. ERROR HANDLING
        statusEl.className = 'status error';
        statusEl.textContent = 'Connection Failed: ' + error.message;
        console.error('Full error details:', error);
      }
    }

    // Run the test immediately
    testAPI();