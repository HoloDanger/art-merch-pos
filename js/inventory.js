// ================= INVENTORY & CATEGORY MANAGEMENT =================
function switchInventorySubtabDropdown(val) {
  document.getElementById('inv-sub-products').style.display = val === 'products' ? 'block' : 'none';
  document.getElementById('inv-sub-discounts').style.display = val === 'discounts' ? 'block' : 'none';
  document.getElementById('inv-sub-categories').style.display = val === 'categories' ? 'block' : 'none';
  if (val === 'discounts') renderDiscounts();
  if (val === 'categories') renderCategories();
}

function renderInventoryProducts() {
  const grid = document.getElementById('inv-product-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="figma-prod-card" onclick="openEditProductModal(${p.id})">
      <div class="prod-thumb"><img src="${p.img}" alt="${p.name}"></div>
      <div class="prod-label-banner">${p.name}</div>
    </div>
  `).join('');
}

function filterInventoryProducts(val) {
  const grid = document.getElementById('inv-product-grid');
  if (!grid) return;
  let filtered = products.filter(p => p.name.toLowerCase().includes(val.toLowerCase()));
  grid.innerHTML = filtered.map(p => `
    <div class="figma-prod-card" onclick="openEditProductModal(${p.id})">
      <div class="prod-thumb"><img src="${p.img}" alt="${p.name}"></div>
      <div class="prod-label-banner">${p.name}</div>
    </div>
  `).join('');
}

function openEditProductModal(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  document.getElementById('edit-prod-id').value = prod.id;
  document.getElementById('edit-prod-name').value = prod.name;
  document.getElementById('edit-prod-cat').value = prod.category;
  document.getElementById('edit-prod-price').value = prod.price;
  document.getElementById('edit-prod-cost').value = prod.cost || 30;
  document.getElementById('edit-prod-img').src = prod.img;
  document.getElementById('modal-edit-product').classList.add('active');
}

function saveEditedProduct() {
  const id = parseInt(document.getElementById('edit-prod-id').value);
  const prod = products.find(p => p.id === id);
  if (prod) {
    prod.name = document.getElementById('edit-prod-name').value;
    prod.category = document.getElementById('edit-prod-cat').value;
    prod.price = parseFloat(document.getElementById('edit-prod-price').value || prod.price);
    prod.cost = parseFloat(document.getElementById('edit-prod-cost').value || prod.cost);
    renderInventoryProducts();
    renderPosProducts();
    closeModal('modal-edit-product');
    alert('Product details updated successfully!');
  }
}

function confirmDeleteCurrentProduct() {
  const id = parseInt(document.getElementById('edit-prod-id').value);
  closeModal('modal-edit-product');
  deleteInventoryItem('product', id);
}

function renderDiscounts() {
  const container = document.getElementById('discounts-list');
  if (!container) return;
  container.innerHTML = discounts.map(d => `
    <div class="list-card">
      <div>
        <div style="font-weight:700;">${d.name}</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">${d.category}</div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="badge-pill badge-yellow">${d.val}</span>
        <span style="color:var(--danger-red); cursor:pointer; display:inline-flex; align-items:center;" onclick="deleteInventoryItem('discount', ${d.id})"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.67M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </div>
    </div>
  `).join('');
}

function renderCategories() {
  const container = document.getElementById('categories-list');
  if (!container) return;
  container.innerHTML = categories.map((c, idx) => `
    <div class="list-card">
      <span style="font-weight:700;">${c}</span>
      <span style="color:var(--danger-red); cursor:pointer; display:inline-flex; align-items:center;" onclick="deleteInventoryItem('category', ${idx})"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.67M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
  `).join('');
}

function deleteInventoryItem(type, id) {
  if (confirm(`Are you sure you want to delete this ${type}? It will be moved to the trash bin.`)) {
    if (type === 'product') {
      const item = products.find(p => p.id === id);
      if (item) trashBin.push({ type: 'Product', name: item.name });
      products = products.filter(p => p.id !== id);
      renderInventoryProducts();
      renderPosProducts();
    } else if (type === 'discount') {
      const item = discounts.find(d => d.id === id);
      if (item) trashBin.push({ type: 'Discount', name: item.name });
      discounts = discounts.filter(d => d.id !== id);
      renderDiscounts();
    } else if (type === 'category') {
      trashBin.push({ type: 'Category', name: categories[id] });
      categories.splice(id, 1);
      renderCategories();
      refreshCategoryDropdowns();
    }
  }
}

function refreshCategoryDropdowns() {
  const posCatSelect = document.getElementById('pos-cat-dropdown');
  const addProdCatSelect = document.getElementById('new-prod-cat');
  const editProdCatSelect = document.getElementById('edit-prod-cat');

  if (posCatSelect) {
    const currentVal = posCatSelect.value;
    posCatSelect.innerHTML = `<option value="all">Category: All Merch</option>` + 
      categories.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
    posCatSelect.value = currentVal;
  }

  if (addProdCatSelect) {
    addProdCatSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  if (editProdCatSelect) {
    editProdCatSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

function openAddProductModal() { 
  refreshCategoryDropdowns();
  document.getElementById('modal-add-product').classList.add('active'); 
}

function openAddDiscountModal() { document.getElementById('modal-add-discount').classList.add('active'); }
function openAddCategoryModal() { document.getElementById('modal-add-category').classList.add('active'); }

function saveNewProduct() {
  const name = document.getElementById('new-prod-name').value;
  const cat = document.getElementById('new-prod-cat').value;
  const price = parseFloat(document.getElementById('new-prod-price').value || 100);
  if (!name) { alert('Please enter product name'); return; }

  products.push({ id: Date.now(), name, category: cat, price, cost: 30, stock: 50, sold: 0, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=60' });
  renderInventoryProducts();
  renderPosProducts();
  closeModal('modal-add-product');
}

function handleDiscountCategoryChange() {
  const cat = document.getElementById('new-disc-cat').value;
  const valInput = document.getElementById('new-disc-val');
  if (cat === 'Freebie') {
    valInput.value = '100% Off';
    valInput.readOnly = true;
  } else {
    valInput.readOnly = false;
    if (valInput.value === '100% Off') valInput.value = '';
    if (cat === 'Percent-based') valInput.placeholder = 'Value (e.g. 10% Off)';
    else if (cat === 'Price-based') valInput.placeholder = 'Value (e.g. ₱25 Off)';
  }
}

function saveNewDiscount() {
  const name = document.getElementById('new-disc-name').value.trim();
  const cat = document.getElementById('new-disc-cat').value;
  let val = document.getElementById('new-disc-val').value.trim();
  if (!name) { alert('Please enter discount name'); return; }

  if (cat === 'Freebie') {
    val = '100% Off';
  } else if (cat === 'Percent-based') {
    const num = val.replace(/[^0-9.]/g, '');
    val = num ? `${num}% Off` : (val.includes('%') ? val : `${val}% Off`);
  } else if (cat === 'Price-based') {
    const num = val.replace(/[^0-9.]/g, '');
    val = num ? `₱${num} Off` : (val.includes('₱') ? val : `₱${val} Off`);
  }

  discounts.push({ id: Date.now(), name, category: cat, val });
  renderDiscounts();
  closeModal('modal-add-discount');
  document.getElementById('new-disc-name').value = '';
  document.getElementById('new-disc-val').value = '';
  document.getElementById('new-disc-val').readOnly = false;
}

function saveNewCategory() {
  const name = document.getElementById('new-cat-name').value.trim();
  if (!name) { alert('Please enter category name'); return; }
  if (!categories.includes(name)) {
    categories.push(name);
    renderCategories();
    refreshCategoryDropdowns();
  }
  document.getElementById('new-cat-name').value = '';
  closeModal('modal-add-category');
}
