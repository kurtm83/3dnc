// 3DNC - Main JavaScript

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Form submission handling (optional - for additional client-side validation)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Formspree will handle the actual submission
        // This is just for any additional client-side logic you might want
    });
}

// Add animation on scroll (optional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .video-card, .faq-item, .portfolio-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .service-card, .video-card, .faq-item, .portfolio-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// YouTube Video Metadata Loader
// Add your YouTube API key here
const YOUTUBE_API_KEY = 'AIzaSyDW_j3p_EgbFKevryeBZWrq69WD-a6yFBg';

async function loadYouTubeMetadata() {
    // Find all video cards with data-video-id attribute
    const videoCards = document.querySelectorAll('[data-video-id]');
    
    if (videoCards.length === 0) return;
    
    // Check if API key is set
    if (YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
        console.warn('YouTube API key not set. Video titles and descriptions will not load automatically.');
        // Set default fallback text
        videoCards.forEach(card => {
            const titleEl = card.querySelector('.video-title');
            const descEl = card.querySelector('.video-description');
            if (titleEl) titleEl.textContent = 'Project Video';
            if (descEl) descEl.textContent = 'Watch this 3D printing project time lapse';
        });
        return;
    }
    
    // Extract all video IDs
    const videoIds = Array.from(videoCards).map(card => card.dataset.videoId);
    
    // Fetch metadata for all videos in one API call
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`YouTube API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update each video card with its metadata
        data.items.forEach(video => {
            const videoId = video.id;
            const title = video.snippet.title;
            const description = video.snippet.description;
            
            // Find the corresponding card
            const card = document.querySelector(`[data-video-id="${videoId}"]`);
            if (card) {
                const titleEl = card.querySelector('.video-title');
                const descEl = card.querySelector('.video-description');
                
                if (titleEl) {
                    titleEl.textContent = title;
                }
                
                if (descEl) {
                    // Use first line or first 150 characters of description
                    const shortDesc = description.split('\n')[0] || description;
                    descEl.textContent = shortDesc.length > 150 
                        ? shortDesc.substring(0, 150) + '...' 
                        : shortDesc;
                }
            }
        });
        
    } catch (error) {
        console.error('Error loading YouTube metadata:', error);
        // Set error fallback text
        videoCards.forEach(card => {
            const titleEl = card.querySelector('.video-title');
            const descEl = card.querySelector('.video-description');
            if (titleEl && titleEl.textContent === 'Loading...') {
                titleEl.textContent = 'Project Video';
            }
            if (descEl && descEl.textContent === 'Loading video details...') {
                descEl.textContent = 'Watch this 3D printing project';
            }
        });
    }
}

// Load YouTube metadata when page loads
document.addEventListener('DOMContentLoaded', loadYouTubeMetadata);
