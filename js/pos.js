// ================= POS LOGIC & CART MANAGEMENT =================
function updateCartBadgeAndTotalSalesCount() {
  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartBadge = document.getElementById('cart-badge-count');
  if (cartBadge) cartBadge.innerText = totalItems;

  const soldTotal = products.reduce((acc, p) => acc + (p.sold || 0), 0);
  const salesBadge = document.getElementById('pos-total-sales-count');
  if (salesBadge) salesBadge.innerText = soldTotal + totalItems;
}

function renderPosProducts() {
  const grid = document.getElementById('pos-product-grid');
  if (!grid) return;
  const query = document.getElementById('pos-search').value.toLowerCase();
  const cat = document.getElementById('pos-cat-dropdown').value;

  grid.innerHTML = '';

  let filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query);
    const matchCat = cat === 'all' || p.category === cat;
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

function filterPosProducts() { renderPosProducts(); }

function addToCart(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...prod, qty: 1 });

  updateCartBadgeAndTotalSalesCount();
  renderPosProducts();
}

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

function openCartReceiptModal() {
  if (cart.length === 0) {
    alert('Your order cart is empty! Tap products on the POS grid to add them.');
    return;
  }
  renderCartTotals();
  document.getElementById('modal-cart-receipt').classList.add('active');
}

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
        <button style="border:none; background:#f1f5f9; padding:4px 10px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="updateCartQty(${i.id}, -1)">-</button>
        <span style="font-weight:700;">${i.qty}</span>
        <button style="border:none; background:var(--accent-yellow); padding:4px 10px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="updateCartQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const discRate = parseFloat(document.getElementById('pos-discount-select').value || 0);
  let subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
  let total = subtotal - (subtotal * discRate);
  document.getElementById('cart-total-amount').innerText = `₱${total.toFixed(2)}`;
}

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

function processCheckout() {
  const method = document.getElementById('pos-payment-select').value;
  const totalStr = document.getElementById('cart-total-amount').innerText;
  const totalVal = parseFloat(totalStr.replace('₱', '')) || 0;

  cart.forEach(item => {
    const prod = products.find(p => p.id === item.id);
    if (prod) prod.sold = (prod.sold || 0) + item.qty;
  });

  // Record receipt in Shift Receipt History
  shiftReceipts.unshift({
    id: `1-00${shiftReceipts.length + 1}`,
    date: '01/11/2025',
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase(),
    amount: totalVal
  });

  alert(`✅ Transaction Checkout Complete!\nPayment: ${method}\nTotal: ${totalStr}`);
  cart = [];
  updateCartBadgeAndTotalSalesCount();
  renderPosProducts();
  closeModal('modal-cart-receipt');
}
