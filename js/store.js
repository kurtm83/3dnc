// Store functionality
class Store {
    constructor() {
        this.products = [];
        this.cart = this.loadCart();
        this.settings = {};
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.updateCartUI();
        
        // Initialize page-specific functionality
        if (window.location.pathname.includes('store.html')) {
            this.displayProducts();
            this.setupFilters();
        } else if (window.location.pathname.includes('product.html')) {
            this.displayProductDetail();
        } else if (window.location.pathname.includes('checkout.html')) {
            this.displayCheckout();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('store/products.json');
            const data = await response.json();
            this.products = data.products;
            this.settings = data.settings;
            
            // Populate categories
            if (data.categories) {
                const categoryFilter = document.getElementById('categoryFilter');
                if (categoryFilter) {
                    data.categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat;
                        option.textContent = cat;
                        categoryFilter.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
        }
    }

    setupEventListeners() {
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const closeCart = document.getElementById('closeCart');
        const cartSidebar = document.getElementById('cartSidebar');
        
        if (cartToggle) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.toggle('active');
            });
        }
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }
        
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                window.location.href = 'store/checkout.html';
            });
        }
    }

    setupFilters() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortSelect = document.getElementById('sortSelect');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProducts());
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterProducts());
        }
        
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.filterProducts());
        }
    }

    filterProducts() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const category = document.getElementById('categoryFilter')?.value || 'all';
        const sort = document.getElementById('sortSelect')?.value || 'featured';
        
        let filtered = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || product.category === category;
            return matchesSearch && matchesCategory;
        });
        
        // Sort
        if (sort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sort === 'name') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'featured') {
            filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
        
        this.displayProducts(filtered);
    }

    displayProducts(productsToDisplay = this.products) {
        const grid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        
        if (!grid) return;
        
        if (productsToDisplay.length === 0) {
            grid.style.display = 'none';
            if (noProducts) noProducts.style.display = 'block';
            return;
        }
        
        grid.style.display = 'grid';
        if (noProducts) noProducts.style.display = 'none';
        
        grid.innerHTML = productsToDisplay.map(product => `
            <div class="product-card" onclick="window.location.href='store/product.html?id=${product.id}'">
                ${product.featured ? '<div class="featured-badge">⭐ Featured</div>' : ''}
                <img src="${product.images[0]}" alt="${product.name}" class="product-image" 
                     onerror="this.onerror=null; this.src='images/store/placeholder.jpg'">
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-specs">
                        <span><i data-lucide="ruler"></i> ${product.dimensions || 'Custom'}</span>
                        <span><i data-lucide="palette"></i> ${product.color || 'Various'}</span>
                    </div>
                    <div class="product-footer">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        ${product.inStock ? 
                            `<button class="add-to-cart-btn" onclick="event.stopPropagation(); store.addToCart('${product.id}')">Add to Cart</button>` :
                            '<span class="out-of-stock">Out of Stock</span>'
                        }
                    </div>
                </div>
            </div>
        `).join('');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    displayProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = this.products.find(p => p.id === productId);
        const content = document.getElementById('productContent');
        
        if (!product || !content) {
            content.innerHTML = '<p>Product not found.</p>';
            return;
        }
        
        document.getElementById('productBreadcrumb').textContent = product.name;
        document.title = `${product.name} - 3DNC Store`;
        
        // Build material options HTML
        let materialOptionsHTML = '';
        if (product.materials && Object.keys(product.materials).length > 1) {
            materialOptionsHTML = `
                <div class="product-materials">
                    <h3>Material Options</h3>
                    <div class="material-selector">
                        ${Object.entries(product.materials).map(([material, data]) => {
                            const price = material === 'PLA' 
                                ? product.price 
                                : product.price * (1 + (data.markup / 100));
                            const displayName = material === 'Other' ? data.name : material;
                            const isPLA = material === 'PLA';
                            return `
                                <label class="material-choice ${isPLA ? 'recommended' : ''}">
                                    <input type="radio" name="material" value="${material}" ${isPLA ? 'checked' : ''} 
                                           data-price="${price.toFixed(2)}">
                                    <span class="material-info">
                                        <strong>${displayName}</strong>
                                        ${isPLA ? '<span class="badge">Prototyped</span>' : ''}
                                        <span class="material-price">$${price.toFixed(2)}</span>
                                    </span>
                                </label>
                            `;
                        }).join('')}
                    </div>
                    <small style="color: #666; display: block; margin-top: 0.5rem;">
                        <i data-lucide="leaf"></i> PLA is our default material - eco-friendly and perfect for most applications. All items are prototyped in PLA.
                    </small>
                </div>
            `;
        }
        
        // Build video HTML if available
        let videoHTML = '';
        if (product.video) {
            videoHTML = `
                <div class="product-video">
                    <h3><i data-lucide="clock"></i> Timelapse - PLA Prototype</h3>
                    <video controls>
                        <source src="../${product.video}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        }
        
        content.innerHTML = `
            <div class="product-gallery">
                <img src="../${product.images[0]}" alt="${product.name}" class="product-main-image"
                     onerror="this.onerror=null; this.src='../images/store/placeholder.jpg'">
                ${videoHTML}
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <h1>${product.name}</h1>
                <div class="product-price" id="productPrice">$${product.price.toFixed(2)}</div>
                <p>${product.description}</p>
                
                ${materialOptionsHTML}
                
                <div class="product-meta">
                    <div class="meta-item">
                        <strong>PLA Colors Available</strong>
                        ${product.color || 'Contact for options'}
                    </div>
                    <div class="meta-item">
                        <strong>Dimensions</strong>
                        ${product.dimensions || 'N/A'}
                    </div>
                </div>
                
                ${product.inStock ? `
                    <div class="product-actions">
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <input type="number" id="quantity" value="1" min="1" max="99">
                        </div>
                        <button class="btn btn-primary" onclick="store.addToCartWithMaterial('${product.id}', document.getElementById('quantity').value)">
                            Add to Cart
                        </button>
                    </div>
                ` : '<p class="out-of-stock">This product is currently out of stock.</p>'}
            </div>
        `;
        
        // Add material selection listener to update price
        if (product.materials && Object.keys(product.materials).length > 1) {
            document.querySelectorAll('input[name="material"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const newPrice = e.target.dataset.price;
                    document.getElementById('productPrice').textContent = `$${newPrice}`;
                });
            });
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
            return;
        }
        
        // Display cart items
        checkoutItems.innerHTML = this.cart.map(item => {
            const product = this.products.find(p => p.id === item.id);
            if (!product) return '';
            const displayPrice = item.price || product.price;
            const materialLabel = item.material && item.material !== 'PLA' ? ` - ${item.material}` : '';
            return `
                <div class="checkout-item">
                    <img src="../${product.images[0]}" alt="${product.name}" class="checkout-item-image"
                         onerror="this.onerror=null; this.src='../images/store/placeholder.jpg'">
                    <div>
                        <div>${product.name}${materialLabel}</div>
                        <div>Qty: ${item.quantity} × $${displayPrice.toFixed(2)}</div>
                    </div>
                    <div>$${(displayPrice * item.quantity).toFixed(2)}</div>
                </div>
            `;
        }).join('');
        
        // Calculate totals
        const subtotal = this.getCartTotal();
        const shipping = this.settings.shippingFlat || 5.99;
        const tax = subtotal * (this.settings.taxRate || 0.08);
        const total = subtotal + shipping + tax;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('finalTotal').textContent = `$${total.toFixed(2)}`;
        
        // Setup payment method toggle
        this.setupPaymentMethods(total);
        
        // Handle manual form submission
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitOrder(new FormData(orderForm), total, 'manual');
            });
        }
    }

    setupPaymentMethods(total) {
        const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const paypalContainer = document.getElementById('paypalButtonContainer');
        const manualBtn = document.getElementById('manualSubmitBtn');
        const orderForm = document.getElementById('orderForm');
        
        // Toggle payment UI
        const togglePaymentUI = () => {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            if (selectedMethod === 'paypal') {
                paypalContainer.style.display = 'block';
                manualBtn.style.display = 'none';
                this.initPayPal(total);
            } else {
                paypalContainer.style.display = 'none';
                manualBtn.style.display = 'block';
            }
        };
        
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', togglePaymentUI);
        });
        
        // Initial setup
        togglePaymentUI();
    }

    initPayPal(total) {
        // Check if PayPal script is loaded
        if (typeof paypal === 'undefined') {
            document.getElementById('paypal-button-container').innerHTML = 
                '<p style="color: red;">PayPal is not configured. Please add your PayPal Client ID in the admin settings.</p>';
            return;
        }
        
        const container = document.getElementById('paypal-button-container');
        container.innerHTML = ''; // Clear previous buttons
        
        // Get form data for validation
        const validateForm = () => {
            const form = document.getElementById('orderForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return false;
            }
            return true;
        };
        
        paypal.Buttons({
            createOrder: (data, actions) => {
                if (!validateForm()) {
                    return actions.reject();
                }
                
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: total.toFixed(2),
                            currency_code: 'USD',
                            breakdown: {
                                item_total: { value: this.getCartTotal().toFixed(2), currency_code: 'USD' },
                                shipping: { value: (this.settings.shippingFlat || 5.99).toFixed(2), currency_code: 'USD' },
                                tax_total: { value: (total - this.getCartTotal() - (this.settings.shippingFlat || 5.99)).toFixed(2), currency_code: 'USD' }
                            }
                        },
                        items: this.cart.map(item => {
                            const product = this.products.find(p => p.id === item.id);
                            return {
                                name: product.name,
                                unit_amount: { value: product.price.toFixed(2), currency_code: 'USD' },
                                quantity: item.quantity.toString()
                            };
                        })
                    }]
                });
            },
            onApprove: (data, actions) => {
                return actions.order.capture().then((details) => {
                    // Payment successful
                    const formData = new FormData(document.getElementById('orderForm'));
                    this.submitOrder(formData, total, 'paypal', details);
                });
            },
            onError: (err) => {
                console.error('PayPal error:', err);
                alert('Payment failed. Please try again or contact support.');
            }
        }).render('#paypal-button-container');
    }

    addToCart(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        
        quantity = parseInt(quantity);
        const existingItem = this.cart.find(item => item.id === productId && !item.material);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ id: productId, quantity, material: 'PLA', price: product.price });
        }
        
        this.saveCart();
        this.updateCartUI();
        
        // Show feedback
        alert(`${product.name} added to cart!`);
    }
    
    addToCartWithMaterial(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !product.inStock) return;
        
        quantity = parseInt(quantity);
        
        // Get selected material
        const materialRadio = document.querySelector('input[name="material"]:checked');
        const selectedMaterial = materialRadio ? materialRadio.value : 'PLA';
        const selectedPrice = materialRadio ? parseFloat(materialRadio.dataset.price) : product.price;
        
        // Check if same product with same material exists
        const existingItem = this.cart.find(item => 
            item.id === productId && item.material === selectedMaterial
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({ 
                id: productId, 
                quantity, 
                material: selectedMaterial,
                price: selectedPrice
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        
        const materialName = selectedMaterial === 'Other' && product.materials?.Other?.name 
            ? product.materials.Other.name 
            : selectedMaterial;
        
        // Show feedback
        alert(`${product.name} (${materialName}) added to cart!`);
    }

    removeFromCart(productId, material = 'PLA') {
        this.cart = this.cart.filter(item => !(item.id === productId && (item.material || 'PLA') === material));
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity, material = 'PLA') {
        const item = this.cart.find(item => item.id === productId && (item.material || 'PLA') === material);
        if (item) {
            item.quantity = Math.max(1, parseInt(quantity));
            this.saveCart();
            this.updateCartUI();
        }
    }

    updateCartUI() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        
        // Update count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) cartCount.textContent = totalItems;
        
        // Update cart items
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="padding: 1rem; text-align: center;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => {
                    const product = this.products.find(p => p.id === item.id);
                    if (!product) return '';
                    const displayPrice = item.price || product.price;
                    const materialLabel = item.material && item.material !== 'PLA' ? ` (${item.material})` : '';
                    return `
                        <div class="cart-item">
                            <img src="${product.images[0]}" alt="${product.name}" class="cart-item-image"
                                 onerror="this.onerror=null; this.src='images/store/placeholder.jpg'">
                            <div class="cart-item-info">
                                <div class="cart-item-name">${product.name}${materialLabel}</div>
                                <div class="cart-item-price">$${displayPrice.toFixed(2)}</div>
                                <div class="cart-item-qty">
                                    <button class="qty-btn" onclick="store.updateQuantity('${item.id}', ${item.quantity - 1}, '${item.material || 'PLA'}')">-</button>
                                    <span>${item.quantity}</span>
                                    <button class="qty-btn" onclick="store.updateQuantity('${item.id}', ${item.quantity + 1}, '${item.material || 'PLA'}')">+</button>
                                    <button class="remove-item" onclick="store.removeFromCart('${item.id}', '${item.material || 'PLA'}')">Remove</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
        
        // Update total
        if (cartTotal) {
            cartTotal.textContent = `$${this.getCartTotal().toFixed(2)}`;
        }
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => {
            const price = item.price || this.products.find(p => p.id === item.id)?.price || 0;
            return sum + (price * item.quantity);
        }, 0);
    }

    submitOrder(formData, total, paymentMethod = 'manual', paypalDetails = null) {
        // Generate order number
        const orderNumber = 'ORD-' + Date.now();
        
        // Prepare order data
        const orderData = {
            orderNumber,
            date: new Date().toISOString(),
            paymentMethod,
            paymentStatus: paymentMethod === 'paypal' ? 'paid' : 'pending',
            paypalTransactionId: paypalDetails?.id || null,
            customer: {
                email: formData.get('email'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                address: formData.get('address'),
                address2: formData.get('address2'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip'),
                phone: formData.get('phone')
            },
            items: this.cart.map(item => {
                const product = this.products.find(p => p.id === item.id);
                return {
                    id: item.id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    stlFile: product.stlFile
                };
            }),
            notes: formData.get('notes'),
            subtotal: this.getCartTotal(),
            shipping: this.settings.shippingFlat || 5.99,
            tax: total - this.getCartTotal() - (this.settings.shippingFlat || 5.99),
            total: total
        };
        
        // In production, this would send to a server
        // For now, we'll show success and log to console
        console.log('Order submitted:', orderData);
        
        // Show confirmation modal with appropriate message
        document.getElementById('orderNumber').textContent = orderNumber;
        const confirmMessage = document.getElementById('confirmationMessage');
        
        if (paymentMethod === 'paypal') {
            confirmMessage.innerHTML = `
                <p><strong><i data-lucide="check-circle"></i> Payment Successful!</strong></p>
                <p>Thank you! Your payment has been processed and we've received your order.</p>
                <p>You'll receive a confirmation email shortly with:</p>
                <ul>
                    <li>Order confirmation and receipt</li>
                    <li>Estimated production timeline</li>
                    <li>Tracking information (when shipped)</li>
                </ul>
                <p>PayPal Transaction ID: <small>${paypalDetails?.id}</small></p>
            `;
        } else {
            confirmMessage.innerHTML = `
                <p>Thank you for your order! We've received your request.</p>
                <p>You'll receive an email shortly with:</p>
                <ul>
                    <li>Order confirmation and details</li>
                    <li>Payment instructions (Venmo/Bitcoin on-chain/Lightning)</li>
                    <li>Estimated production and delivery timeline</li>
                </ul>
            `;
        }
        
        document.getElementById('confirmationModal').classList.add('active');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        
        // In real implementation, send email or save to database
        this.sendOrderEmail(orderData);
    }

    async sendOrderEmail(orderData) {
        // This would integrate with an email service
        // For now, just log it
        console.log('Email would be sent to:', this.settings.notificationEmail);
        console.log('Order data:', JSON.stringify(orderData, null, 2));
        
        // TODO: Integrate with email service like:
        // - EmailJS
        // - SendGrid
        // - Mailgun
        // - Your own backend API
    }

    loadCart() {
        const saved = localStorage.getItem('3dnc-cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('3dnc-cart', JSON.stringify(this.cart));
    }
}

// Initialize store
let store;
document.addEventListener('DOMContentLoaded', () => {
    store = new Store();
});
