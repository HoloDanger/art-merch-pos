/**
 * @file inventory.js
 * @description Inventory sub-tab dropdown navigation, Product CRUD operations, Discount rules, and Category management.
 */

/**
 * Switches the visible sub-tab in the Inventory section via select dropdown.
 * @param {string} val - Selected view ('products', 'discounts', or 'categories')
 */
function switchInventorySubtabDropdown(val) {
  document.getElementById('inv-sub-products').style.display = val === 'products' ? 'block' : 'none';
  document.getElementById('inv-sub-discounts').style.display = val === 'discounts' ? 'block' : 'none';
  document.getElementById('inv-sub-categories').style.display = val === 'categories' ? 'block' : 'none';
  if (val === 'discounts') renderDiscounts();
  if (val === 'categories') renderCategories();
}

/**
 * Renders the product grid inside the Inventory tab, applying search and category filters.
 */
function renderInventoryProducts() {
  const grid = document.getElementById('inv-product-grid');
  if (!grid) return;
  const searchVal = (document.getElementById('inv-search-input')?.value || '').toLowerCase();
  const catVal = document.getElementById('inv-prod-cat-filter')?.value || 'all';

  let filtered = products.filter(p => {
    const matchQ = p.name.toLowerCase().includes(searchVal);
    const pCat = (p.category || '').toLowerCase();
    const cVal = (catVal || '').toLowerCase();
    const matchCat = (cVal === 'all') || (pCat === cVal) || (pCat.includes(cVal) || cVal.includes(pCat));
    return matchQ && matchCat;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="figma-prod-card" onclick="openEditProductModal(${p.id})">
      <div class="prod-thumb"><img src="${p.img}" alt="${p.name}"></div>
      <div class="prod-label-banner">${p.name}</div>
    </div>
  `).join('');
}

/**
 * Filters the product grid inside the Inventory tab by name and category.
 * @param {string} [val] - Optional search query string
 */
function filterInventoryProducts(val) {
  renderInventoryProducts();
}

/**
 * Handles live image file uploads via FileReader API.
 * @param {Event} event - File input change event
 */
function handleProductImageUpload(event) {
  alert('📷 Live photo upload from device gallery is a Premium Tier feature. Budget upgrade required to unlock file picker integration.');
  if (event && event.target) event.target.value = '';
}

/**
 * Opens the Product Details modal for editing an existing product.
 * @param {number} id - Product ID
 */
function openEditProductModal(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  uploadedImageDataUrl = null;
  document.getElementById('edit-prod-id').value = prod.id;
  document.getElementById('edit-prod-name').value = prod.name;
  document.getElementById('edit-prod-cat').value = prod.category;
  document.getElementById('edit-prod-price').value = prod.price;
  document.getElementById('edit-prod-cost').value = prod.cost || 30;
  if (document.getElementById('edit-prod-desc')) document.getElementById('edit-prod-desc').value = prod.desc || '';
  document.getElementById('edit-prod-img').src = prod.img;
  document.getElementById('modal-edit-product').classList.add('active');
}

/**
 * Saves edited product details back to the products catalog.
 */
function saveEditedProduct() {
  const id = parseInt(document.getElementById('edit-prod-id').value);
  const prod = products.find(p => p.id === id);
  if (prod) {
    prod.name = document.getElementById('edit-prod-name').value;
    prod.category = document.getElementById('edit-prod-cat').value;
    prod.price = parseFloat(document.getElementById('edit-prod-price').value || prod.price);
    prod.cost = parseFloat(document.getElementById('edit-prod-cost').value || prod.cost);
    if (document.getElementById('edit-prod-desc')) prod.desc = document.getElementById('edit-prod-desc').value;
    if (uploadedImageDataUrl) prod.img = uploadedImageDataUrl;

    renderInventoryProducts();
    renderPosProducts();
    closeModal('modal-edit-product');
    alert('Product details updated successfully!');
  }
}

/**
 * Confirms and executes soft deletion of currently edited product.
 */
function confirmDeleteCurrentProduct() {
  const id = parseInt(document.getElementById('edit-prod-id').value);
  closeModal('modal-edit-product');
  deleteInventoryItem('product', id);
}

/**
 * Renders the configured discounts list in the Inventory tab.
 */
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

/**
 * Renders the categories list in the Inventory tab.
 */
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

/**
 * Soft-deletes a product, discount, or category item into the Trash Bin.
 * @param {'product'|'discount'|'category'} type - Item type
 * @param {number} id - Item ID or array index
 */
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

/**
 * Synchronizes category option elements across POS, Inventory filter, and Modal select dropdowns.
 */
function refreshCategoryDropdowns() {
  const posCatSelect = document.getElementById('pos-cat-dropdown');
  const invCatSelect = document.getElementById('inv-prod-cat-filter');
  const addProdCatSelect = document.getElementById('new-prod-cat');
  const editProdCatSelect = document.getElementById('edit-prod-cat');

  if (posCatSelect) {
    const currentVal = posCatSelect.value;
    posCatSelect.innerHTML = `<option value="all">Category: All Merch</option>` + 
      categories.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
    posCatSelect.value = currentVal;
  }

  if (invCatSelect) {
    const currentVal = invCatSelect.value;
    invCatSelect.innerHTML = `<option value="all">Category: All Merch</option>` + 
      categories.map(c => `<option value="${c.toLowerCase()}">${c}</option>`).join('');
    invCatSelect.value = currentVal;
  }

  if (addProdCatSelect) {
    addProdCatSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  if (editProdCatSelect) {
    editProdCatSelect.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }
}

/** Opens Add Product modal */
function openAddProductModal() { 
  uploadedImageDataUrl = null;
  const addImgBox = document.getElementById('add-img-preview-box');
  if (addImgBox) {
    addImgBox.innerHTML = `<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span style="font-size:0.85rem; font-weight:600; color:#64748b;">Add Photo</span>`;
  }
  refreshCategoryDropdowns();
  document.getElementById('modal-add-product').classList.add('active'); 
}

/** Opens Add Discount modal */
function openAddDiscountModal() { document.getElementById('modal-add-discount').classList.add('active'); }

/** Opens Add Category modal */
function openAddCategoryModal() { document.getElementById('modal-add-category').classList.add('active'); }

/**
 * Saves a new product entry to the catalog.
 */
function saveNewProduct() {
  const name = document.getElementById('new-prod-name').value;
  const cat = document.getElementById('new-prod-cat').value;
  const desc = (document.getElementById('new-prod-desc')?.value || '');
  const price = parseFloat(document.getElementById('new-prod-price').value || 100);
  const cost = parseFloat(document.getElementById('new-prod-cost')?.value || 30);
  if (!name) { alert('Please enter product name'); return; }

  const defaultImg = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=60';
  products.push({ id: Date.now(), name, category: cat, desc, price, cost, stock: 50, sold: 0, img: uploadedImageDataUrl || defaultImg });
  renderInventoryProducts();
  renderPosProducts();
  closeModal('modal-add-product');
  document.getElementById('new-prod-name').value = '';
  if (document.getElementById('new-prod-desc')) document.getElementById('new-prod-desc').value = '';
}

/**
 * Dynamic input handler locking value to "100% Off" when Freebie discount type is selected.
 */
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

/**
 * Formats and saves a new discount rule entry.
 */
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

/**
 * Saves a new product category tag.
 */
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
