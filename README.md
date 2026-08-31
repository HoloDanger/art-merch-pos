# 🎨 MaArtsy — POS & Event Manager (Art Merch POS)

> **Version:** `1.2.0` | **Architecture:** Modular Vanilla HTML5/CSS3/JS | **Potato Standard Compliant:** Low RAM (<1.5MB RSS), zero external framework dependencies, local-first computing.

MaArtsy is a specialized mobile Point-of-Sale (POS) and event management web application tailored for independent artists, merch exhibitors, and pop-up retail merchants selling at art fairs, conventions, and boutique stores.

---

## 📁 Repository & Codebase Structure

```
art_merch_pos/
├── index.html           # Main semantic HTML skeleton loading CSS & JS modules
├── css/
│   └── style.css        # Unified Design System tokens, typography, grid layouts, cards, modals & nav
├── js/
│   ├── data.js          # Centralized State Management (products, discounts, categories, cart, shiftReceipts)
│   ├── pos.js           # POS grid rendering, cart quantity math, discount application & checkout
│   ├── inventory.js     # Inventory subtab dropdown, product CRUD, discount & category managers
│   ├── shift.js         # Shift start/end, Shift Summary modal, Receipt History & Product Tally
│   └── app.js           # Application Controller (tab routing, modal toggles, trash bin, chart & onboarding)
├── fonts/               # Custom Typography (Roca Two Black for headings, Onest for body & UI)
│   ├── Roca Two Black.ttf
│   └── Onest-VariableFont_wght.ttf
└── images/              # Local demonstration assets & thumbnails
```

---

## 🛠️ Architecture & Module Map

### 1. State Management (`js/data.js`)
* `isShiftOpen` *(boolean)* — Tracks whether physical booth shift is active or closed.
* `products` *(Array<Object>)* — Catalog of merchandise items (`id`, `name`, `category`, `price`, `cost`, `stock`, `sold`, `img`).
* `discounts` *(Array<Object>)* — Configured discount rules (`Percent-based`, `Price-based`, `Freebie`).
* `categories` *(Array<string>)* — Product classification tags (`Stickers`, `Art Prints`, `Tote Bags`, etc.).
* `cart` *(Array<Object>)* — Active checkout cart items (`id`, `qty`).
* `shiftReceipts` *(Array<Object>)* — Log of completed transactions (`id`, `date`, `time`, `amount`).
* `trashBin` *(Array<Object>)* — Soft-deleted items pending restore or permanent erasure.

### 2. POS Module (`js/pos.js`)
* `renderPosProducts()` — Renders 3-column product grid with yellow badge counts for items in cart.
* `addToCart(id)` / `changePosCardQty(id, delta)` — Increments/decrements cart item quantities.
* `renderCartTotals()` — Calculates subtotal, applies selected discount rate, and updates total amount.
* `processCheckout()` — Finalizes sale, updates product `sold` metrics, logs receipt to `shiftReceipts`, and clears cart.

### 3. Inventory Module (`js/inventory.js`)
* `switchInventorySubtabDropdown(val)` — Switches between Products, Discounts, and Product Categories sub-views.
* `openEditProductModal(id)` / `saveEditedProduct()` — Enables instant editing of product details and price/cost margins.
* `handleDiscountCategoryChange()` / `saveNewDiscount()` — Handles 100% Off auto-lock for Freebies, percentage discounts, and fixed peso discounts.
* `deleteInventoryItem(type, id)` — Soft-deletes products/discounts/categories into `trashBin`.

### 4. Shift & Analytics Module (`js/shift.js`)
* `openTotalSalesModal()` — Displays Shift Summary (Starting Cash, Gross Sales, Discounts, Net Sales).
* `renderShiftReceiptsList()` — Renders scrollable receipt history card list (`Receipt #1-001 | 01/11/2025 4:44pm | ₱100.00`).
* `openProductTallyModal()` / `filterProductTally()` — Full vertical screen product tally with search bar, Category dropdown, and stock ratio (`sold/stock`).

### 5. Application Controller (`js/app.js`)
* `switchTab(tabId, el)` — Bottom navigation bar routing between POS, Inventory, Event Prep, Sales Report, and Settings.
* `openTrashModal()` / `restoreTrashItem()` / `emptyAllTrash()` — Comprehensive soft-delete recovery system.
* `initSalesChart()` — Chart.js gross revenue visualizer.

---

## 🎨 Design System & Conventions

* **Typography:** 
  * Headings (`h1`, `h2`, `h3`, `.modal-title`, `.brand-title`): `Roca Two Black` (Weight 900)
  * UI Elements (Buttons, inputs, body text, badges): `Onest` (Weight 400–600)
* **Color Palette:**
  * Accent Primary: Gold Yellow (`#FDBE49`)
  * Dark Banner: `#383838`
  * Text Main: `#222222`
  * Success Green: `#10b981`
  * Danger Red: `#ff4d4d`
* **Icons:** Vuesax / Iconsax SVG vectors (`.vuesax-linear` & `.vuesax-bold` dual SVG active tab toggles) + FontAwesome 6 icons.

---

## 🚀 Local Development & Deployment

```bash
# Clone repository
git clone git@github.com:YOUR_USERNAME/art-merch-pos.git
cd art-merch-pos

# Open index.html in any browser or launch local HTTP server
python3 -m http.server 8080

# Push updates to trigger GitHub Pages auto-deployment
git add .
git commit -m "Update feature"
git push
```
