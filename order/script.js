// ── CART ──
  var cart = [];
  function addToCart(id, name, price) {
    var ex = cart.find(function(i){ return i.id === id; });
    if (ex) { ex.qty++; } else { cart.push({id:id, name:name, price:price, qty:1}); }
    renderCart();
    showToast(name + ' added!');
  }
  function removeFromCart(id) { cart = cart.filter(function(i){ return i.id !== id; }); renderCart(); }
  function changeQty(id, delta) {
    var item = cart.find(function(i){ return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(id); } else { renderCart(); }
  }
  function getSubtotal() { return cart.reduce(function(s,i){ return s + i.price * i.qty; }, 0); }
  function renderCart() {
    var sub = getSubtotal();
    document.getElementById('cartSubtotal').textContent = '$' + sub.toFixed(2);
    document.getElementById('cartTax').textContent = '$' + (sub * 0.08).toFixed(2);
    document.getElementById('cartTotal').textContent = '$' + (sub * 1.08).toFixed(2);
    document.getElementById('checkoutBtn').disabled = cart.length === 0;
    var container = document.getElementById('cartItems');
    if (!cart.length) {
      container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🍺</div><p>Your cart is empty.<br>Add items to get started!</p></div>';
      return;
    }
    container.innerHTML = cart.map(function(item) {
      return '<div class="cart-item"><div class="cart-item-info"><div class="cart-item-name">' + item.name + '</div><div class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</div><div class="cart-qty"><button class="qty-btn" onclick="changeQty(' + item.id + ',-1)">−</button><span class="qty-num">' + item.qty + '</span><button class="qty-btn" onclick="changeQty(' + item.id + ',1)">+</button></div></div><button class="remove-btn" onclick="removeFromCart(' + item.id + ')">✕</button></div>';
    }).join('');
  }

  // ── CHECKOUT ──
  document.getElementById('checkoutBtn').addEventListener('click', function() {
    document.getElementById('summaryItems').innerHTML = cart.map(function(i){ return '<div class="summary-item"><span>' + i.qty + 'x ' + i.name + '</span><span>$' + (i.price*i.qty).toFixed(2) + '</span></div>'; }).join('');
    document.getElementById('summaryTotal').textContent = '$' + (getSubtotal() * 1.08).toFixed(2);
    document.getElementById('modalOverlay').classList.add('open');
  });
  function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.getElementById('checkoutForm').style.display = 'block';
    document.getElementById('successScreen').classList.remove('show');
  }
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', function(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); });
  document.getElementById('modalSubmit').addEventListener('click', function() {
    var first = document.getElementById('firstName').value.trim();
    var last = document.getElementById('lastName').value.trim();
    var phone = document.getElementById('phone').value.trim();
    if (!first || !last || !phone) { showToast('Please fill in your name and phone number.'); return; }
    document.getElementById('orderNum').textContent = 'ADK-' + Math.floor(1000 + Math.random() * 9000);
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
    cart = [];
    renderCart();
  });

  // ── CATEGORY TABS ──
  var tabs = document.querySelectorAll('.cat-tab');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var targetEl = document.getElementById('cat-' + tab.getAttribute('data-cat'));
      if (targetEl) {
        var navH = 90;
        var menuNavH = 50;
        var rect = targetEl.getBoundingClientRect();
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var targetTop = rect.top + scrollTop - navH - menuNavH - 10;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // ── TOAST ──
  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2200);
  }

  // ── CHAT ──
  var chatBtn = document.getElementById('custom-chat-btn');
  var chatPanel = document.getElementById('chat-panel');
  var chatIframe = document.getElementById('chat-iframe');
  var teaser = document.getElementById('chat-teaser');
  var chatLoaded = false, chatOpen = false;
  chatBtn.addEventListener('click', function() {
    chatOpen = !chatOpen;
    if (chatOpen) {
      if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; }
      chatPanel.classList.add('open');
      teaser.classList.remove('visible');
      teaser.classList.add('hidden');
    } else {
      chatPanel.classList.remove('open');
    }
  });
  document.addEventListener('click', function(e) {
    if (chatOpen && !chatPanel.contains(e.target) && e.target !== chatBtn && !chatBtn.contains(e.target)) {
      chatPanel.classList.remove('open');
      chatOpen = false;
    }
  });
  setTimeout(function(){ teaser.classList.add('visible'); }, 2000);
  document.getElementById('teaser-close-btn').addEventListener('click', function() {
    teaser.classList.remove('visible');
    teaser.classList.add('hidden');
  });