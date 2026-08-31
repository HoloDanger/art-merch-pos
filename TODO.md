# 📋 TODO BACKLOG: MaArtsy POS Client Feedback Refactoring

**Last Updated:** August 31, 2026  
**Status:** All Sprint 3 Items Complete  
**Target Files:** [index.html](file:///Users/lester/Archon/Genesis/20_Projects/sandbox/art_merch_pos/index.html), [css/style.css](file:///Users/lester/Archon/Genesis/20_Projects/sandbox/art_merch_pos/css/style.css), [js/](file:///Users/lester/Archon/Genesis/20_Projects/sandbox/art_merch_pos/js/)

---

## 1. COMPLETED SPRINT 3 ITEMS

* [x] **Ticket 1: Receipt History Management & Refund Flow**
  * **Feedback:** *"Receipt History: Merchants should supposedly access their receipt so that they can manage and refund a receipt."*
  * **Action Taken:** Enabled clicking historical receipt cards in Shift Summary (`shiftReceipts`) to open `#modal-receipt-detail` displaying itemized products, total amount, payment method, and a functional `Refund Transaction` button that updates stock metrics and displays a `Refunded` status badge.

* [x] **Ticket 2: Quantifier Button Color (Black Signage)**
  * **Feedback:** *"Quantifier Button: Add and minus sign should be black"*
  * **Action Taken:** Updated `-` and `+` quantifier button text and SVG stroke colors to solid black (`#000000`) across checkout cart items and modal controls.

* [x] **Ticket 3: Inventory Product Filter Dropdown**
  * **Feedback:** *"Inventory Product Dropdown: Missing and should be added"*
  * **Action Taken:** Added `#inv-prod-cat-filter` category dropdown inside the Inventory Products view, allowing merchants to filter inventory products by Category tag or view All Merch.

* [x] **Ticket 4: Shift Review Header & Detail Spacing**
  * **Feedback:** *"Shift Review Header and Detail Spacing: Must be near to each other and based on the original prototype spacing."*
  * **Action Taken:** Reduced vertical margins (`margin-bottom: 2px; padding-top: 4px;`) between summary labels and amounts in `#modal-total-sales` to match Figma mockup spacing.

* [x] **Ticket 5: Shift Closed Icon Match**
  * **Feedback:** *"Shift Closed Icon: Must base to the original mockup"*
  * **Action Taken:** Replaced generic clock SVG on `#pos-shift-closed-view` with the clean Vuesax clock vector matching the original Figma prototype mockup.

* [x] **Ticket 6: Trash Bin & Exit Vertical Placement**
  * **Feedback:** *"Trash Bin and Exit: Placements (icon and text vertical order) should be based on the original mockup"*
  * **Action Taken:** Standardized Trash and Exit button layouts across page headers and modals to use vertical column flex alignment (`display: inline-flex; flex-direction: column; align-items: center;`) with 2px icon-to-label spacing matching original Figma mockups.

* [x] **Ticket 7: Functional Product Image Upload**
  * **Feedback:** *"Add Image: Should be functional pero if matagal siyang gawin, kahit di na"*
  * **Action Taken:** Integrated a hidden `<input type="file" accept="image/*">` with FileReader API `readAsDataURL` on `.img-upload-box` in both `#modal-add-product` and `#modal-edit-product`, providing instant live photo previewing when adding or editing products.

---

## 2. COMPLETED SPRINT 2 ITEMS

* [x] **Item 1: Missing Per-Item Delete Button in Trash Modal** — Added permanent delete icon next to restore button.
* [x] **Item 2: Missing Header Icons in Trash Modal** — Added icons to Delete All and Exit header buttons.
* [x] **Item 3: Vertical Alignment for Inventory Sub-tabs** — Centered content vertically in inventory cards.
* [x] **Item 4: Missing Add Category Button** — Added `+ Add Category` button in product add/edit modals.
* [x] **Item 5: Category Dropdown Auto-Refresh** — Created `refreshCategoryDropdowns()` helper function.
* [x] **Item 6: Discount Input Auto-Formatting** — Locked Freebie to 100% Off and formatted % and ₱ values.
* [x] **Item 7: Declutter Product Cards** — Kept top-right yellow notification circle for active cart counts.
* [x] **Item 8: Cart Badge Count Placement** — Moved badge counter to **"See Receipt"** button.
* [x] **Item 9: Icon Audit Against Prototype** — Replaced FontAwesome with Vuesax/Iconsax SVG vectors.
* [x] **Item 10: Roca Two Black Page Headings** — Updated `h2.page-header` titles to Roca Two Black typography.
* [x] **Item 11: Shift Summary Receipt History List** — Integrated scrollable list of receipts with `Receipt #1-001 | Date | Time | Amount`.
* [x] **Item 12: Inventory Search Bar First** — Re-ordered search bar above category select dropdown.
* [x] **Item 13: Full-Screen Product Tally** — Removed hardcoded height caps so list fills 100% vertical screen height (`flex: 1`).
* [x] **Item 14: Semi-Bold Net Sales** — Set `font-weight: 600` for Net Sales row in Shift Summary modal.

---

## 3. COMPLETED SPRINT 1 ITEMS (ARCHIVE)

* [x] **Base64 Roca Font Embedding:** Embedded `Roca Two Black.ttf` directly into style tags.
* [x] **FontAwesome Icon Restoration:** Added `font-weight: 900 !important;` for `.fa-solid, .fas`.
* [x] **Figma Color Scheme:** Set main yellow accent to `#FDBE49`.
