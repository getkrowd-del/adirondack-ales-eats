// MOBILE TOGGLE
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); mobileMenu.classList.toggle('open'); });

  // CHAT
  const chatBtn = document.getElementById('custom-chat-btn'), 
        chatPanel = document.getElementById('chat-panel'), 
        chatIframe = document.getElementById('chat-iframe'), 
        teaser = document.getElementById('chat-teaser');
  let chatLoaded = false, chatOpen = false;

  chatBtn.addEventListener('click', () => {
    chatOpen = !chatOpen;
    if (chatOpen) {
      if (!chatLoaded) { chatIframe.src = 'https://paymegpt.com/agents/46866772/embed'; chatLoaded = true; }
      chatPanel.classList.add('open');
      teaser.classList.add('hidden');
    } else chatPanel.classList.remove('open');
  });

  setTimeout(() => teaser.classList.add('visible'), 2000);
  document.getElementById('teaser-close-btn').addEventListener('click', () => teaser.classList.add('hidden'));