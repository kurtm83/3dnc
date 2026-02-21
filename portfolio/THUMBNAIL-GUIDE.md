# Portfolio Recent Projects - Thumbnail Setup

## Overview
The recent projects page now displays a clean grid of project thumbnails that you can filter by category (Theatre, Retail, Events).

## Adding Thumbnail Images

### Quick Method: Pick from Existing Images

1. **Look at your projects in [projects.json](projects.json)**
2. **For each project, select ONE representative image** from the `images` array
3. **Download that image** and save it to `/images/portfolio/`
4. **Name it according to the pattern** in the thumbnail field

### Example: LIQUID IV Project

The projects.json currently has:
```json
"thumbnail": "images/portfolio/liquid-iv-thumb.jpg"
```

**To add this thumbnail:**
1. Visit the first image URL: `https://3dnccom.wordpress.com/wp-content/uploads/2025/11/liv_page-3.png`
2. Download it
3. Save as `/images/portfolio/liquid-iv-thumb.jpg`

### All Thumbnails Needed:

Here are the suggested images you should download for each project:

1. **LIQUID IV** → `liquid-iv-thumb.jpg`
   - Suggested: liv_page-3.png (the main hero shot)

2. **ELF THE MUSICAL** → `elf-thumb.jpg`
   - Suggested: snag_84b2043.png (the stage layout)

3. **SUNSET BLVD** → `sunset-thumb.jpg`
   - Suggested: snag_4af676c.png (the dramatic rendering)

4. **Hermès ICE CREAM BENCH** → `hermes-thumb.jpg`
   - Suggested: snag_a839ad7.png (the product shot)

5. **STEREOPHONIC** → `stereophonic-thumb.jpg`
   - Suggested: stereo-pg1.png (the stage design)

6. **MOROCCANOIL** → `moroccanoil-thumb.jpg`
   - Suggested: mo-pg1.png (the display layout)

7. **ALBUM LISTENING PARTY** → `album-thumb.jpg`
   - Suggested: alp-pg2.png (the venue layout)

8. **THE GOLFERS JOURNAL** → `golfers-thumb.jpg`
   - Suggested: 2023-04-28_19-35-51.jpg (the photo)

### Image Requirements

- **Format:** JPG or PNG
- **Recommended Size:** 700-1000px wide (will be cropped to 16:10 aspect ratio)
- **File Naming:** Use lowercase, hyphens for spaces, descriptive names
- **Location:** `/images/portfolio/` folder

### If Images Don't Load

If you see a broken image icon on the projects page:
1. Check the file path matches exactly what's in projects.json
2. Verify the image file exists in `/images/portfolio/`
3. Check the file extension (.jpg vs .png)

### Creating a Placeholder

Until you add real thumbnails, you can create a simple placeholder:
1. Create a 800x500px image with text like "Project Thumbnail"
2. Save as `/images/portfolio/placeholder.jpg`
3. The system will automatically use this if a thumbnail is missing

## Adding New Projects

To add a new project to the grid:

1. Open [projects.json](projects.json)
2. Add a new project object following this template:

```json
{
  "id": "unique-project-id",
  "title": "PROJECT NAME",
  "description": "Brief description of the project",
  "thumbnail": "images/portfolio/project-thumb.jpg",
  "category": "Theatre", // or "Retail" or "Events"
  "date": "2026-01",
  "instagramUrl": "https://instagram.com/...", // optional
  "images": [
    "full-url-to-image-1",
    "full-url-to-image-2"
  ]
}
```

3. Add the thumbnail image to `/images/portfolio/`
4. Refresh the page - your project will appear!

## Features

- **Filter by Category:** Click Theatre, Retail, or Events to filter the grid
- **Click to View:** Click any project card to open a modal with all images
- **Instagram Links:** If you add an `instagramUrl`, a button appears in the modal
- **Responsive:** Grid adapts from 3 columns → 2 columns → 1 column on mobile
- **Hover Effects:** Cards lift and show "View Project" overlay on hover

## Technical Details

- **Data:** `portfolio/projects.json`
- **JavaScript:** `portfolio/js/projects.js`
- **HTML:** `portfolio/recent-projects.html`
- **CSS:** Added to `css/style.css` (search for "Portfolio Projects Grid")

## Tips

- Use high-quality, representative images as thumbnails
- Keep descriptions concise (1-2 sentences)
- Choose thumbnails that look good when cropped to 16:10 ratio
- Group related projects under the same category for easier browsing
