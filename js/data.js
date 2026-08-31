// ================= STATE MANAGEMENT =================
let isShiftOpen = true;

let products = [
  { id: 1, name: 'Cat Vinyl Sticker', category: 'stickers', price: 50, cost: 15, stock: 120, sold: 48, img: 'images/cat_sticker.png' },
  { id: 2, name: 'Cyberpunk Print (A4)', category: 'prints', price: 350, cost: 100, stock: 25, sold: 14, img: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Floral Tote Bag', category: 'totes', price: 650, cost: 250, stock: 18, sold: 9, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Graphic Tee (L)', category: 'shirts', price: 850, cost: 350, stock: 15, sold: 6, img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Holo Sticker Pack', category: 'stickers', price: 180, cost: 50, stock: 60, sold: 22, img: 'images/cat_sticker.png' },
  { id: 6, name: 'Sunset Print (A3)', category: 'prints', price: 500, cost: 180, stock: 12, sold: 5, img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80' }
];

let discounts = [
  { id: 1, name: 'Student Discount', category: 'Percent-based', val: '10% Off' },
  { id: 2, name: 'Artist Pass', category: 'Price-based', val: '₱25 Off' },
  { id: 3, name: 'Freebie Bundle', category: 'Freebie', val: '100% Off' }
];

let categories = ['Stickers', 'Art Prints', 'Tote Bags', 'T-Shirts', 'Enamel Pins'];

let tasks = [
  { id: 1, name: 'Booth Table Setup & Signage', type: 'Booth Setup', date: 'Aug. 9, 2026', time: '10:00 am', done: true },
  { id: 2, name: 'Inventory Count & Tagging', type: 'Inventory Restock', date: 'Aug. 9, 2026', time: '10:00 am', done: true },
  { id: 3, name: 'Deliver Restock via Lalamove', type: 'Delivery', date: 'Aug. 9, 2026', time: '10:00 am', done: false }
];

let cart = [];
let trashBin = [];
let shiftReceipts = [
  { id: '1-001', date: '01/11/2025', time: '4:44pm', amount: 100.00 },
  { id: '1-002', date: '01/11/2025', time: '4:52pm', amount: 250.00 },
  { id: '1-003', date: '01/11/2025', time: '5:15pm', amount: 480.00 },
  { id: '1-004', date: '01/11/2025', time: '5:30pm', amount: 285.00 }
];
let salesChartInstance = null;
