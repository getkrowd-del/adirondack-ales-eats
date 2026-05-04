// ── CART ──
  let cart = [];
  function addToCart(id, name, price) {
    const ex = cart.find(i => i.id === id);
    if (ex) ex.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart();
    showToast(name + ' added!');
  }
  function removeFromCart(id) { cart = cart.filter(i => i.id !== id); renderCart(); }
  function changeQty(id, delta) { const item = cart.find(i => i.id === id); if (!item) return; item.qty += delta; if (item.qty <= 0) removeFromCart(id); else renderCart(); }
  function getSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
  function renderCart() {
    document.getElementById('cartSubtotal').textContent = '$' + getSubtotal().toFixed(2);
    document.getElementById('cartTax').textContent = '$' + (getSubtotal() * 0.08).toFixed(2);
    document.getElementById('cartTotal').textContent = '$' + (getSubtotal() * 1.08).toFixed(2);
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
    const container = document.getElementById('cartItems');
    if (!cart.length) { container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🍺</div><p>Your cart is empty.<br>Add items to get started!</p></div>'; return; }
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          <div class="cart-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
      </div>`).join('');
  }

  // ── CHECKOUT ──
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    document.getElementById('summaryItems').innerHTML = cart.map(i => `<div class="summary-item"><span>${i.qty}x ${i.name}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
    document.getElementById('summaryTotal').textContent = '$' + (getSubtotal() * 1.08).toFixed(2);
    document.getElementById('modalOverlay').classList.add('open');
  });
  function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); document.getElementById('checkoutForm').style.display = 'block'; document.getElementById('successScreen').classList.remove('show'); }
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => { if (e.target === document.getElementById('modalOverlay')) closeModal(); });
  document.getElementById('modalSubmit').addEventListener('click', () => {
    const first = document.getElementById('firstName').value.trim(), last = document.getElementById('lastName').value.trim(), phone = document.getElementById('phone').value.trim();
    if (!first || !last || !phone) { showToast('Please fill in your name and phone number.'); return; }
    document.getElementById('orderNum').textContent = 'ADK-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
    cart = []; renderCart();
  });

  // ── CATEGORY TABS — scroll to section ──
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const targetId = 'cat-' + this.dataset.cat;
      const el = document.getElementById(targetId);
      if (el) {
        const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 90;
        const menuNavHeight = document.querySelector('.menu-nav') ? document.querySelector('.menu-nav').offsetHeight : 50;
        const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight - menuNavHeight - 10;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Highlight active tab on scroll
  window.addEventListener('scroll', () => {
    const sections = ['starters','salads','pizzas','burgers','burritos','parfaits','desserts'];
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.getElementById('cat-' + sections[i]);
      if (el && el.getBoundingClientRect().top <= 200) {
        document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
        const tab = document.querySelector(`.cat-tab[data-cat="${sections[i]}"]`);
        if (tab) tab.classList.add('active');
        break;
      }
    }
  });

  function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }

  // ── CHAT ──
  const chatBtn = document.getElementById('custom-chat-btn'), chatPanel = document.getElementById('chat-panel'), chatIframe = document.getElementById('chat-iframe'), teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;
  chatBtn.addEventListener('click', () => { chatOpen = !chatOpen; if (chatOpen) { if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; } chatPanel.classList.add('open'); teaser.classList.remove('visible'); teaser.classList.add('hidden'); } else chatPanel.classList.remove('open'); });
  document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });
  setTimeout(() => teaser.classList.add('visible'), 2000);
  document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });