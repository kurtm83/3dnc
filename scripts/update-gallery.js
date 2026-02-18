const fs = require('fs');
const path = require('path');

// Read video links from youtube-videos.txt
const videoLinksFile = path.join(__dirname, '..', 'youtube-videos.txt');
const galleryFile = path.join(__dirname, '..', 'gallery.html');
const servicesFile = path.join(__dirname, '..', 'services.html');

function extractVideoId(url) {
    // Handle different YouTube URL formats
    const patterns = [
        /youtu\.be\/([a-zA-Z0-9_-]+)/,           // youtu.be/VIDEO_ID
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/, // youtube.com/watch?v=VIDEO_ID
        /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/    // youtube.com/embed/VIDEO_ID
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    
    return null;
}

function generateVideoCard(videoId, index) {
    return `                <!-- Video ${index + 1} -->
                <div class="video-card" data-video-id="${videoId}">
                    <div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/${videoId}?rel=0&loop=1&playlist=${videoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <h4 class="video-title">Loading...</h4>
                    <p class="video-description">Loading video details...</p>
                </div>`;
}

try {
    // Read video links
    const content = fs.readFileSync(videoLinksFile, 'utf-8');
    const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#')); // Remove empty lines and comments
    
    const videoIds = lines.map(line => extractVideoId(line)).filter(id => id);
    
    if (videoIds.length === 0) {
        console.error('❌ No valid YouTube URLs found in youtube-videos.txt');
        process.exit(1);
    }
    
    console.log(`✓ Found ${videoIds.length} video(s)`);
    
    // Generate video cards HTML
    const videoCardsHtml = videoIds.map((id, index) => generateVideoCard(id, index)).join('\n\n');
    
    // Read gallery.html
    let galleryHtml = fs.readFileSync(galleryFile, 'utf-8');
    
    // Find the video-grid section and replace content using regex
    const gridPattern = /(<div class="video-grid">)[\s\S]*?(<\/div>\s+<\/div>\s+<\/section>\s+<!-- CTA -->)/;
    
    if (!galleryHtml.match(gridPattern)) {
        console.error('❌ Could not find video-grid section in gallery.html');
        process.exit(1);
    }
    
    // Replace the video grid content
    const newGalleryHtml = galleryHtml.replace(
        gridPattern, 
        `$1\n${videoCardsHtml}\n            </div>\n        </div>\n    </section>\n\n    <!-- CTA -->`
    );
    
    // Write updated gallery.html
    fs.writeFileSync(galleryFile, newGalleryHtml, 'utf-8');
    
    console.log('✓ Gallery updated successfully!');
    console.log(`✓ Added ${videoIds.length} video(s) to gallery.html`);
    
    // Update services.html with playlist of all videos
    const playlist = videoIds.join(',');
    const firstVideoId = videoIds[0];
    
    let servicesHtml = fs.readFileSync(servicesFile, 'utf-8');
    
    // Find and replace the iframe src in services.html
    const iframePattern = /<iframe\s+src="https:\/\/www\.youtube\.com\/embed\/[^"]+"/;
    const newIframeSrc = `<iframe src="https://www.youtube.com/embed/${firstVideoId}?autoplay=1&mute=1&loop=1&playlist=${playlist}&rel=0&modestbranding=1"`;
    
    if (servicesHtml.match(iframePattern)) {
        servicesHtml = servicesHtml.replace(iframePattern, newIframeSrc);
        fs.writeFileSync(servicesFile, servicesHtml, 'utf-8');
        console.log('✓ Services page playlist updated!');
    } else {
        console.log('⚠ Could not find video iframe in services.html (skipping)');
    }
    
    console.log('\nVideo IDs:');
    videoIds.forEach((id, index) => {
        console.log(`  ${index + 1}. ${id}`);
    });
    
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
}
