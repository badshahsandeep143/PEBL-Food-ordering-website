const APP_DATA = {
    restaurants: [
        {
            id: "res-1",
            name: "The Italian Trattoria",
            rating: "4.5",
            time: "25-30 mins",
            costForTwo: "₹600",
            tags: "Pizzas, Pastas, Italian, Desserts",
            category: "continental",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
            menu: [
                { id: "m-101", name: "Margherita Pizza", price: 299, desc: "Classic fresh mozzarella, fresh basil, and signature plum tomato sauce." },
                { id: "m-102", name: "Penne Alfredo Cream Sauce", price: 349, desc: "Rich Parmesan cheese sauce tossed with perfectly cooked al dente pasta." },
                { id: "m-103", name: "Tiramisu", price: 199, desc: "Espresso-soaked ladyfingers layered with a whipped mascarpone cream mixture." }
            ]
        },
        {
            id: "res-2",
            name: "Spiceland Biryani Hub",
            rating: "4.8",
            time: "35-40 mins",
            costForTwo: "₹450",
            tags: "Biryani, Mughlai, North Indian",
            category: "indian",
            image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
            menu: [
                { id: "m-201", name: "Dum Chicken Biryani", price: 320, desc: "Fragrant long grain basmati rice cooked layered with spiced marinated chicken." },
                { id: "m-202", name: "Paneer Butter Masala", price: 260, desc: "Soft cottage cheese cubes cooked inside a rich, creamy, tomato-butter gravy." },
                { id: "m-203", name: "Garlic Butter Naan", price: 60, desc: "Traditional Indian leavened flatbread garnished with minced garlic and melted butter." }
            ]
        },
        {
            id: "res-3",
            name: "Wok & Roll Asian Kitchen",
            rating: "4.3",
            time: "20-25 mins",
            costForTwo: "₹500",
            tags: "Noodles, Sushi, Pan-Asian, Dumplings",
            category: "asian",
            image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
            menu: [
                { id: "m-301", name: "Hakka Noodles (Veg)", price: 210, desc: "Stir-fried noodles tossed with crisp colorful seasonal vegetables and soy seasoning." },
                { id: "m-302", name: "Steamed Chicken Dimsums", price: 240, desc: "Delicate wrappers stuffed with juicy minced chicken filling, steamed perfectly." },
                { id: "m-303", name: "Schezwan Fried Rice", price: 230, desc: "Fiery fried rice tossed inside a robust, spicy house-crafted Schezwan pepper blend sauce." }
            ]
        },
        {
            id: "res-4",
            name: "The Green Salad Bar",
            rating: "4.6",
            time: "15-20 mins",
            costForTwo: "₹400",
            tags: "Healthy, Salads, Juices, Vegan",
            category: "healthy",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80",
            menu: [
                { id: "m-401", name: "Avocado Caesar Salad", price: 280, desc: "Crisp romaine lettuce mixed with rich sliced avocados, crunchy croutons, and light Greek yogurt dressing." },
                { id: "m-402", name: "Detox Green Smoothie", price: 150, desc: "Cold-pressed blend containing fresh organic spinach, green apples, cucumbers, and a dash of lemon juice." }
            ]
        }
    ]
};
const State = {
    cart: JSON.parse(localStorage.getItem('fh_cart')) || [],
    orders: JSON.parse(localStorage.getItem('fh_orders')) || [],
    user: JSON.parse(localStorage.getItem('fh_user')) || null,
    currentFilter: 'all',
    deliveryDistanceKm: 3, // Default distance calculation baseline (e.g., 3 km)
    saveCart() {
        localStorage.setItem('fh_cart', JSON.stringify(this.cart));
        this.updateGlobalBadge();
    },
    saveOrders() {
        localStorage.setItem('fh_orders', JSON.stringify(this.orders));
    },
    saveUser(userData) {
        this.user = { ...this.user, ...userData };
        localStorage.setItem('fh_user', JSON.stringify(this.user));
        this.updateNavAuth();
    },
    logout() {
        this.user = null;
        localStorage.removeItem('fh_user');
        this.updateNavAuth();
        Router.navigate('home');
    },
    updateNavAuth() {
        const authNav = document.getElementById('nav-auth');
        if (this.user) {
            authNav.innerText = "Profile";
            authNav.onclick = () => Router.navigate('profile');
        } else {
            authNav.innerText = "Login";
            authNav.onclick = () => Router.navigate('login');
        }
    },
    addToCart(item, restaurant) {
        const existing = this.cart.find(i => i.id === item.id);
        if(existing) {
            existing.qty += 1;
        } else {
            this.cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                resId: restaurant.id,
                resName: restaurant.name,
                qty: 1
            });
        }
        this.saveCart();
    },
    updateQty(itemId, change) {
        const target = this.cart.find(i => i.id === itemId);
        if (target) {
            target.qty += change;
            if(target.qty <= 0) {
                this.cart = this.cart.filter(i => i.id !== itemId);
            }
            this.saveCart();
        }
    },
    clearCart() {
        this.cart = [];
        this.saveCart();
    },
    updateGlobalBadge() {
        const total = this.cart.reduce((sum, item) => sum + item.qty, 0);
        document.getElementById('global-cart-count').innerText = total;
    }
};
const Router = {
    routes: {
        home: renderHome,
        restaurant: renderRestaurantDetail,
        cart: renderCart,
        orders: renderOrders,
        success: renderSuccess,
        login: renderLogin,
        signup: renderSignup,         
        forgot: renderForgot,         
        profile: renderProfile        
    },
    navigate(route, param = null) {
        window.scrollTo({ top: 0, behavior: 'smooth' });      
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const navId = `nav-${route}`;
        const activeNav = document.getElementById(navId);
        if (activeNav) activeNav.classList.add('active');
        this.routes[route](param);
    }
};
const appView = document.getElementById('app-view');
function renderLogin() {
    appView.innerHTML = `
        <div class="container auth-container" style="max-width: 400px; padding: 60px 24px; margin: 0 auto;">
            <div class="cart-box">
                <h2 style="margin-bottom: 24px; text-align: center;">Login</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Email or Mobile Number</label>
                        <input type="text" id="login-identifier" class="form-control" placeholder="Enter email or 10-digit mobile" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="login-password" class="form-control" placeholder="Enter password" required>
                    </div>
                    <div style="text-align: right; margin-bottom: 16px;">
                        <a href="#" onclick="Router.navigate('forgot')" style="font-size: 0.85rem; color: var(--primary);">Forgot Password?</a>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
                </form>
                <div style="text-align: center; margin-top: 16px; font-size: 0.9rem;">
                    Don't have an account? <a href="#" onclick="Router.navigate('signup')" style="color: var(--primary); font-weight: 600;">Sign up</a>
                </div>
            </div>
        </div>
    `;
}
function renderSignup() {
    appView.innerHTML = `
        <div class="container auth-container" style="max-width: 400px; padding: 60px 24px; margin: 0 auto;">
            <div class="cart-box">
                <h2 style="margin-bottom: 24px; text-align: center;">Sign Up</h2>
                <form onsubmit="handleSignup(event)">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="signup-name" class="form-control" placeholder="Enter Your Full Name" required>
                    </div>
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="signup-email" class="form-control" placeholder="Enter your email address" required>
                    </div>
                    <div class="form-group">
                        <label>Mobile Number</label>
                        <input type="tel" id="signup-mobile" class="form-control" placeholder="10-digit mobile number" required pattern="[0-9]{10}">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="signup-password" class="form-control" placeholder="Create password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="signup-confirm" class="form-control" placeholder="Confirm password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">Sign Up</button>
                </form>
                <div style="text-align: center; margin-top: 16px; font-size: 0.9rem;">
                    Already have an account? <a href="#" onclick="Router.navigate('login')" style="color: var(--primary); font-weight: 600;">Login</a>
                </div>
            </div>
        </div>
    `;
}
function renderForgot() {
    appView.innerHTML = `
        <div class="container auth-container" style="max-width: 400px; padding: 60px 24px; margin: 0 auto;">
            <div class="cart-box">
                <h2 style="margin-bottom: 24px; text-align: center;">Reset Password</h2>
                <form onsubmit="handleForgot(event)">
                    <div class="form-group">
                        <label>Email or Mobile Number</label>
                        <input type="text" class="form-control" placeholder="Registered email or mobile" required>
                    </div>
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="forgot-password" class="form-control" placeholder="Enter new password" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" id="forgot-confirm" class="form-control" placeholder="Confirm new password" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">Reset Password</button>
                </form>
                <div style="text-align: center; margin-top: 16px; font-size: 0.9rem;">
                    <a href="#" onclick="Router.navigate('login')" style="color: var(--text-muted); font-weight: 600;">Back to Login</a>
                </div>
            </div>
        </div>
    `;
}
function renderProfile() {
    if (!State.user) return Router.navigate('login');
    const emailValue = State.user.email ? State.user.email : '';
    const mobileValue = State.user.mobile ? State.user.mobile : '';
    const nameValue = State.user.name ? State.user.name : 'Valued Customer';
    appView.innerHTML = `
        <div class="container auth-container" style="max-width: 600px; padding: 60px 24px; margin: 0 auto;">
            <div class="cart-box">
                <h2 style="margin-bottom: 8px; padding-bottom: 12px; border-bottom: 1px solid var(--bg-light);">My Account</h2>
                <p style="color: var(--primary); font-weight: 600; margin-bottom: 24px;">${nameValue}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div>
                        <p style="color: var(--text-muted); margin-bottom: 4px; font-size: 0.85rem;">Mobile Number</p>
                        <p style="font-weight: 600; font-size: 1.05rem;">${mobileValue ? '+91 ' + mobileValue : 'Not Provided'}</p>
                    </div>
                    <div>
                        <p style="color: var(--text-muted); margin-bottom: 4px; font-size: 0.85rem;">Email Address</p>
                        <p style="font-weight: 600; font-size: 1.05rem;">${emailValue || 'Not Provided'}</p>
                    </div>
                </div>
                <form onsubmit="updateProfileDetails(event)">
                    <div class="form-group">
                        <label>Update Full Name</label>
                        <input type="text" id="profile-name" class="form-control" value="${nameValue}" required>
                    </div>
                    <div class="form-group">
                        <label>Update Email Address</label>
                        <input type="email" id="profile-email" class="form-control" value="${emailValue}" required>
                    </div>
                    <div class="form-group">
                        <label>Update Mobile Number</label>
                        <input type="tel" id="profile-mobile" class="form-control" value="${mobileValue}" pattern="[0-9]{10}" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">Save Changes</button>
                </form>
                <hr style="border: 0; border-top: 1px dashed #d3d3d3; margin: 32px 0 24px 0;">
                <button onclick="State.logout()" class="btn btn-outline" style="width: 100%; color: #dc3545; border-color: #dc3545;">Logout Account</button>
            </div>
        </div>
    `;
}
function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value;
    // Check if input is email or mobile
    if (identifier.includes('@')) {
        State.saveUser({ email: identifier, mobile: State.user?.mobile || "" });
    } else {
        State.saveUser({ mobile: identifier, email: State.user?.email || "" });
    }
    Router.navigate('home');
}
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const mobile = document.getElementById('signup-mobile').value;
    const pass = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    if (pass !== confirm) {
        alert("Passwords do not match!");
        return;
    }
    State.saveUser({ name, email, mobile });
    Router.navigate('home');
}
function handleForgot(e) {
    e.preventDefault();
    const pass = document.getElementById('forgot-password').value;
    const confirm = document.getElementById('forgot-confirm').value;
    if (pass !== confirm) {
        alert("Passwords do not match!");
        return;
    }
    alert("Password reset successfully! Please login with your new credentials.");
    Router.navigate('login');
}
function updateProfileDetails(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const mobile = document.getElementById('profile-mobile').value;
    State.saveUser({ name, email, mobile });
    alert("Profile updated successfully!");
}
function renderHome() {
    appView.innerHTML = `
        <section class="hero">
            <div class="container">
                <h1>Premium Dining, Delivered Clean.</h1>
                <p>Experience local gourmet options engineered seamlessly right to your desk.</p>
            </div>
        </section>
        <div class="container">
            <div class="filter-section" id="filter-bar">
                <button class="filter-chip ${State.currentFilter === 'all' ? 'active' : ''}" onclick="filterHome('all')">All Cuisines</button>
                <button class="filter-chip ${State.currentFilter === 'indian' ? 'active' : ''}" onclick="filterHome('indian')">Indian</button>
                <button class="filter-chip ${State.currentFilter === 'continental' ? 'active' : ''}" onclick="filterHome('continental')">Continental</button>
                <button class="filter-chip ${State.currentFilter === 'asian' ? 'active' : ''}" onclick="filterHome('asian')">Pan-Asian</button>
                <button class="filter-chip ${State.currentFilter === 'healthy' ? 'active' : ''}" onclick="filterHome('healthy')">Healthy</button>
            </div>
            <h2 class="section-title">Popular Restaurants</h2>
            <div class="grid" id="restaurant-grid"></div>
        </div>
    `;
    const grid = document.getElementById('restaurant-grid');
    const targetRestaurants = State.currentFilter === 'all' 
        ? APP_DATA.restaurants 
        : APP_DATA.restaurants.filter(r => r.category === State.currentFilter);
    targetRestaurants.forEach(res => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => Router.navigate('restaurant', res.id);
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img class="card-img" src="${res.image}" alt="${res.name}">
            </div>
            <div class="card-content">
                <div class="card-title">${res.name}</div>
                <div class="card-tags">${res.tags}</div>
                <div class="card-meta">
                    <span class="rating">★ ${res.rating}</span>
                    <span>${res.time}</span>
                    <span style="color: var(--dark);">${res.costForTwo} FOR TWO</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}
function filterHome(category) {
    State.currentFilter = category;
    renderHome();
}
function renderRestaurantDetail(resId) {
    const res = APP_DATA.restaurants.find(r => r.id === resId);
    if (!res) return Router.navigate('home');
    appView.innerHTML = `
        <div class="container">
            <div class="restaurant-banner">
                <div class="res-header-info">
                    <h2>${res.name}</h2>
                    <p style="color: var(--text-muted); margin-bottom: 8px;">${res.tags}</p>
                    <div style="display: flex; gap: 24px; font-size: 0.9rem; font-weight: 600;">
                        <span class="rating">★ ${res.rating}</span>
                        <span>🕒 ${res.time}</span>
                        <span>💵 ${res.costForTwo} for two</span>
                    </div>
                </div>
            </div>
            <div class="menu-container">
                <h3 class="section-title" style="margin-bottom: 12px;">Recommended Dishes</h3>
                <div id="menu-items-list"></div>
            </div>
        </div>
    `;
    const listContainer = document.getElementById('menu-items-list');
    res.menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <div class="menu-item-details">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price}</div>
                <div class="menu-item-desc">${item.desc}</div>
            </div>
            <div class="menu-item-action">
                <img class="menu-item-img" src="${res.image}" alt="${item.name}">
                <div class="add-btn-container">
                    <button class="add-to-cart-btn" onclick="handleAddToCart('${res.id}', '${item.id}')">Add +</button>
                </div>
            </div>
        `;
        listContainer.appendChild(div);
    });
}
function handleAddToCart(resId, itemId) {
    const res = APP_DATA.restaurants.find(r => r.id === resId);
    const item = res.menu.find(m => m.id === itemId);
    State.addToCart(item, res);
    alert(`${item.name} added to your cart.`);
}
function calculateDeliveryFee(distanceKm) {
    // Base fee: ₹20 for the first 2 km, then ₹10 for every subsequent km
    let baseKmLimit = 2;
    let baseFee = 20;
    let ratePerExtraKm = 5;
    if (distanceKm <= baseKmLimit) {
        return baseFee;
    } else {
        return baseFee + Math.ceil(distanceKm - baseKmLimit) * ratePerExtraKm;
    }
}
function updateCartCalculations() {
    const distanceInput = document.getElementById('f-distance');
    if (distanceInput) {
        let val = parseFloat(distanceInput.value);
        if (isNaN(val) || val < 1) val = 1;
        State.deliveryDistanceKm = val;
    }
    renderCart();
}
function renderCart() {
    if(State.cart.length === 0) {
        appView.innerHTML = `
            <div class="container" style="text-align: center; padding: 100px 24px;">
                <h2 style="margin-bottom: 16px;">Your cart is completely empty</h2>
                <p style="color: var(--text-muted); margin-bottom: 32px;">Go back to the homepage to look through rich local selections.</p>
                <button class="btn btn-primary" onclick="Router.navigate('home')">Browse Restaurants</button>
            </div>
        `;
        return;
    }
    let itemsSubtotal = 0;
    let deliveryFee = calculateDeliveryFee(State.deliveryDistanceKm);
    let GST = 0;
    let itemsHtml = '';
    State.cart.forEach(item => {
        const rowTotal = item.price * item.qty;
        itemsSubtotal += rowTotal;
        itemsHtml += `
            <div class="cart-line-item">
                <div>
                    <div style="font-weight: 600;">${item.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${item.resName}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 24px;">
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeCartQty('${item.id}', -1)">-</button>
                        <span class="qty-val">${item.qty}</span>
                        <button class="qty-btn" onclick="changeCartQty('${item.id}', 1)">+</button>
                    </div>
                    <div style="font-weight: 600; width: 60px; text-align: right;">₹${rowTotal}</div>
                </div>
            </div>
        `;
    });
    GST = Math.round(itemsSubtotal * 0.05);
    let totalToPay = itemsSubtotal + deliveryFee + GST;
    const userPhone = State.user?.mobile || '';
    appView.innerHTML = `
        <div class="container">
            <div class="cart-layout">
                <div>
                    <div class="cart-box" style="margin-bottom: 24px;">
                        <div class="cart-title">Review Items</div>
                        ${itemsHtml}
                    </div>
                    <div class="cart-box">
                        <div class="cart-title">Delivery Details</div>
                        <form id="checkout-form" onsubmit="processCheckout(event)">
                            <div class="form-group">
                                <label>Delivery Address</label>
                                <input type="text" class="form-control" placeholder="Flat, House no., Apartment, Street" required id="f-address">
                            </div>
                            <div class="form-group">
                                <label>Delivery Distance (in Kilometers)</label>
                                <input type="number" step="0.5" min="1" max="50" class="form-control" value="${State.deliveryDistanceKm}" id="f-distance" oninput="updateCartCalculations()" required>
                                <small style="color: var(--text-muted); font-size: 0.75rem;">Fee structure: ₹20 for first 2 km, then ₹10/km extra.</small>
                            </div>
                            <div class="form-group">
                                <label>Contact Phone Number</label>
                                <input type="tel" class="form-control" placeholder="10-digit mobile number" value="${userPhone}" required id="f-phone" pattern="[0-9]{10}">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Payment Mode Selection</label>
                                <select class="form-control" id="f-pay">
                                    <option value="COD">Cash on Delivery (COD)</option>
                                    <option value="UPI">Instant Mock UPI Processing</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="cart-box" style="height: fit-content;">
                    <div class="cart-title">Bill Details</div>
                    <div class="summary-row">
                        <span style="color: var(--text-muted);">Item Subtotal</span>
                        <span>₹${itemsSubtotal}</span>
                    </div>
                    <div class="summary-row">
                        <span style="color: var(--text-muted);">Delivery Fee (${State.deliveryDistanceKm} km)</span>
                        <span>₹${deliveryFee}</span>
                    </div>
                    <div class="summary-row">
                        <span style="color: var(--text-muted);">Govt Taxes & GST (5%)</span>
                        <span>₹${GST}</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>To Pay Total</span>
                        <span style="color: var(--primary);">₹${totalToPay}</span>
                    </div>
                    <button type="submit" form="checkout-form" class="btn btn-primary" style="width: 100%; margin-top: 24px; padding: 14px;">Confirm & Place Order</button>
                </div>
            </div>
        </div>
    `;
}
function changeCartQty(itemId, change) {
    State.updateQty(itemId, change);
    renderCart();
}
function processCheckout(event) {
    event.preventDefault();
    if (!State.user) {
        alert("Please login first to place an order!");
        Router.navigate('login');
        return;
    }
    const subtotal = State.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const currentDeliveryFee = calculateDeliveryFee(State.deliveryDistanceKm);
    const total = subtotal + currentDeliveryFee + Math.round(subtotal * 0.05);
    
    const newOrder = {
        orderId: "FH-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString(),
        address: document.getElementById('f-address').value,
        distance: State.deliveryDistanceKm,
        phone: document.getElementById('f-phone').value,
        paymentMode: document.getElementById('f-pay').value,
        items: [...State.cart],
        grandTotal: total
    };
    State.orders.unshift(newOrder);
    State.saveOrders();
    State.clearCart();
    Router.navigate('success', newOrder.orderId);
}
function renderSuccess(orderId) {
    appView.innerHTML = `
        <div class="container">
            <div class="success-view">
                <div class="success-icon">✓</div>
                <h2 style="margin-bottom: 8px;">Order Placed Successfully!</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">Your identifier token is <strong>${orderId}</strong>. The restaurant has accepted the execution process.</p>
                <div style="display: flex; gap: 16px; justify-content: center;">
                    <button class="btn btn-primary" onclick="Router.navigate('orders')">Track Orders</button>
                    <button class="btn btn-outline" onclick="Router.navigate('home')">Main Feed</button>
                </div>
            </div>
        </div>
    `;
}
function renderOrders() {
    if(State.orders.length === 0) {
        appView.innerHTML = `
            <div class="container" style="text-align: center; padding: 100px 24px;">
                <h2 style="margin-bottom: 16px;">No structural history logs found</h2>
                <p style="color: var(--text-muted); margin-bottom: 24px;">You have not completed checkout processes inside your modern client container environment yet.</p>
                <button class="btn btn-primary" onclick="Router.navigate('home')">Explore Food Options</button>
            </div>
        `;
        return;
    }
    let ordersHtml = '';
    State.orders.forEach(order => {
        let itemsSummary = order.items.map(i => `${i.name} (${i.qty})`).join(', ');
        ordersHtml += `
            <div class="cart-box" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding-bottom: 12px; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 700; color: var(--primary);">${order.orderId}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${order.timestamp}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700;">₹${order.grandTotal}</div>
                        <div style="font-size: 0.8rem; color: #48c479; font-weight:600;">Status: Out for Delivery</div>
                    </div>
                </div>
                <div style="font-size: 0.95rem; margin-bottom: 8px;">
                    <strong>Dishes:</strong> ${itemsSummary}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted);">
                    <strong>Delivery Area:</strong> ${order.address} (${order.distance || 3} km) | <strong>Mode:</strong> ${order.paymentMode}
                </div>
            </div>
        `;
    });
    appView.innerHTML = `
        <div class="container" style="max-width: 800px; padding-top: 40px; padding-bottom: 60px;">
            <h2 class="section-title">Your Order History Tracker</h2>
            ${ordersHtml}
        </div>
    `;
}
document.addEventListener("DOMContentLoaded", () => {
    State.updateGlobalBadge();
    State.updateNavAuth(); 
    Router.navigate('home');
});
