// --- PRODUCT CATALOG (15 Items: 5 Shirts, 5 Pants, 5 Outerwear) ---
const products = [
    // SHIRTS (5 Items)
    { id: 1, name: "Heavyweight Boxy Tee", category: "shirts", price: 35.00, image: "images/shirt1.jpg", colors: ["#111111", "#FFFFFF", "#EBE5D8"] },
    { id: 2, name: "Relaxed Linen Shirt", category: "shirts", price: 55.00, image: "images/shirt2.jpg", colors: ["#FFFFFF", "#EBE5D8"] },
    { id: 3, name: "Structured Knit Polo", category: "shirts", price: 60.00, image: "images/shirt3.jpg", colors: ["#111111", "#EBE5D8"] },
    { id: 4, name: "Minimalist Poplin Shirt", category: "shirts", price: 65.00, image: "images/shirt4.jpg", colors: ["#FFFFFF", "#111111"] },
    { id: 5, name: "Acid Wash Vintage Tee", category: "shirts", price: 40.00, image: "images/shirt5.jpg", colors: ["#777777", "#111111"] },

    // PANTS (5 Items)
    { id: 6, name: "Pleated Wide Trouser", category: "pants", price: 75.00, image: "images/pants1.jpg", colors: ["#111111", "#EBE5D8"] },
    { id: 7, name: "Relaxed Cargo Denim", category: "pants", price: 85.00, image: "images/pants2.jpg", colors: ["#111111", "#777777"] },
    { id: 8, name: "Cropped Wool Slacks", category: "pants", price: 90.00, image: "images/pants3.jpg", colors: ["#111111"] },
    { id: 9, name: "Drawstring Lounge Pant", category: "pants", price: 65.00, image: "images/pants4.jpg", colors: ["#EBE5D8", "#FFFFFF"] },
    { id: 10, name: "Utility Canvas Pant", category: "pants", price: 80.00, image: "images/pants5.jpg", colors: ["#EBE5D8", "#777777"] },

    // OUTERWEAR (5 Items)
    { id: 11, name: "Cropped Nylon Zip Jacket", category: "outerwear", price: 110.00, image: "images/outerwear1.jpg", colors: ["#111111", "#777777"] },
    { id: 12, name: "Heavyweight Wool Overshirt", category: "outerwear", price: 130.00, image: "images/outerwear2.jpg", colors: ["#EBE5D8", "#111111"] },
    { id: 13, name: "Minimalist Trench Coat", category: "outerwear", price: 180.00, image: "images/outerwear3.jpg", colors: ["#EBE5D8"] },
    { id: 14, name: "Puffer Vest", category: "outerwear", price: 120.00, image: "images/outerwear4.jpg", colors: ["#111111", "#FFFFFF"] },
    { id: 15, name: "Structured Boxy Blazer", category: "outerwear", price: 160.00, image: "images/outerwear5.jpg", colors: ["#111111"] }
    {id: 15, name: "Structured Boxy Blazer", category: "outerwear", price: 160.00, image: "images/outerwear5.jpg", colors: ["#111111"]},
    {
        id: 16,
        name: "Men's Heavy Corduroy Shirt Long Sleeve Shirt",
        category: "outerwear",
        price: 19.99,
        image: "https://cc-west-usa.oss-us-west-1.aliyuncs.com/cjdropshipping/25/25012107/2501210736421612000_0.jpg",
        cjProductId: "2501210736421612000",
        cjVariantId: "CJDS227599515OL"
    }
];

let cart = [];
let currentFilter = 'all';

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartOverlay = document.getElementById('cart-overlay');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const heroTitle = document.getElementById('hero-title');

// Submenu Toggle Logic
const toggleCatBtn = document.getElementById('toggle-categories');
const categoriesSubmenu = document.getElementById('categories-submenu');

if (toggleCatBtn) {
    toggleCatBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        categoriesSubmenu.classList.toggle('open');
    });
}

// Filter Function
window.filterProducts = function(category) {
    currentFilter = category;
    if(category === 'all') {
        heroTitle.textContent = "All Products";
    } else {
        heroTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    renderProducts();
    if(window.innerWidth <= 768) {
        sidebar.classList.remove('active'); // Close sidebar on mobile after clicking
    }
}

// Render Products
function renderProducts() {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === currentFilter);

    filteredProducts.forEach(product => {
        let colorCirclesHTML = '';
        if(product.colors && product.colors.length > 0) {
            colorCirclesHTML = '<div class="color-swatches">';
            product.colors.forEach(color => {
                colorCirclesHTML += `<span class="swatch" style="background-color: ${color};"></span>`;
            });
            colorCirclesHTML += '</div>';
        }

        const productEl = document.createElement('div');
        productEl.className = 'product-card';
        productEl.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'500\\' style=\\'background:%23F4F1EA\\'></svg>';">
            
            <div class="product-info-header">
                <h3>${product.name}</h3>
                <p class="price">$${product.price.toFixed(2)}</p>
            </div>
            
            ${colorCirclesHTML}
            
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsContainer.appendChild(productEl);
    });
}

// Cart Logic
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    if (cartOverlay) cartOverlay.classList.add('active');
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p style="color: var(--gray); font-size: 0.85rem;">$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
            <p style="font-weight: 500;">$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    if (cartCount) cartCount.textContent = count;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
}

// General UI Event Listeners
if (cartBtn && cartOverlay) {
    cartBtn.addEventListener('click', () => cartOverlay.classList.add('active'));
}
if (closeCartBtn && cartOverlay) {
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
}
if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
        if (e.target === cartOverlay) cartOverlay.classList.remove('active');
    });
}
if(openSidebarBtn) openSidebarBtn.addEventListener('click', () => sidebar.classList.add('active'));
if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('active'));

// Bulletproof Stripe Checkout Redirection Handler
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Redirects straight to your Stripe test payment link
            window.location.assign("https://buy.stripe.com/test_aFa4gzc64bbagTybiK2oE00");
        });
    }
});

// Init
renderProducts();
