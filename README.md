# 3DNC - 3D Printing Services

Professional 3D printing services website.

## Features

- Video-driven landing page with time lapse demonstrations
- Service pages highlighting 3D printing capabilities
- **Automated gallery** with YouTube video metadata loading
- Project gallery showcasing recent work
- Contact form for service inquiries
- Hidden portfolio section for legacy content

## Technology Stack

- HTML5, CSS3, JavaScript
- GitHub Pages hosting
- YouTube video embeds with API integration
- Formspree contact form integration

## Quick Start

### Adding Videos to Gallery

1. **Get YouTube API Key** (one-time):
   - Visit https://console.cloud.google.com/
   - Enable YouTube Data API v3
   - Create an API key
   - Add to `js/main.js`

2. **Add videos** to `youtube-videos.txt` (one link per line)

3. **Run update script**:
   ```powershell
   .\scripts\update-gallery.ps1
   ```
   
   This automatically updates:
   - Gallery page with all videos
   - Services page playlist
   - Titles/descriptions load from YouTube API

**See [QUICK_START.md](QUICK_START.md) for detailed instructions.**

## Deployment

This site is deployed via GitHub Pages.

## Local Development

Simply open `index.html` in a web browser to preview locally.
