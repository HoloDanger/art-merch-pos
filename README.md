# 🎨 MaArtsy — POS & Event Manager (Art Merch POS)

> **Version:** `1.3.0` | **Architecture:** Modular Vanilla HTML5/CSS3/JS (ES6+) | **Potato Standard Compliant:** Minimal Memory Footprint (<1.5MB RSS), Zero External Runtime/Build Dependencies, 100% Local-First Computing.

**MaArtsy** is a specialized mobile Point-of-Sale (POS) and event management web application engineered for independent artists, merch exhibitors, illustrators, and boutique merchants selling at anime/comic conventions, art fairs, pop-up markets, and physical retail booths.

Built strictly according to the **Potato Standard**, it runs purely in standard web runtimes without node/npm frameworks, virtual DOM overhead, or cloud dependencies, delivering instant sub-20ms rendering and zero memory leaks.

---

## 🚀 Key Highlights & Capabilities

* **⚡ Ultra-Fast Touch POS:** 3-column touch-optimized catalog grid, real-time cart badge counter, live quantifier stepper controls (`+` / `-`), and sub-second checkout.
* **🏷️ Multi-Tier Discount Engine:** Configurable percentage discounts (e.g. *10% Student Discount*), fixed-price reductions (e.g. *₱25 Off Artist Pass*), and auto-locking 100% Off *Freebie Bundles*.
* **📊 Complete Shift Lifecycle & Cash Reconciliation:** Starting float capture, active shift toggling, End Shift summary review (Starting Float, Gross Sales, Discounts, Net Sales with semi-bold typography), and scrollable receipt audit trail.
* **🧾 Itemized Receipt History & Refund Management:** Detailed transaction inspection (`Receipt #1-001 | Date | Time | Payment | Amount`), line-item breakdown, and transaction refund management with visual status badges.
* **📦 Complete Inventory & Category Authority:** Dynamic sub-tab switcher for Products, Discounts, and Categories; live instant search and category filter (`#inv-prod-cat-filter`); product CRUD with HTML5 FileReader live image previews; and margin tracking (`Price` vs `Cost`).
* **📋 Event Preparation Checklist:** Pre-event operational task management with timestamps, category tags, completion strikethrough toggles, and soft-deletion.
* **🗑️ Isolated Trash Bin & Soft-Delete Recovery:** Dedicated recovery system supporting Products, Shifts, and Tasks with isolated category tabs (`All`, `Shifts`, `Products`, `Tasks`), per-item restore, per-item permanent wipe, and bulk purge.
* **📱 Mobile POS Viewport:** Pixel-accurate responsive mobile container (`max-width: 390px`) formatted for handheld smartphone and mobile terminal form factors.

---

## 📁 Repository & Codebase Structure

```
scratch/art_merch_pos/
├── index.html           # Semantic HTML5 skeleton, view sections, modals & SVG icons
├── README.md            # Technical specifications and operational documentation
├── css/
│   └── style.css        # Unified Design System tokens, typography, grid layouts, cards & modals
├── js/
│   ├── data.js          # Centralized State Management (products, discounts, categories, tasks, cart, receipts)
│   ├── pos.js           # POS grid rendering, cart quantity math, discount application & checkout
│   ├── inventory.js     # Inventory subtabs, product CRUD, discount rules & category managers
│   ├── shift.js         # Shift start/end, Shift Summary modal, Receipt History, Refunds & Product Tally
│   └── app.js           # Application Controller (tab routing, modals, trash bin, tasks & analytics)
├── fonts/               # Custom Typography (Offline local assets)
│   ├── Roca Two Black.ttf         # Headings, brand titles & modal headers
│   └── Onest-VariableFont_wght.ttf # UI body text, buttons, form controls & badges
└── images/              # Local demonstration assets & product thumbnails
    └── cat_sticker.png
```

---

## 🛠️ Architecture & Module Map

### 1. Central State Authority (`js/data.js`)
* `isShiftOpen` (`boolean`) — Boolean flag controlling whether the physical booth register is open or closed.
* `uploadedImageDataUrl` (`string|null`) — In-memory buffer storing base64 image data from HTML5 FileReader uploads.
* `products` (`Array<Object>`) — Catalog of merchandise items (`id`, `name`, `category`, `price`, `cost`, `stock`, `sold`, `img`).
* `discounts` (`Array<Object>`) — Configured discount rules (`Percent-based`, `Price-based`, `Freebie`).
* `categories` (`Array<string>`) — Product classification tags (`Stickers`, `Art Prints`, `Tote Bags`, `T-Shirts`, `Enamel Pins`).
* `tasks` (`Array<Object>`) — Event preparation checklist items (`id`, `name`, `type`, `date`, `time`, `done`).
* `cart` (`Array<Object>`) — Active checkout cart entries (`id`, `name`, `category`, `price`, `qty`).
* `shiftReceipts` (`Array<Object>`) — Chronological transaction log (`id`, `date`, `time`, `amount`, `payment`, `items`, `refunded`).
* `trashBin` (`Array<Object>`) — Multi-type soft-delete queue supporting restore and permanent destruction.
* `salesChartInstance` (`Chart|null`) — Chart.js canvas instance reference for revenue visualization.

### 2. POS Module (`js/pos.js`)
* `renderPosProducts()` — Generates the 3-column product catalog grid with top-right notification badges indicating cart quantity.
* `filterPosCategory(category, el)` — Filters POS items by category pill and toggles active UI states.
* `addToCart(id)` / `changePosCardQty(id, delta)` — Handles instant cart accumulation and decrementing.
* `renderCartModal()` — Renders cart items with black quantifier buttons (`-` and `+`), unit prices, and line totals.
* `applyDiscount()` / `renderCartTotals()` — Applies discount algorithm (percentage deduction, fixed subtraction, or freebie zero-out) and updates total amount.
* `processCheckout()` — Validates active shift, commits sale, increments product `sold` counts, logs new receipt to `shiftReceipts`, and resets cart.

### 3. Inventory Module (`js/inventory.js`)
* `switchInventorySubtabDropdown(val)` — Dispatches sub-views between Products, Discounts, and Categories.
* `filterInventoryProducts(searchVal)` — Performs real-time substring filtering across product names.
* `filterInventoryByCategory(category)` — Filters inventory list via `#inv-prod-cat-filter`.
* `openAddProductModal()` / `openEditProductModal(id)` — Manages product creation and update modals with live margin calculations (`Price - Cost`).
* `handleProductImageUpload(event)` — Triggers device image picker and reads files via `FileReader.readAsDataURL` for instant thumbnail preview.
* `handleDiscountCategoryChange()` / `saveNewDiscount()` — Configures discount rules, auto-locking Freebies to `100% Off`.
* `refreshCategoryDropdowns()` / `saveNewCategory()` — Dynamically syncs category tags across all product forms and filter select elements.
* `deleteInventoryItem(type, id)` — Dispatches item soft-deletion into `trashBin`.

### 4. Shift & Analytics Module (`js/shift.js`)
* `openStartShiftModal()` / `confirmStartShift()` — Opens register with starting cash float, toggling POS from closed view to active grid.
* `openTotalSalesModal()` — Renders Shift Review summary modal (Starting Cash, Gross Sales, Discounts, Net Sales with semi-bold typography).
* `renderShiftReceiptsList()` — Renders scrollable receipt history card list (`Receipt #1-001 | Date | Time | Payment | Amount`) with visual `Refunded` badges.
* `openReceiptDetailModal(id)` — Displays itemized breakdown of products, payment method, and total for any historical transaction.
* `refundReceipt(id)` — Marks transaction as refunded, updates totals, and preserves historical audit integrity.
* `openProductTallyModal()` / `filterProductTally()` — Full vertical viewport product tally with live search and category filters, tracking sold-to-stock ratios (`sold / stock`).
* `confirmEndShift()` — Closes the register and resets active POS view to closed status.

### 5. Application Controller & Utilities (`js/app.js`)
* `switchTab(tabId, el)` — Bottom navigation bar routing between POS (`sec-pos`), Inventory (`sec-inventory`), Event Prep (`sec-events`), Sales Report (`sec-sales`), and Settings (`sec-settings`).
* `renderTasks()` / `toggleTaskDone(id)` / `saveNewTask()` — Manages Event Prep checklist items with visual strikethrough states.
* `openTrashModal(filter)` — Renders Trash Bin with isolated category tabs (`All`, `Shifts`, `Products`, `Tasks`), preventing cross-category fallback leaks.
* `restoreTrashItem(index)` — Restores soft-deleted items back to active products, shifts, or tasks.
* `deleteTrashItemPermanently(index)` / `emptyAllTrash()` — Permanently purges items from memory with confirmation safeguards.
* `initSalesChart()` — Generates gross revenue bar chart visualizer.

---

## 🎨 Design System & Conventions

* **Typography:**
  * **Headings & Brand Titles:** `Roca Two Black` (Weight: 900, Serif) — applied to `h1`, `h2`, `h3`, `.page-header`, `.modal-title`, and `.brand-title`.
  * **UI Controls & Body Text:** `Onest` (Weight: 400–600, Sans-Serif) — applied to buttons, inputs, labels, cards, badges, and modal text.
* **Color Palette:**
  * Primary Accent: Gold Yellow (`#FDBE49`) | Hover: (`#E5A732`)
  * Dark Banner / Shift Header: `#383838`
  * Primary Text: `#222222` | Muted Text: `#666666`
  * Card Background: `#E2E8F0` | Canvas Background: `#4F555E`
  * Success / Active: `#10B981`
  * Danger / Delete / Refund: `#FF4D4D` / `#F93C3C`
* **Icons:** Dual-state Vuesax/Iconsax SVG vectors (`.vuesax-linear` and `.vuesax-bold` switching on active tab selection) + FontAwesome 6 icons.
* **Control Ergonomics:** High-contrast solid black (`#000000`) quantifier glyphs on `-` and `+` stepper buttons for high visibility under variable outdoor booth lighting.

---

## 🚀 Local Development & Execution

Because MaArtsy is built with zero build steps or bundlers, you can run it immediately with any static file server:

### 1. Clone the Repository
```bash
# Via SSH:
git clone git@github.com:HoloDanger/art-merch-pos.git
cd art-merch-pos

# Or via HTTPS:
git clone https://github.com:HoloDanger/art-merch-pos.git
cd art-merch-pos
```

### 2. Launch Local Server
```bash
# Python 3
python3 -m http.server 8080

# Or Node's npx serve (optional)
npx serve -l 8080 .

# Or standard Caddy / Nginx static hosting
```

Open `http://localhost:8080` in your mobile device or desktop browser (toggle Device Toolbar to **iPhone 14/15 Pro** / 390px width for the native mobile layout).

---

## 📜 License

Private Repository / Sovereign Asset. All rights reserved © 2026 HoloDanger.
