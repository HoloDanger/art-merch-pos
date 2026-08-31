/**
 * @file data.js
 * @description Centralized State Management for MaArtsy POS & Event Manager.
 * Holds initial data models for products, discounts, categories, tasks, cart, and receipts.
 */

/** @type {boolean} Tracks whether the booth's physical shift is currently active */
let isShiftOpen = true;

/** @type {string|null} Temporary image Data URL for custom product uploads */
let uploadedImageDataUrl = null;

/** 
 * @type {Array<{id: number, name: string, category: string, price: number, cost: number, stock: number, sold: number, img: string}>}
 * Primary product catalog
 */
let products = [
  { id: 1, name: 'Cat Vinyl Sticker', category: 'Stickers', price: 50, cost: 15, stock: 120, sold: 48, img: 'images/cat_sticker.png' },
  { id: 2, name: 'Cyberpunk Print (A4)', category: 'Art Prints', price: 350, cost: 100, stock: 25, sold: 14, img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Floral Tote Bag', category: 'Tote Bags', price: 650, cost: 250, stock: 18, sold: 9, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Graphic Tee (L)', category: 'T-Shirts', price: 850, cost: 350, stock: 15, sold: 6, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Holo Sticker Pack', category: 'Stickers', price: 180, cost: 50, stock: 60, sold: 22, img: 'images/cat_sticker.png' },
  { id: 6, name: 'Sunset Print (A3)', category: 'Art Prints', price: 500, cost: 180, stock: 12, sold: 5, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80' }
];

/** 
 * @type {Array<{id: number, name: string, category: string, val: string}>}
 * Active promotion rules
 */
let discounts = [
  { id: 1, name: 'Student Discount', category: 'Percent-based', val: '10% Off' },
  { id: 2, name: 'Artist Pass', category: 'Price-based', val: '₱25 Off' },
  { id: 3, name: 'Freebie Bundle', category: 'Freebie', val: '100% Off' }
];

/** @type {Array<string>} Merchandise category tags */
let categories = ['Stickers', 'Art Prints', 'Tote Bags', 'T-Shirts', 'Enamel Pins'];

/** 
 * @type {Array<{id: number, name: string, type: string, date: string, time: string, done: boolean}>}
 * Event preparation checklist tasks
 */
let tasks = [
  { id: 1, name: 'Booth Table Setup & Signage', type: 'Booth Setup', date: 'Aug. 9, 2026', time: '10:00 am', done: true },
  { id: 2, name: 'Inventory Count & Tagging', type: 'Inventory Restock', date: 'Aug. 9, 2026', time: '10:00 am', done: true },
  { id: 3, name: 'Deliver Restock via Lalamove', type: 'Delivery', date: 'Aug. 9, 2026', time: '10:00 am', done: false }
];

/** @type {Array<{id: number, name: string, category: string, price: number, qty: number}>} Active checkout cart */
let cart = [];

/** @type {Array<{id: number, name: string, datetime: string, price: string}>} Soft-deleted shifts queue */
let trashBin = [
  { id: 1, name: 'Shift 1', datetime: 'Aug. 8, 2026 | 4:29 PM', price: '₱12,400.00' },
  { id: 2, name: 'Shift 2', datetime: 'Aug. 1, 2026 | 6:15 PM', price: '₱9,850.00' }
];

/** 
 * @type {Array<{id: string, date: string, time: string, amount: number, payment: string, items: Array<Object>, refunded: boolean}>}
 * Completed shift transaction receipts with refund management state
 */
let shiftReceipts = [
  { id: '1-001', date: '01/11/2025', time: '4:44pm', amount: 100.00, payment: 'GCash', items: [{ name: 'Cat Vinyl Sticker', qty: 2, price: 50 }], refunded: false },
  { id: '1-002', date: '01/11/2025', time: '4:52pm', amount: 250.00, payment: 'Cash', items: [{ name: 'Holo Sticker Pack', qty: 1, price: 180 }, { name: 'Cat Vinyl Sticker', qty: 1, price: 50 }], refunded: false },
  { id: '1-003', date: '01/11/2025', time: '5:15pm', amount: 480.00, payment: 'Maya', items: [{ name: 'Cyberpunk Print (A4)', qty: 1, price: 350 }], refunded: false },
  { id: '1-004', date: '01/11/2025', time: '5:30pm', amount: 285.00, payment: 'Cash', items: [{ name: 'Sunset Print (A3)', qty: 1, price: 500 }], refunded: false }
];

/** @type {Chart|null} Global reference to Chart.js instance */
let salesChartInstance = null;
