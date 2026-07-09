// ===== PAYMENT HANDLERS =====
    // Purpose: Send the selected plan to secure checkout.
    // Triggers: When a pricing button is clicked.
    document.querySelectorAll('.price-btn').forEach(btn => btn.addEventListener('click', () => {
      window.__processPayment({
        amountCents: +btn.dataset.amount,
        email: document.getElementById('email').value,
        name: document.getElementById('name').value,
        productName: btn.dataset.name,
        productDescription: 'Dog walking service by PawPals'
      });
    }));