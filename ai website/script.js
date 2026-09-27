// Sample products data array as a fallback
let products = [
    { id: 1, name: "Minimalist Heavyweight Tee", category: "shirts", price: 45.00, image: "images/shirt1.jpg", colors: ["#111111", "#EBE5D8", "#708090"] },
    { id: 2, name: "Structured Linen Overshirt", category: "outerwear", price: 120.00, image: "images/outerwear1.jpg", colors: ["#EBE5D8", "#2F4F4F"] },
    { id: 3, name: "Tailored Pleated Trousers", category: "pants", price: 140.00, image: "images/pants1.jpg", colors: ["#111111", "#36454F"] },
    { id: 4, name: "Relaxed Fit Cotton Hoodie", category: "outerwear", price: 95.00, image: "images/outerwear2.jpg", colors: ["#111111", "#D3D3D3"] },
    { id: 5, name: "Classic Oxford Cotton Shirt", category: "shirts", price: 85.00, image: "images/shirt2.jpg", colors: ["#FFFFFF", "#EBE5D8"] },
    { id: 6, name: "Cropped Wool Blend Jacket", category: "outerwear", price: 210.00, image: "images/outerwear3.jpg", colors: ["#111111"] }
];

let cart = JSON.parse(localStorage.getItem('veloce_cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartBtn = document.getElementById('cart-btn');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const filterBtns = document.querySelectorAll('.filter-btn');
const openSidebarBtn = document.getElementById('open-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar');
const sidebar = document.getElementById('sidebar');

// Render Products Grid
function renderProducts(itemsToRender = products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (itemsToRender.length === 0) {
        productsGrid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: var(--gray);">No products found in this category.</p>`;
        return;
    }

    itemsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <button class="quick-add-btn" onclick="addToCart(${product.id})">QUICK ADD</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Filter Functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.getAttribute('data-filter');
        if (filter === 'all') {
            renderProducts(products);
        } else {
            const filtered = products.filter(p => p.category === filter);
            renderProducts(filtered);
        }
    });
});

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    
    if (cartOverlay) cartOverlay.classList.add('active');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('veloce_cart', JSON.stringify(cart));
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
if (openSidebarBtn) openSidebarBtn.addEventListener('click', () => sidebar.classList.add('active'));
if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('active'));

// Checkout Redirection Handler
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            window.location.assign("https://buy.stripe.com/test_aFa4gzc64bbagTybiK2oE00");
        });
    }
});

// Initial Render
renderProducts();

// Fetch Printify Products dynamically using absolute URL matching your deployment domain
document.addEventListener("DOMContentLoaded", () => {
    fetch('https://velocemenswear.vercel.app/api/products')
        .then(res => res.json())
        .then(data => {
            const printifyItems = data.data || [];
            
            const formattedPrintifyProducts = printifyItems.map((item, index) => ({
                id: 100 + index,
                name: item.title,
                category: "outerwear", 
                price: item.variants?.[0]?.price ? item.variants[0].price / 100 : 29.99,
                image: item.images?.[0]?.src || "images/outerwear1.jpg",
                colors: ["#111111", "#EBE5D8"]
            }));

            if (formattedPrintifyProducts.length > 0) {
                products.push(...formattedPrintifyProducts);
                renderProducts();
            }
        })
        .catch(err => console.error("Error loading Printify products:", err));
});
