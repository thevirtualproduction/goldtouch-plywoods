// script.js

// Product data (could be fetched from a JSON file)
const PRODUCTS = [
  { id: 1, name: "Wireless Headphones", price: 59.99, image: "images/headphones.jpg" },
  { id: 2, name: "Smart Watch", price: 99.99, image: "images/smartwatch.jpg" },
  { id: 3, name: "Bluetooth Speaker", price: 39.99, image: "images/speaker.jpg" },
  { id: 4, name: "Fitness Tracker", price: 29.99, image: "images/tracker.jpg" },
  { id: 5, name: "VR Headset", price: 149.99, image: "images/vr.jpg" },
  { id: 6, name: "Portable Charger", price: 19.99, image: "images/charger.jpg" }
];

// --- Cart Logic ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(id) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id, qty: 1 });
  saveCart(cart);
  alert('Added to cart!');
  updateCartCount();
}
function removeFromCart(id) {
  let cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function updateQty(id, qty) {
  let cart = getCart();
  let item = cart.find(i => i.id === id);
  if (item) item.qty = qty;
  saveCart(cart);
  renderCart();
  updateCartCount();
}
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

// --- Render Products (for products.html) ---
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

// --- Render Cart (for cart.html) ---
function renderCart() {
  const table = document.getElementById('cart-table-body');
  const totalEl = document.getElementById('cart-total');
  if (!table || !totalEl) return;
  const cart = getCart();
  let total = 0;
  table.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(p => p.id === item.id);
    const subtotal = p.price * item.qty;
    total += subtotal;
    return `
      <tr>
        <td><img src="${p.image}" alt="${p.name}"></td>
        <td>${p.name}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${item.qty}" style="width:50px"
            onchange="updateQty(${item.id}, this.valueAsNumber)">
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td><button onclick="removeFromCart(${item.id})">Remove</button></td>
      </tr>
    `;
  }).join('');
  totalEl.textContent = '$' + total.toFixed(2);
  if (cart.length === 0) {
    table.innerHTML = `<tr><td colspan="6" style="text-align:center">Your cart is empty.</td></tr>`;
  }
}

// --- On page load ---
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  updateCartCount();
});
