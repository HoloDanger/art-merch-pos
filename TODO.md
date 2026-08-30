# 📋 TODO BACKLOG: MaArtsy POS Client Feedback Refactoring (Sprint 2)

**Date Logged:** August 30, 2026  
**Status:** Completed  
**Target File:** [art_merch_pos/index.html](file:///Users/lester/Archon/Genesis/20_Projects/sandbox/art_merch_pos/index.html)

---

## 1. COMPLETED SPRINT 1 ITEMS (ARCHIVE)
* [x] **Base64 Roca Font Embedding:** Embedded `Roca Two Black.ttf` directly into style tags.
* [x] **FontAwesome Icon Restoration:** Added `font-weight: 900 !important;` for `.fa-solid, .fas`.
* [x] **Figma Color Scheme:** Set main yellow accent to `#FDBE49`.

---

## 2. COMPLETED SPRINT 2 ITEMS

### 🔴 Item 1: Missing Per-Item Delete Button in Trash Modal
* **Verbatim Feedback:** *"nawala delete button for a specific item sa trash"*
* **Action Taken:** Added a permanent delete icon (`<i class="fa-solid fa-trash-can" style="color:var(--danger-red);"></i>`) next to the restore icon in `openTrashModal()` + `permanentlyDeleteTrashItem(idx)`.
* **Status:** `[x] Complete`

---

### 🔴 Item 2: Missing Header Icons in Trash Modal
* **Verbatim Feedback:** *"nawala icons ng delete all pati exit sa trash"*
* **Action Taken:** Added FontAwesome icons to Trash Modal header buttons:
  - `Delete All` -> `<i class="fa-solid fa-trash-can"></i> Delete All`
  - `Exit` -> `<i class="fa-solid fa-xmark"></i> Exit`
* **Status:** `[x] Complete`

---

### 🟡 Item 3: Vertical Alignment for Inventory Sub-tabs
* **Verbatim Feedback:** *"mas maganda idea mo sa products discounts produc categories pero igitna nalang yung product and discounts vertically"*
* **Action Taken:** Applied vertical centering (`display: flex; align-items: center; justify-content: space-between;`) across all list cards in Products, Discounts, and Categories sub-tabs.
* **Status:** `[x] Complete`

---

### 🔴 Item 4: Missing "Add Category" Button in Product Modals
* **Verbatim Feedback:** *"nawala add category function sa per product detail & add product page"*
* **Action Taken:** Added a `+ Add Category` button next to the category select dropdown in both `#modal-add-product` and `#modal-edit-product`.
* **Status:** `[x] Complete`

---

### 🔴 Item 5: Newly Added Categories Not Updating Dropdowns
* **Verbatim Feedback:** *"di nagrereflect yung added category ko doon sa dropdown"*
* **Action Taken:** Created `refreshCategoryDropdowns()` helper function to dynamically refresh all category dropdowns when categories are created or deleted.
* **Status:** `[x] Complete`

---

### 🟡 Item 6: Discount Input Rules & Auto-Formatting
* **Verbatim Feedback:** *"freebie should automatically be 100%, percent as percent-only text and price as number price only"*
* **Action Taken:** Auto-lock value to `100% Off` when category is "Freebie", and format "Percent-based" as `% Off` and "Price-based" as `₱` numeric values.
* **Status:** `[x] Complete`

---

### 🟡 Item 7: Declutter Product Cards (Notification Badge Only)
* **Verbatim Feedback:** *"maganda idea na malagay yung minus and plus per product, kaso ang cluttered tingnan. best din if yung notif circle nalang"*
* **Action Taken:** Removed inline `-`/`+` banner buttons from product cards to restore clean Figma design, while retaining top-right yellow notification circle for active cart counts.
* **Status:** `[x] Complete`

---

### 🔴 Item 8: Move Quantity Counter Badge from "See Total Sales" to "See Receipt"
* **Verbatim Feedback:** *"yung number nasa see total sales imbis na dapat sa see receipt"*
* **Action Taken:** Placed `<span class="btn-circle-badge" id="cart-badge-count">0</span>` inside **"See Receipt"** button, keeping **"See Total Sales"** clean text.
* **Status:** `[x] Complete`

---

### 🟡 Item 9: Audit All Icons Against Original Figma Prototype
* **Verbatim Feedback:** *"yung icons base sana doon sa original prototype"*
* **Action Taken:** Audited and verified all icons across headers, POS grid, search boxes, nav bar, and modals against original Figma prototypes.
* **Status:** `[x] Complete`

---

## 3. RECAP OF SPRINT 2 COMPLETED TASKS

1. [x] **Add per-item permanent delete button** in Trash modal.
2. [x] **Add icons to Trash modal header buttons** (Delete All & Exit).
3. [x] **Vertically center items** in Inventory sub-tab cards.
4. [x] **Add "+ Add Category" button** in Product Add & Edit modals.
5. [x] **Auto-refresh category dropdowns** when a new category is saved.
6. [x] **Auto-format discounts:** Freebie = 100%, Percent-based = % text, Price-based = ₱ number.
7. [x] **Declutter product cards:** Remove `-` / `+` banner buttons, keep yellow top-right notification circle.
8. [x] **Move badge counter:** Place circular count badge on **"See Receipt"** button instead of "See Total Sales".
9. [x] **Audit all FontAwesome icons** against original Figma screens.
