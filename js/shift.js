// ================= SHIFT SUMMARY & PRODUCT TALLY LOGIC =================
function openStartShiftModal() { document.getElementById('modal-start-shift').classList.add('active'); }

function confirmStartShift() {
  isShiftOpen = true;
  document.getElementById('pos-shift-closed-view').style.display = 'none';
  document.getElementById('pos-shift-open-view').style.display = 'block';
  closeModal('modal-start-shift');
}

function openTotalSalesModal() {
  renderShiftReceiptsList();
  document.getElementById('modal-total-sales').classList.add('active');
}

function renderShiftReceiptsList() {
  const container = document.getElementById('shift-receipts-list');
  if (!container) return;
  if (shiftReceipts.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:10px;">No receipts recorded for this shift yet.</p>`;
    return;
  }
  container.innerHTML = shiftReceipts.map(r => `
    <div class="list-card" style="display:flex; justify-content:space-between; align-items:center; cursor:pointer; margin-bottom:0; padding:10px 12px;" onclick="openReceiptDetailModal('${r.id}')">
      <div>
        <div style="font-weight:700; font-size:0.88rem;">Receipt #${r.id}</div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${r.date} | ${r.time}</div>
      </div>
      <div style="font-weight:700; font-size:0.95rem; color:#111;">₱${parseFloat(r.amount).toFixed(2)}</div>
    </div>
  `).join('');
}

function openReceiptDetailModal(id) {
  document.getElementById('receipt-modal-title').innerText = `Receipt #${id}`;
  openCartReceiptModal();
}

function confirmEndShift() {
  if (confirm('Are you sure you want to end this physical booth shift?')) {
    isShiftOpen = false;
    document.getElementById('pos-shift-closed-view').style.display = 'flex';
    document.getElementById('pos-shift-open-view').style.display = 'none';
    closeModal('modal-total-sales');
  }
}

function openProductTallyModal() {
  if (document.getElementById('tally-search-input')) document.getElementById('tally-search-input').value = '';
  if (document.getElementById('tally-cat-dropdown')) document.getElementById('tally-cat-dropdown').value = 'all';
  filterProductTally();
  document.getElementById('modal-product-tally').classList.add('active');
}

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
