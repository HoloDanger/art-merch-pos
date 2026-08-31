/**
 * @file pos.js
 * @description Point-of-Sale (POS) grid rendering, cart management, discount calculations, and checkout processing.
 */

/**
 * Updates yellow badge counts on the "See Receipt" button and POS top header
 */
function updateCartBadgeAndTotalSalesCount() {
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartBadge = document.getElementById('cart-badge-count');
  if (cartBadge) cartBadge.innerText = totalItems;

  const soldTotal = products.reduce((acc, p) => acc + (p.sold || 0), 0);
  const salesBadge = document.getElementById('pos-total-sales-count');
  if (salesBadge) salesBadge.innerText = soldTotal + totalItems;
}

/**
 * Renders the 3-column product grid in the POS screen, applying search and category filters.
 */
function renderPosProducts() {
  const grid = document.getElementById('pos-product-grid');
  if (!grid) return;
  const query = document.getElementById('pos-search').value.toLowerCase();
  const cat = document.getElementById('pos-cat-dropdown').value;

  grid.innerHTML = '';

  let filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query);
    const pCat = (p.category || '').toLowerCase();
    const cVal = (cat || '').toLowerCase();
    const matchCat = (cVal === 'all') || (pCat === cVal) || (pCat.includes(cVal) || cVal.includes(pCat));
    return matchQ && matchCat;
  });

  filtered.forEach(p => {
    const inCart = cart.find(i => i.id === p.id);
    const qty = inCart ? inCart.qty : 0;
    const card = document.createElement('div');
    card.className = 'figma-prod-card';
    card.style.position = 'relative';
    card.onclick = () => addToCart(p.id);
    card.innerHTML = `
      <div class="prod-thumb" style="position:relative;">
        <img src="${p.img}" alt="${p.name}">
        ${qty > 0 ? `<div style="position:absolute; top:6px; right:6px; background:var(--accent-yellow); color:#222; font-weight:800; font-size:0.78rem; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,0.3); z-index:2;">${qty}</div>` : ''}
      </div>
      <div class="prod-label-banner">${p.name}</div>
    `;
    grid.appendChild(card);
  });
}

/**
 * Filter trigger handler for POS search input & category dropdown
 */
function filterPosProducts() { renderPosProducts(); }

/**
 * Adds a product to the active checkout cart by ID.
 * @param {number} id - Product ID
 */
function addToCart(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...prod, qty: 1 });

  updateCartBadgeAndTotalSalesCount();
  renderPosProducts();
}

/**
 * Modifies cart item quantity directly from product card controls.
 * @param {number} id - Product ID
 * @param {number} delta - Quantity change (+1 or -1)
 */
function changePosCardQty(id, delta) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  let item = cart.find(i => i.id === id);
  if (delta > 0) {
    if (item) item.qty += delta;
    else cart.push({ ...prod, qty: 1 });
  } else if (delta < 0 && item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  updateCartBadgeAndTotalSalesCount();
  renderPosProducts();
}

/**
 * Opens the Current Order Receipt / Checkout modal if cart contains items.
 */
function openCartReceiptModal() {
  if (cart.length === 0) {
    alert('Your order cart is empty! Tap products on the POS grid to add them.');
    return;
  }
  renderCartTotals();
  document.getElementById('modal-cart-receipt').classList.add('active');
}

/**
 * Calculates cart subtotal, applies selected discount, and updates total display.
 * Quantifier buttons (- and +) are explicitly styled with solid black (#000000) color.
 */
function renderCartTotals() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;
  container.innerHTML = cart.map(i => `
    <div class="list-card">
      <div>
        <div style="font-weight:700;">${i.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">₱${i.price}.00 | ${i.category}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <button style="border:1px solid #cbd5e1; background:#ffffff; color:#475569; width:28px; height:28px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;" onclick="updateCartQty(${i.id}, -1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.67M9.5 12.5H14.5" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span style="font-weight:700; color:#334155; min-width:16px; text-align:center;">${i.qty}</span>
        <button style="border:1px solid #cbd5e1; background:#ffffff; color:#475569; width:28px; height:28px; border-radius:8px; font-weight:700; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;" onclick="updateCartQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const discRate = parseFloat(document.getElementById('pos-discount-select').value || 0);
  let subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  let total = subtotal - (subtotal * discRate);
  document.getElementById('cart-total-amount').innerText = `₱${total.toFixed(2)}`;
}

/**
 * Updates cart item quantity inside the checkout receipt modal.
 * @param {number} id - Product ID
 * @param {number} delta - Quantity change (+1 or -1)
 */
function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  updateCartBadgeAndTotalSalesCount();
  renderCartTotals();
  renderPosProducts();
}

/**
 * Finalizes checkout transaction, updates product sold metrics, logs receipt, and resets cart.
 */
function processCheckout() {
  const method = document.getElementById('pos-payment-select').value;
  const totalStr = document.getElementById('cart-total-amount').innerText;
  const totalVal = parseFloat(totalStr.replace('₱', '')) || 0;

  const cartSnapshot = cart.map(i => ({ name: i.name, qty: i.qty, price: i.price }));

  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) prod.sold = (prod.sold || 0) + item.qty;
  });

  // Record receipt in Shift Receipt History with full itemization and refund capability
  shiftReceipts.unshift({
    id: `1-00${shiftReceipts.length + 1}`,
    date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
    amount: totalVal,
    payment: method,
    items: cartSnapshot,
    refunded: false
  });

  alert(`✅ Transaction Checkout Complete!\nPayment: ${method}\nTotal: ${totalStr}`);
  cart = [];
  updateCartBadgeAndTotalSalesCount();
  renderPosProducts();
  closeModal('modal-cart-receipt');
}
