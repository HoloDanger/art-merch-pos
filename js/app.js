/**
 * @file app.js
 * @description Main application controller, tab navigation, modal handlers, Event Prep checklist, Trash Bin, and Chart.js analytics.
 */

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', () => {
  refreshCategoryDropdowns();
  renderPosProducts();
  renderInventoryProducts();
  renderDiscounts();
  renderCategories();
  renderTasks();
  renderSalesShifts();
  initSalesChart();
  updateCartBadgeAndTotalSalesCount();
});

// ================= NAVIGATION & MODAL HELPERS =================

/**
 * Closes all open modal overlays across the application.
 */
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
}

/**
 * Switches the active section tab in the bottom navigation bar.
 * @param {string} tabId - Target tab identifier ('pos', 'inventory', 'events', 'sales', 'settings')
 * @param {HTMLElement} [el] - Triggering navigation element
 */
function switchTab(tabId, el) {
  closeAllModals();
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const sec = document.getElementById(`sec-${tabId}`);
  if (sec) sec.classList.add('active');
  if (el) el.classList.add('active');
}

/**
 * Closes an active modal by element ID.
 * @param {string} id - Modal element ID
 */
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('active');
}

// ================= EVENT PREP CHECKLIST LOGIC =================

/** Renders the Event Preparation checklist tasks */
function renderTasks() {
  const container = document.getElementById('tasks-list');
  if (!container) return;
  container.innerHTML = tasks.map(t => `
    <div class="list-card" style="${t.done ? 'opacity:0.6;' : ''}">
      <div style="display:flex; align-items:center; gap:10px;">
        <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskDone(${t.id})" style="width:18px; height:18px; cursor:pointer;">
        <div>
          <div style="font-weight:700; ${t.done ? 'text-decoration:line-through;' : ''}">${t.name}</div>
          <div style="font-size:0.78rem; color:var(--text-muted);">${t.date}, ${t.time} • ${t.type}</div>
        </div>
      </div>
      <span style="color:var(--danger-red); cursor:pointer; display:inline-flex; align-items:center;" onclick="deleteTask(${t.id})"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14M10.33 16.5H13.67M9.5 12.5H14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
  `).join('');
}

/** Toggles task completion state */
function toggleTaskDone(id) {
  const t = tasks.find(x => x.id === id);
  if (t) t.done = !t.done;
  renderTasks();
}

/** Moves task to Trash Bin */
function deleteTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t && confirm(`Move task "${t.name}" to trash?`)) {
    trashBin.push({ type: 'Task', name: t.name });
    tasks = tasks.filter(x => x.id !== id);
    renderTasks();
  }
}

/** Opens Add Task modal */
function openAddTaskModal() { document.getElementById('modal-add-task').classList.add('active'); }

/** Saves a new event preparation task */
function saveNewTask() {
  const name = document.getElementById('new-task-name').value.trim();
  const type = document.getElementById('new-task-type').value;
  const time = document.getElementById('new-task-time').value || '10:00 am';
  if (!name) { alert('Please enter a task name'); return; }

  tasks.push({ id: Date.now(), name, type, date: 'Aug. 9, 2026', time, done: false });
  renderTasks();
  closeModal('modal-add-task');
  document.getElementById('new-task-name').value = '';
}

/** Opens Calendar modal */
function openCalendarModal() { document.getElementById('modal-calendar').classList.add('active'); }

// ================= SALES REPORT & ANALYTICS =================

/** Renders past sales shift records list */
function renderSalesShifts() {
  const container = document.getElementById('sales-shifts-list');
  if (!container) return;
  container.innerHTML = `
    <div class="list-card">
      <div>
        <div style="font-weight:700;">Shift 1 (Aug 1 - Aug 8)</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">48 items sold • ₱14,250.00 Net</div>
      </div>
      <span class="badge-pill badge-green">Closed</span>
    </div>
    <div class="list-card">
      <div>
        <div style="font-weight:700;">Current Booth Shift</div>
        <div style="font-size:0.8rem; color:var(--text-muted);">Shift Opened: Aug 9, 10:00am</div>
      </div>
      <span class="badge-pill badge-yellow">Active</span>
    </div>
  `;
}

/** Initializes Chart.js gross revenue visualizer */
function initSalesChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  salesChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Aug 31'],
      datasets: [{
        label: 'Gross Sales (₱)',
        data: [400, 1200, 800, 2400, 1800, 2365],
        borderColor: '#FDBE49',
        backgroundColor: 'rgba(253, 190, 73, 0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

/** Updates chart timeframe dataset (Monthly vs Yearly) */
function updateSalesChartPeriod(val) {
  if (!salesChartInstance) return;
  if (val.includes('year')) {
    salesChartInstance.data.labels = ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'];
    salesChartInstance.data.datasets[0].data = [5000, 12000, 18000, 24000, 31000, 42000];
  } else {
    salesChartInstance.data.labels = ['Aug 1', 'Aug 8', 'Aug 15', 'Aug 22', 'Aug 29', 'Aug 31'];
    salesChartInstance.data.datasets[0].data = [400, 1200, 800, 2400, 1800, 2365];
  }
  salesChartInstance.update();
}

// ================= TRASH BIN & SOFT DELETE RECOVERY =================

function openInventoryTrashModal() { openTrashModal('Inventory'); }
function openSalesTrashModal() { openTrashModal('Sales Report'); }
function openTaskTrashModal() { openTrashModal('Event Prep'); }

let activeTrashFilter = 'all';

/**
 * Opens Trash Bin modal and lists soft-deleted items based on filter ('inventory' | 'sales' | 'all').
 * @param {string} [filter] - Filter section tag
 */
function openTrashModal(filter = 'all') {
  activeTrashFilter = filter;
  const container = document.getElementById('trash-items-container');
  const titleEl = document.getElementById('trash-modal-title');
  if (!container) return;

  if (titleEl) {
    if (filter === 'inventory') titleEl.innerText = 'Inventory Trash';
    else if (filter === 'sales') titleEl.innerText = 'Sales Trash';
    else titleEl.innerText = 'Trash';
  }

  let filtered = trashBin;
  if (filter === 'inventory') {
    filtered = trashBin.filter(item => item.itemType === 'product' || item.itemType === 'discount' || item.itemType === 'category');
  } else if (filter === 'sales') {
    filtered = trashBin.filter(item => item.itemType === 'shift');
  }

  if (!filtered || filtered.length === 0) {
    filtered = trashBin;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding:24px 0;">Trash is empty.</p>`;
  } else {
    container.innerHTML = filtered.map((item) => {
      const realIdx = trashBin.findIndex(t => t.id === item.id);
      return `
        <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px; margin-bottom:8px;">
          <div>
            <div style="font-weight:700; font-size:0.92rem;">${item.name}</div>
            <div style="font-size:0.78rem; color:var(--text-muted);">${item.datetime || 'Aug. 9, 2026 | 4:29 PM'}</div>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-weight:400; font-size:0.95rem; color:#111111;">${item.price || ''}</span>
            <div style="display:flex; align-items:center; gap:8px;">
              <!-- Yellow Restore Button (#FDBE49 background with black icon) -->
              <button onclick="restoreTrashItem(${realIdx})" style="background:#FDBE49; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" title="Restore Item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="5" stroke="#000000" stroke-width="1.8"/>
                  <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C13.8 16 15.31 14.81 15.8 13.18" stroke="#000000" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M8 9.5V12H10.5" stroke="#000000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <!-- Red Delete Button (#F93C3C background with white icon) -->
              <button onclick="permanentlyDeleteTrashItem(${realIdx})" style="background:#F93C3C; border:none; border-radius:8px; width:32px; height:32px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center;" title="Delete Permanently">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M18.85 9.14L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79C6 22 5.91 20.78 5.8 19.21L5.15 9.14" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                  <path d="M10.33 16.5H13.67M9.5 12.5H14.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  document.getElementById('modal-trash').classList.add('active');
}

/** Restores item from Trash Bin */
function restoreTrashItem(idx) {
  const item = trashBin[idx];
  if (!item) return;
  if (item.itemType === 'product' && item.itemData) {
    products.push(item.itemData);
    renderInventoryProducts();
    renderPosProducts();
  }
  alert(`Restored ${item.name}!`);
  trashBin.splice(idx, 1);
  openTrashModal(activeTrashFilter);
}

/** Permanently deletes item from Trash Bin */
function permanentlyDeleteTrashItem(idx) {
  if (confirm(`Permanently delete "${trashBin[idx].name}" from trash? This action cannot be undone.`)) {
    trashBin.splice(idx, 1);
    openTrashModal(activeTrashFilter);
  }
}

/** Empties entire Trash Bin queue */
function emptyAllTrash() {
  if (trashBin.length === 0) {
    alert('Trash is already empty!');
    return;
  }
  if (confirm('Are you sure you want to permanently delete all items in the trash?')) {
    trashBin = [];
    openTrashModal();
  }
}

// ================= INTEGRATIONS & ONBOARDING =================

/** Opens Spreadsheet & App Integration modal */
function openSpreadsheetIntegrationModal() {
  const container = document.getElementById('integrations-list-content');
  if (!container) return;
  document.getElementById('integration-modal-title').innerText = 'App Integrations';
  container.innerHTML = `
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#10b981"/><path d="M7 8H17M7 12H17M7 16H17M11 8V16" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span style="font-weight:700;">Google Sheets</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#059669"/><path d="M8 8L16 16M16 8L8 16" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/></svg>
        <span style="font-weight:700;">Microsoft Excel</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#1e293b"/><path d="M8 7V17L12 11V17L16 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-weight:700;">Notion</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
  `;
  document.getElementById('modal-integrations').classList.add('active');
}

/** Opens E-commerce Sales Integration modal */
function openEcomIntegrationModal() {
  const container = document.getElementById('integrations-list-content');
  if (!container) return;
  document.getElementById('integration-modal-title').innerText = 'App Integrations';
  container.innerHTML = `
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ea580c"/><path d="M6 9H18L17 19H7L6 9ZM9 9V7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7V9" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span style="font-weight:700;">Shopee</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#0284c7"/><path d="M12 7L16 11L12 15L8 11L12 7Z" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round"/></svg>
        <span style="font-weight:700;">Lazada</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
    <div class="list-card" style="display:flex; align-items:center; justify-content:space-between; padding:12px;">
      <div style="display:flex; align-items:center; gap:10px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" fill="#70b43c"/><path d="M8 9L10 6L14 6L16 9M6 9H18L17 19H7L6 9Z" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span style="font-weight:700;">Shopify</span>
      </div>
      <button class="btn-gold" style="width:auto; padding:6px 14px; margin:0;" onclick="alert('Connected!')">Connect</button>
    </div>
  `;
  document.getElementById('modal-integrations').classList.add('active');
}

/** Opens Onboarding Flow modal */
function openOnboardingModal() {
  renderOnboardingStep(1);
  document.getElementById('modal-onboarding').classList.add('active');
}

/** Renders specified step in Onboarding Flow */
function renderOnboardingStep(step) {
  const title = document.getElementById('onboarding-step-title');
  const content = document.getElementById('onboarding-step-content');
  if (!title || !content) return;

  if (step === 1) {
    title.innerText = 'Welcome to MaArtsy!';
    content.innerHTML = `
      <div style="text-align:center; padding:20px 0;">
        <div style="background:var(--accent-yellow); width:90px; height:90px; border-radius:24px; display:inline-flex; align-items:center; justify-content:center; font-size:3rem; margin-bottom:16px;">😊</div>
        <h1 class="onboarding-h1" style="font-size:1.8rem; margin-bottom:8px; text-align:center;">Welcome to MaArtsy!</h1>
        <p style="font-size:0.88rem; color:var(--text-muted); margin-bottom:24px;">Where POS in creative fields just got easier!</p>
        <button class="btn-gold" onclick="renderOnboardingStep(2)">Join the Club!</button>
        <button class="btn-gray" onclick="renderOnboardingStep(4)">Log In</button>
      </div>
    `;
  } else if (step === 2) {
    title.innerText = "Let's get started!";
    content.innerHTML = `
      <input type="text" class="form-control" placeholder="Business Name*">
      <input type="email" class="form-control" placeholder="Email Address*">
      <input type="text" class="form-control" placeholder="Phone Number">
      <input type="password" class="form-control" placeholder="Password*">
      <input type="password" class="form-control" placeholder="Retype Password">
      <button class="btn-gold" onclick="renderOnboardingStep(3)">Register Account</button>
      <button class="btn-gray" onclick="closeModal('modal-onboarding')">Cancel</button>
    `;
  } else if (step === 3) {
    title.innerText = 'Welcome to the Club!';
    content.innerHTML = `
      <div style="text-align:center; padding:30px 0;">
        <h1 class="onboarding-h1" style="font-size:1.8rem; margin-bottom:16px; text-align:center;">Welcome to the Club!</h1>
        <button class="btn-gold" onclick="closeModal('modal-onboarding')">Explore MaArtsy</button>
      </div>
    `;
  } else if (step === 4) {
    title.innerText = 'Welcome back!';
    content.innerHTML = `
      <input type="email" class="form-control" placeholder="Email Address">
      <input type="password" class="form-control" placeholder="Password">
      <button class="btn-gold" onclick="closeModal('modal-onboarding')">Log In</button>
      <button class="btn-gray" onclick="closeModal('modal-onboarding')">Cancel</button>
      <p style="text-align:center; font-size:0.8rem; color:#d97706; margin-top:10px; cursor:pointer;" onclick="renderOnboardingStep(5)">Forgot your password?</p>
    `;
  } else if (step === 5) {
    title.innerText = 'Forgot password?';
    content.innerHTML = `
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Please enter the email address registered to your account to reset password.</p>
      <input type="email" class="form-control" placeholder="Email Address">
      <button class="btn-gold" onclick="renderOnboardingStep(6)">Send Email Confirmation</button>
      <button class="btn-gray" onclick="closeModal('modal-onboarding')">Cancel</button>
    `;
  } else if (step === 6) {
    title.innerText = 'Change password';
    content.innerHTML = `
      <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:12px;">Please enter your new password. Make sure that it is easy for you to remember.</p>
      <input type="password" class="form-control" placeholder="New Password">
      <input type="password" class="form-control" placeholder="Retype New Password">
      <button class="btn-gold" onclick="closeModal('modal-onboarding')">Change Password</button>
      <button class="btn-gray" onclick="closeModal('modal-onboarding')">Cancel</button>
    `;
  }
}

/** Settings sub-page action dispatcher */
function openSettingsSubpage(sub) {
  if (sub === 'account') alert('Account Management Settings');
  else if (sub === 'integrations') openSpreadsheetIntegrationModal();
  else if (sub === 'payment') alert('Payment Methods Manager');
  else if (sub === 'notifications') alert('Notifications Toggles');
}
