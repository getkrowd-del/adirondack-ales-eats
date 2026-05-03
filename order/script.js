let cart = [];
  function addToCart(id, name, price) {
    const existing = cart.find(i => i.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, name, price, qty: 1 });
    renderCart(); showToast(name + ' added!');
  }
  function renderCart() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
    const container = document.getElementById('cartItems');
    if (!cart.length) { container.innerHTML = '<div class="cart-empty"><p>Your cart is empty.</p></div>'; return; }
    container.innerHTML = cart.map(item => `<div style="padding:10px 0; border-bottom:1px solid #333;">${item.qty}x ${item.name} - $${(item.price * item.qty).toFixed(2)}</div>`).join('');
  }
  function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2000); }

  const chatBtn = document.getElementById('custom-chat-btn'), 
        chatPanel = document.getElementById('chat-panel'), 
        chatIframe = document.getElementById('chat-iframe'), 
        teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;
  chatBtn.addEventListener('click', () => { 
    chatOpen = !chatOpen; 
    if (chatOpen) { 
      if (!chatLoaded) { chatIframe.src = 'https://brewpub.getkrowd.com/agents/46866772/embed'; chatLoaded = true; } 
      chatPanel.classList.add('open'); 
      teaser.classList.add('hidden'); 
    } else chatPanel.classList.remove('open'); 
  });
  setTimeout(() => teaser.classList.add('visible'), 2000);