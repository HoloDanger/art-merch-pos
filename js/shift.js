/**
 * @file shift.js
 * @description Shift start/end workflow, Shift Summary receipt history list, Receipt refund processing, and Product Tally filter logic.
 */

/** Opens the Start Shift modal */
function openStartShiftModal() { document.getElementById('modal-start-shift').classList.add('active'); }

/** Confirms opening of physical booth shift */
function confirmStartShift() {
  isShiftOpen = true;
  document.getElementById('pos-shift-closed-view').style.display = 'none';
  document.getElementById('pos-shift-open-view').style.display = 'block';
  closeModal('modal-start-shift');
}

/** Opens Shift Summary modal (Total Sales screen) */
function openTotalSalesModal() {
  renderShiftReceiptsList();
  document.getElementById('modal-total-sales').classList.add('active');
}

/**
 * Renders scrollable receipt history list items inside Shift Summary modal.
 * Shows receipt ID, date/time, amount, and refund status badge.
 */
function renderShiftReceiptsList() {
  const container = document.getElementById('shift-receipts-list');
  if (!container) return;
  if (shiftReceipts.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:10px;">No receipts recorded for this shift yet.</p>`;
    return;
  }
  container.innerHTML = shiftReceipts.map(r => `
    <div class="list-card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; margin-bottom:0; padding:10px 12px; ${r.refunded ? 'background:#fef2f2; border-color:#fecaca;' : ''}" onclick="openReceiptDetailModal('${r.id}')">
      <div>
        <div style="font-weight:700; font-size:0.88rem; display:flex; align-items:center; gap:6px;">
          <span>Receipt #${r.id}</span>
          ${r.refunded ? `<span class="badge-pill badge-red" style="font-size:0.6rem; padding:2px 6px;">Refunded</span>` : ''}
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${r.date} | ${r.time} • ${r.payment || 'Cash'}</div>
      </div>
      <div style="font-weight:700; font-size:0.95rem; color:${r.refunded ? 'var(--danger-red)' : '#111'}; ${r.refunded ? 'text-decoration:line-through;' : ''}">₱${parseFloat(r.amount).toFixed(2)}</div>
    </div>
  `).join('');
}

/**
 * Opens receipt details and refund management modal for a transaction ID.
 * @param {string} id - Receipt ID
 */
function openReceiptDetailModal(id) {
  const receipt = shiftReceipts.find(r => r.id === id);
  if (!receipt) return;

  document.getElementById('receipt-detail-id').innerText = `Receipt #${receipt.id}`;
  document.getElementById('receipt-detail-meta').innerText = `${receipt.date} | ${receipt.time} • Payment: ${receipt.payment || 'Cash'}`;
  
  const container = document.getElementById('receipt-detail-items');
  if (container) {
    container.innerHTML = (receipt.items || []).map(item => `
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0;">
        <span>${item.qty}x ${item.name}</span>
        <span style="font-weight:600;">₱${(item.qty * item.price).toFixed(2)}</span>
      </div>
    `).join('');
  }

  document.getElementById('receipt-detail-total').innerText = `₱${parseFloat(receipt.amount).toFixed(2)}`;

  const refundBtn = document.getElementById('receipt-refund-btn');
  if (refundBtn) {
    refundBtn.style.display = 'none';
  }

  document.getElementById('modal-receipt-detail').classList.add('active');
}

/**
 * Executes refund processing for a specific receipt transaction.
 * @param {string} id - Receipt ID
 */
function refundReceipt(id) {
  const receipt = shiftReceipts.find(r => r.id === id);
  if (receipt) {
    receipt.refunded = true;
    alert(`Transaction #${receipt.id} has been refunded.`);
    openReceiptDetailModal(receipt.id);
    renderShiftSummaryReceipts();
  }
}

/** Confirms ending of physical booth shift */
function confirmEndShift() {
  if (confirm('Are you sure you want to end this physical booth shift?')) {
    isShiftOpen = false;
    document.getElementById('pos-shift-closed-view').style.display = 'flex';
    document.getElementById('pos-shift-open-view').style.display = 'none';
    closeModal('modal-total-sales');
  }
}

/** Opens Shift Product Tally modal and resets search filters */
function openProductTallyModal() {
  if (document.getElementById('tally-search-input')) document.getElementById('tally-search-input').value = '';
  if (document.getElementById('tally-cat-dropdown')) document.getElementById('tally-cat-dropdown').value = 'all';
  filterProductTally();
  document.getElementById('modal-product-tally').classList.add('active');
}

/**
 * Filters and renders Shift Product Tally cards with search bar and category dropdown.
 */
function filterProductTally() {
  const searchVal = (document.getElementById('tally-search-input')?.value || '').toLowerCase();
  const catVal = document.getElementById('tally-cat-dropdown')?.value || 'all';
  const container = document.getElementById('product-tally-list');
  if (!container) return;

  let filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchVal);
    const matchesCat = (catVal === 'all') || (p.category.toLowerCase().includes(catVal.toLowerCase()));
    return matchesSearch && matchesCat;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); text-align:center; padding:16px;">No products found</p>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const soldCount = p.sold || 0;
    const totalStock = p.stock || 99;
    return `
      <div class="list-card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; margin-bottom:0;">
        <div>
          <div style="font-weight:700; font-size:0.9rem;">${p.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">₱${p.price.toFixed(2)} | ${p.category}</div>
        </div>
        <div style="font-weight:700; font-size:0.95rem; color:#111;">${soldCount}/${totalStock}</div>
      </div>
    `;
  }).join('');
}
