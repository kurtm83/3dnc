// Store Admin Dashboard
class StoreAdmin {
    constructor() {
        this.data = null;
        this.isLoggedIn = sessionStorage.getItem('admin-logged-in') === 'true';
        this.currentProduct = null;
        this.init();
    }

    async init() {
        if (this.isLoggedIn) {
            await this.loadData();
            this.showDashboard();
            this.setupEventListeners();
            this.loadProductsTable();
        } else {
            this.showLogin();
        }
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
    }

    async handleLogin() {
        const password = document.getElementById('adminPassword').value;
        await this.loadData();
        
        if (password === this.data.settings.adminPassword) {
            sessionStorage.setItem('admin-logged-in', 'true');
            this.isLoggedIn = true;
            this.showDashboard();
            this.setupEventListeners();
            this.loadProductsTable();
        } else {
            document.getElementById('loginError').textContent = 'Incorrect password';
        }
    }

    async loadData() {
        try {
            const response = await fetch('store/products.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading store data. Please refresh the page.');
        }
    }

    setupEventListeners() {
        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            sessionStorage.removeItem('admin-logged-in');
            location.reload();
        });
        
        // Tab navigation
        document.querySelectorAll('.admin-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openProductModal();
        });
        
        // Product form
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close, .cancel-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal();
            });
        });
        
        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
        
        // Load settings into form
        this.loadSettingsForm();
        
        // Setup file upload handlers
        this.setupFileUploads();
    }
    
    setupFileUploads() {
        const imageDropZone = document.getElementById('imageDropZone');
        const imageUpload = document.getElementById('imageUpload');
        const videoDropZone = document.getElementById('videoDropZone');
        const videoUpload = document.getElementById('videoUpload');
        
        this.uploadedImages = [];
        this.uploadedVideo = null;
        
        // Image drag-and-drop
        imageDropZone.addEventListener('click', () => imageUpload.click());
        imageDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageDropZone.classList.add('dragover');
        });
        imageDropZone.addEventListener('dragleave', () => {
            imageDropZone.classList.remove('dragover');
        });
        imageDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageDropZone.classList.remove('dragover');
            this.handleImageFiles(Array.from(e.dataTransfer.files));
        });
        imageUpload.addEventListener('change', (e) => {
            this.handleImageFiles(Array.from(e.target.files));
        });
        
        // Video drag-and-drop
        videoDropZone.addEventListener('click', () => videoUpload.click());
        videoDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            videoDropZone.classList.add('dragover');
        });
        videoDropZone.addEventListener('dragleave', () => {
            videoDropZone.classList.remove('dragover');
        });
        videoDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            videoDropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleVideoFile(e.dataTransfer.files[0]);
            }
        });
        videoUpload.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleVideoFile(e.target.files[0]);
            }
        });
    }
    
    handleImageFiles(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.uploadedImages.push({
                    name: file.name,
                    data: e.target.result
                });
                this.renderImagePreviews();
            };
            reader.readAsDataURL(file);
        });
    }
    
    renderImagePreviews() {
        const preview = document.getElementById('imagePreview');
        preview.innerHTML = this.uploadedImages.map((img, index) => `
            <div class="image-preview-item">
                <img src="${img.data}" alt="${img.name}">
                ${index === 0 ? '<span class="primary-badge">Primary</span>' : ''}
                <button type="button" class="remove-img" onclick="admin.removeImage(${index})">&times;</button>
            </div>
        `).join('');
    }
    
    removeImage(index) {
        this.uploadedImages.splice(index, 1);
        this.renderImagePreviews();
    }
    
    handleVideoFile(file) {
        if (!file.type.startsWith('video/')) {
            alert('Please select a video file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedVideo = {
                name: file.name,
                data: e.target.result
            };
            this.renderVideoPreview();
        };
        reader.readAsDataURL(file);
    }
    
    renderVideoPreview() {
        const preview = document.getElementById('videoPreview');
        if (this.uploadedVideo) {
            preview.innerHTML = `
                <div class="video-preview-item">
                    <video controls>
                        <source src="${this.uploadedVideo.data}" type="video/mp4">
                    </video>
                    <button type="button" class="remove-video" onclick="admin.removeVideo()">Remove Video</button>
                </div>
            `;
        } else {
            preview.innerHTML = '';
        }
    }
    
    removeVideo() {
        this.uploadedVideo = null;
        this.renderVideoPreview();
    }

    switchTab(tabName) {
        // Update menu
        document.querySelectorAll('.admin-menu a').forEach(link => {
            link.classList.toggle('active', link.dataset.tab === tabName);
        });
        
        // Update tabs
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.toggle('active', tab.id === tabName + 'Tab');
        });
    }

    loadProductsTable() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody || !this.data) return;
        
        tbody.innerHTML = this.data.products.map(product => `
            <tr>
                <td><img src="${product.images[0]}" alt="${product.name}" class="product-thumb" onerror="this.onerror=null; this.src='images/store/placeholder.jpg'"></td>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td>${product.inStock ? '<i data-lucide="check-circle" class="icon-success"></i> In Stock' : '<i data-lucide="x-circle" class="icon-error"></i> Out of Stock'}</td>
                <td>
                    <div class="admin-actions">
                        <button class="btn btn-secondary btn-icon" onclick="admin.editProduct('${product.id}')"><i data-lucide="edit"></i></button>
                        <button class="btn btn-secondary btn-icon" onclick="admin.deleteProduct('${product.id}')"><i data-lucide="trash-2"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();    }

    openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        // Reset uploaded files
        this.uploadedImages = [];
        this.uploadedVideo = null;
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('videoPreview').innerHTML = '';
        
        if (productId) {
            // Edit mode
            const product = this.data.products.find(p => p.id === productId);
            this.currentProduct = product;
            document.getElementById('modalTitle').textContent = 'Edit Product';
            
            // Fill form
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productColor').value = product.color || '';
            document.getElementById('productDimensions').value = product.dimensions || '';
            document.getElementById('productStl').value = product.stlFile || '';
            document.getElementById('productInStock').checked = product.inStock;
            document.getElementById('productFeatured').checked = product.featured;
            
            // Load existing images
            if (product.images && product.images.length > 0) {
                this.uploadedImages = product.images.map((url, index) => ({
                    name: `image-${index}.jpg`,
                    data: url
                }));
                this.renderImagePreviews();
            }
            
            // Load existing video
            if (product.video) {
                this.uploadedVideo = {
                    name: 'video.mp4',
                    data: product.video
                };
                this.renderVideoPreview();
            }
            
            // Load material options
            if (product.materials) {
                if (product.materials.PETG) {
                    document.getElementById('materialPETG').checked = true;
                    document.getElementById('petgMarkup').value = product.materials.PETG.markup;
                }
                if (product.materials.ABS) {
                    document.getElementById('materialABS').checked = true;
                    document.getElementById('absMarkup').value = product.materials.ABS.markup;
                }
                if (product.materials.Other) {
                    document.getElementById('materialOther').checked = true;
                    document.getElementById('otherMaterial').value = product.materials.Other.name;
                    document.getElementById('otherMarkup').value = product.materials.Other.markup;
                }
            }
        } else {
            // Add mode
            this.currentProduct = null;
            document.getElementById('modalTitle').textContent = 'Add Product';
            form.reset();
            document.getElementById('productId').value = 'product-' + Date.now();
        }
        
        modal.classList.add('active');
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    closeModal() {
        document.getElementById('productModal').classList.remove('active');
        this.currentProduct = null;
    }

    editProduct(productId) {
        this.openProductModal(productId);
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        this.data.products = this.data.products.filter(p => p.id !== productId);
        this.saveData();
        this.loadProductsTable();
    }

    saveProduct() {
        const formData = new FormData(document.getElementById('productForm'));
        
        // Get image URLs from uploaded images
        const images = this.uploadedImages.length > 0 
            ? this.uploadedImages.map(img => img.data)
            : ['images/store/placeholder.jpg'];
        
        // Build material options
        const materials = { PLA: { price: parseFloat(formData.get('price')), markup: 0 } };
        
        if (formData.get('materialPETG') === 'on') {
            const markup = parseFloat(document.getElementById('petgMarkup').value) || 0;
            materials.PETG = { markup };
        }
        
        if (formData.get('materialABS') === 'on') {
            const markup = parseFloat(document.getElementById('absMarkup').value) || 0;
            materials.ABS = { markup };
        }
        
        if (formData.get('materialOther') === 'on') {
            const name = document.getElementById('otherMaterial').value || 'Custom';
            const markup = parseFloat(document.getElementById('otherMarkup').value) || 0;
            materials.Other = { name, markup };
        }
        
        const product = {
            id: formData.get('id'),
            name: formData.get('name'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            category: formData.get('category'),
            material: 'PLA', // Default material
            materials: materials, // Available materials with pricing
            color: formData.get('color'),
            dimensions: formData.get('dimensions'),
            images: images,
            video: this.uploadedVideo ? this.uploadedVideo.data : null,
            stlFile: formData.get('stlFile'),
            inStock: formData.get('inStock') === 'on',
            featured: formData.get('featured') === 'on',
            fulfillmentProvider: 'craftcloud',
            createdAt: this.currentProduct?.createdAt || new Date().toISOString().split('T')[0]
        };
        
        if (this.currentProduct) {
            // Update existing
            const index = this.data.products.findIndex(p => p.id === product.id);
            this.data.products[index] = product;
        } else {
            // Add new
            this.data.products.push(product);
        }
        
        this.saveData();
        this.loadProductsTable();
        this.closeModal();
        
        alert('⚠️ Important: Download the updated products.json file below and replace the existing file in your /store/ folder to save your changes permanently.');
    }

    loadSettingsForm() {
        if (!this.data) return;
        
        document.getElementById('storeName').value = this.data.settings.storeName;
        document.getElementById('notificationEmail').value = this.data.settings.notificationEmail;
        document.getElementById('taxRate').value = this.data.settings.taxRate * 100;
        document.getElementById('shippingFlat').value = this.data.settings.shippingFlat;
        
        // Load PayPal settings
        document.getElementById('paypalEnabled').checked = this.data.settings.paypalEnabled || false;
        document.getElementById('paypalClientId').value = this.data.settings.paypalClientId || '';
        
        // Set active fulfillment provider
        const activeProvider = Object.keys(this.data.fulfillmentProviders).find(
            key => this.data.fulfillmentProviders[key].active
        );
        if (activeProvider) {
            document.querySelector(`input[name="fulfillmentProvider"][value="${activeProvider}"]`).checked = true;
        }
    }

    saveSettings() {
        const formData = new FormData(document.getElementById('settingsForm'));
        
        this.data.settings.storeName = formData.get('storeName');
        this.data.settings.notificationEmail = formData.get('notificationEmail');
        this.data.settings.taxRate = parseFloat(formData.get('taxRate')) / 100;
        this.data.settings.shippingFlat = parseFloat(formData.get('shippingFlat'));
        
        // Save PayPal settings
        this.data.settings.paypalEnabled = formData.get('paypalEnabled') === 'on';
        this.data.settings.paypalClientId = formData.get('paypalClientId');
        
        // Update password if provided
        const newPassword = formData.get('adminPassword');
        if (newPassword && newPassword.trim() !== '') {
            this.data.settings.adminPassword = newPassword;
        }
        
        // Update fulfillment provider
        const selectedProvider = formData.get('fulfillmentProvider');
        Object.keys(this.data.fulfillmentProviders).forEach(key => {
            this.data.fulfillmentProviders[key].active = (key === selectedProvider);
        });
        
        this.saveData();
        alert('Settings saved successfully!');
    }

    saveData() {
        // In a real application, this would save to a server
        // For now, we'll use localStorage and show instructions
        localStorage.setItem('3dnc-store-data', JSON.stringify(this.data));
        
        console.log('Store data updated. To persist changes, download and replace store/products.json:');
        console.log(JSON.stringify(this.data, null, 2));
        
        // Provide download button
        this.offerDownload();
    }

    offerDownload() {
        // Check if download button already exists
        if (document.getElementById('downloadDataBtn')) return;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadDataBtn';
        downloadBtn.className = 'btn btn-primary';
        downloadBtn.textContent = '💾 Download products.json';
        downloadBtn.style.position = 'fixed';
        downloadBtn.style.bottom = '20px';
        downloadBtn.style.right = '20px';
        downloadBtn.style.zIndex = '9999';
        downloadBtn.onclick = () => this.downloadData();
        
        document.body.appendChild(downloadBtn);
    }

    downloadData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'products.json';
        link.click();
        
        URL.revokeObjectURL(url);
        
        alert('Downloaded! Replace the file at store/products.json with this file to persist your changes.');
    }
}

// Initialize admin
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new StoreAdmin();
});
