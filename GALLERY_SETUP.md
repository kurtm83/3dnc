# Gallery Video Setup Guide

## How It Works

Your gallery automatically fetches video titles and descriptions from YouTube using the YouTube Data API v3. When you add new videos, the page will automatically load their metadata.

## Setup Steps

### 1. Get a YouTube API Key (Free)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "YouTube Data API v3" for your project
4. Go to "Credentials" and create an API key
5. Copy your API key

### 2. Add Your API Key

Open `js/main.js` and replace this line:
```javascript
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY_HERE';
```

With your actual API key:
```javascript
const YOUTUBE_API_KEY = 'AIzaSyD...your-actual-key-here';
```

### 3. Adding New Videos

When you want to add or update videos in your gallery:

1. Edit `youtube-videos.txt` and add your YouTube links (one per line)
2. Run the helper script: `node scripts/update-gallery.js`
3. The script will update `gallery.html` with your new videos
4. The page will automatically load titles and descriptions

## Manual Method (No Script)

If you prefer to manually add videos to `gallery.html`:

1. Find this section in `gallery.html`:
```html
<div class="video-card" data-video-id="YOUR_VIDEO_ID">
    <div class="video-wrapper">
        <iframe 
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    </div>
    <h4 class="video-title">Loading...</h4>
    <p class="video-description">Loading video details...</p>
</div>
```

2. Replace `YOUR_VIDEO_ID` with the video ID from YouTube
   - Example: For `https://youtu.be/HqKrmmI5z4Q`, the ID is `HqKrmmI5z4Q`
   - Or from `https://www.youtube.com/watch?v=HqKrmmI5z4Q`, the ID is also `HqKrmmI5z4Q`

## API Limits

- YouTube API has a free quota of 10,000 units per day
- Each page load uses 1 unit per video
- This is plenty for a small business website
- If you exceed limits, the fallback text will display

## Troubleshooting

**Videos show "Loading..." text:**
- Check that your API key is correct in `js/main.js`
- Check browser console for errors (F12 → Console tab)
- Verify your API key has YouTube Data API v3 enabled

**"Project Video" displays instead of real title:**
- API key not set or incorrect
- Check console for specific error messages

## No API Key?

If you don't want to use an API key, you can still manually set titles and descriptions in the HTML:

```html
<h4 class="video-title">My Custom Project Title</h4>
<p class="video-description">My custom project description</p>
```

The JavaScript will gracefully handle missing API keys.
