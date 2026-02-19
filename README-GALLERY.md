# 3DNC Website - Gallery Management

## Quick Start

To update your website content, edit the configuration files and run the update script.

### Update Script

```bash
node scripts/update-gallery.js
```

This single command updates:
- Featured "Recent Work" section
- Gallery video grid
- Services page video playlist

## Configuration Files

### 1. featured-project.txt

Controls the featured project in the "Recent Work" section.

**Edit this to showcase a new project:**

```
VIDEO_ID=tR23ThTc6WM
TITLE=Custom Drawer Pull Reproduction
DATE=January 2026
DESCRIPTION=Client needed to replace two missing metal drawer pulls...

IMAGE_1=drawer-pull-1.jpg
IMAGE_1_ALT=Metal drawer pull original
IMAGE_2=drawer-pull-2.jpg
IMAGE_2_ALT=3D printed drawer pull reproduction
IMAGE_3=drawer-pull-3.jpg
IMAGE_3_ALT=Completed set of drawer pulls

CHALLENGE=Match existing metal drawer pulls exactly
SOLUTION=3D printed reproductions based on originals
MATERIAL=PLA with bondo filler and metallic finish
QUANTITY=Multiple units for complete set
RESULT=Perfect match, client satisfaction

HIGHLIGHT=Watch the time lapse video above to see the printing process!
```

**Steps to update:**
1. Add your project images to the `images/` folder
2. Edit `featured-project.txt` with your project details
3. Run `node scripts/update-gallery.js`

### 2. youtube-videos.txt

Lists all videos to display in the gallery grid (maintains order).

**Format:**
```
https://youtu.be/tR23ThTc6WM
https://youtu.be/KS9b1L6CTFg
https://youtu.be/4UT1HEY-qXY
```

Add or remove YouTube URLs, one per line. The order here is preserved in the gallery.

## Services Page

The services page automatically cycles through all videos from `youtube-videos.txt` in a **randomized order** that:
- Changes every 24 hours for each visitor
- Can be refreshed with a hard reload (Ctrl+F5)
- Persists across normal page refreshes

## Notes

- Lines starting with `#` are comments (ignored)
- YouTube URLs can be in any format (youtu.be, youtube.com/watch, etc.)
- Images should be placed in the `images/` folder
- The script automatically updates both gallery.html and services.html
