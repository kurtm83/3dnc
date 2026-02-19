const fs = require('fs');
const path = require('path');

// Read the WordPress XML export
const xmlFile = path.join(__dirname, '..', '3d-nc.WordPress.2026-02-19.xml');
const xmlContent = fs.readFileSync(xmlFile, 'utf-8');

// Extract items from XML
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
const items = [];
let match;

while ((match = itemRegex.exec(xmlContent)) !== null) {
    const itemContent = match[1];
    
    // Extract fields
    const title = extractField(itemContent, 'title');
    const content = extractField(itemContent, 'content:encoded');
    const postType = extractField(itemContent, 'wp:post_type');
    const status = extractField(itemContent, 'wp:status');
    const postName = extractField(itemContent, 'wp:post_name');
    const postDate = extractField(itemContent, 'wp:post_date');
    
    // Only process published posts and pages
    if ((postType === 'post' || postType === 'page') && status === 'publish') {
        items.push({
            title,
            content,
            postType,
            postName,
            postDate
        });
    }
}

function extractField(text, fieldName) {
    const regex = new RegExp(`<${fieldName}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${fieldName}>`, 'i');
    const match = text.match(regex);
    return match ? match[1] : '';
}

function cleanContent(content) {
    // Remove WordPress block comments
    let cleaned = content.replace(/<!-- \/wp:.*?-->/g, '');
    cleaned = cleaned.replace(/<!-- wp:.*?-->/g, '');
    
    // Fix image URLs - keep the external WordPress.com URLs
    // They should continue to work even after the site is migrated
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    return cleaned.trim();
}

function generateHTML(item) {
    const cleanedContent = cleanContent(item.content);
    const date = new Date(item.postDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${item.title} - 3D-NC</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">3D-NC</a>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../services.html">Services</a></li>
                <li><a href="../gallery.html">Gallery</a></li>
                <li><a href="../contact.html">Contact</a></li>
                <li><a href="index.html" class="active">Portfolio</a></li>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Content -->
    <section class="portfolio-content">
        <div class="container">
            <a href="index.html" class="back-link">← Back to Portfolio</a>
            <article>
                <header class="portfolio-header">
                    <h1>${item.title}</h1>
                    <p class="date">${date}</p>
                </header>
                <div class="portfolio-body">
                    ${cleanedContent}
                </div>
            </article>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} 3D-NC. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
}

function generateIndexHTML(items) {
    const itemsList = items.map(item => {
        const date = new Date(item.postDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
        return `
            <div class="portfolio-item">
                <h3><a href="${item.postName}.html">${item.title}</a></h3>
                <p class="date">${date}</p>
            </div>`;
    }).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio - 3D-NC</title>
    <link rel="stylesheet" href="../css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container nav-container">
            <a href="../index.html" class="logo">3D-NC</a>
            <ul class="nav-menu">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../services.html">Services</a></li>
                <li><a href="../gallery.html">Gallery</a></li>
                <li><a href="../contact.html">Contact</a></li>
                <li><a href="index.html" class="active">Portfolio</a></li>
            </ul>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-small">
        <div class="container">
            <h1>Portfolio Archive</h1>
            <p>Previous work and projects</p>
        </div>
    </section>

    <!-- Portfolio List -->
    <section class="portfolio-list">
        <div class="container">
            ${itemsList}
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} 3D-NC. All rights reserved.</p>
        </div>
    </footer>

    <script src="../js/main.js"></script>
</body>
</html>`;
}

// Create portfolio directory
const portfolioDir = path.join(__dirname, '..', 'portfolio');
if (!fs.existsSync(portfolioDir)) {
    fs.mkdirSync(portfolioDir);
}

// Generate HTML files
console.log(`Found ${items.length} items to convert:\n`);

items.forEach(item => {
    const filename = `${item.postName}.html`;
    const filepath = path.join(portfolioDir, filename);
    const html = generateHTML(item);
    fs.writeFileSync(filepath, html, 'utf-8');
    console.log(`✓ Created: ${filename} - ${item.title}`);
});

// Generate index page
const indexHTML = generateIndexHTML(items);
fs.writeFileSync(path.join(portfolioDir, 'index.html'), indexHTML, 'utf-8');
console.log('\n✓ Created: index.html - Portfolio landing page');

console.log(`\n✅ Success! Converted ${items.length} items to static HTML`);
console.log(`📁 Files created in: ${portfolioDir}`);
console.log(`🌐 Access at: https://3d-nc.com/portfolio/`);
