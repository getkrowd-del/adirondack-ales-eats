let cart = [];
  function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart(); showToast(name + ' added to cart!');
  }
  function removeFromCart(id) { cart = cart.filter(i => i.id !== id); renderCart(); }
  function changeQty(id, delta) { const item = cart.find(i => i.id === id); if (!item) return; item.qty += delta; if (item.qty <= 0) removeFromCart(id); else renderCart(); }
  function getSubtotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }
  function getTax() { return getSubtotal() * 0.08; }
  function getTotal() { return getSubtotal() + getTax(); }
  function renderCart() {
    document.getElementById('cartSubtotal').textContent = '$' + getSubtotal().toFixed(2);
    document.getElementById('cartTax').textContent = '$' + getTax().toFixed(2);
    document.getElementById('cartTotal').textContent = '$' + getTotal().toFixed(2);
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
    const container = document.getElementById('cartItems');
    if (!cart.length) { container.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p></div>'; return; }
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
  function openCheckout() {
    document.getElementById('summaryItems').innerHTML = cart.map(i => `<div class="summary-item"><span>${i.qty}x ${i.name}</span><span>$${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
    document.getElementById('summaryTotal').textContent = '$' + getTotal().toFixed(2);
    document.getElementById('modalOverlay').classList.add('open');
  }
  function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); document.getElementById('checkoutForm').style.display = 'block'; document.getElementById('successScreen').classList.remove('show'); }
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalSubmit').addEventListener('click', () => {
    const first = document.getElementById('firstName').value.trim(), phone = document.getElementById('phone').value.trim();
    if (!first || !phone) { showToast('Name and phone number are required.'); return; }
    document.getElementById('orderNum').textContent = 'ADK-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
    cart = []; renderCart();
  });
  function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }
  document.querySelectorAll('.cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const el = document.getElementById('cat-' + tab.dataset.cat);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const chatBtn = document.getElementById('custom-chat-btn'), 
        chatPanel = document.getElementById('chat-panel'), 
        chatIframe = document.getElementById('chat-iframe'), 
        teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;
  chatBtn.addEventListener('click', () => { 
    chatOpen = !chatOpen; 
    if (chatOpen) { 
      if (!chatLoaded) { 
        chatIframe.src = 'https://brewpub.getkrowd.com/agents/46866772/embed'; 
        chatLoaded = true; 
      } 
      chatPanel.classList.add('open'); 
      teaser.classList.remove('visible'); 
      teaser.classList.add('hidden'); 
    } else chatPanel.classList.remove('open'); 
  });
  document.addEventListener('click', e => { if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) { chatPanel.classList.remove('open'); chatOpen = false; } });
  setTimeout(() => teaser.classList.add('visible'), 2000);
  document.getElementById('teaser-close-btn').addEventListener('click', () => { teaser.classList.remove('visible'); teaser.classList.add('hidden'); });