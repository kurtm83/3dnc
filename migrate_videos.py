import os
import urllib.request
from pathlib import Path

base_path = r"C:\Users\kurve\Nextcloud\Documents\Code\GCODE.SUPPLY"
videos_dir = os.path.join(base_path, "images", "portfolio", "videos")

Path(videos_dir).mkdir(parents=True, exist_ok=True)

videos = [
    ('https://videos.files.wordpress.com/1NiF0wJW/pavilion-interior-long-pan.mp4', 'pavilion-interior-long-pan.mp4'),
    ('https://videos.files.wordpress.com/oRneVr2F/n4-tt-ren_sh_wf.mp4', 'n4-tt-ren_sh_wf.mp4'),
    ('https://videos.files.wordpress.com/akIRabiQ/ankle-brace-concept-demo.mp4', 'ankle-brace-concept-demo.mp4'),
    ('https://videos.files.wordpress.com/JWcrQ4P7/hollow-head-1.mp4', 'hollow-head-1.mp4'),
    ('https://videos.files.wordpress.com/5HpMH4qi/shark-fin-bass-shaker-final.mp4', 'shark-fin-bass-shaker-final.mp4'),
    ('https://videos.files.wordpress.com/fjuVrE5A/pavilion-crane-shot.mp4', 'pavilion-crane-shot.mp4'),
    ('https://videos.files.wordpress.com/f1CbLYh3/ct-elevate.mp4', 'ct-elevate.mp4'),
    ('https://videos.files.wordpress.com/wlAgWvqQ/video.mp4', 'video.mp4'),
]

print("Downloading portfolio videos...")
downloaded = 0
failed = 0

for url, filename in videos:
    filepath = os.path.join(videos_dir, filename)
    
    if os.path.exists(filepath):
        size_mb = os.path.getsize(filepath) / (1024*1024)
        print(f"  ✓ {filename} ({size_mb:.1f} MB cached)")
        continue
    
    print(f"  ↓ {filename}...", end=" ", flush=True)
    try:
        urllib.request.urlretrieve(url, filepath, reporthook=lambda a,b,c: None)
        size_mb = os.path.getsize(filepath) / (1024*1024)
        print(f"✓ ({size_mb:.1f} MB)")
        downloaded += 1
    except Exception as e:
        print(f"✗ Failed")
        failed += 1
        if os.path.exists(filepath):
            os.remove(filepath)

print(f"\nVideo migration: {downloaded} downloaded, {failed} failed")

# Now update animations.html
html_path = os.path.join(base_path, 'portfolio', 'animations.html')

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = [
    ('https://videos.files.wordpress.com/1NiF0wJW/pavilion-interior-long-pan.mp4', '../images/portfolio/videos/pavilion-interior-long-pan.mp4'),
    ('https://videos.files.wordpress.com/oRneVr2F/n4-tt-ren_sh_wf.mp4', '../images/portfolio/videos/n4-tt-ren_sh_wf.mp4'),
    ('https://videos.files.wordpress.com/akIRabiQ/ankle-brace-concept-demo.mp4', '../images/portfolio/videos/ankle-brace-concept-demo.mp4'),
    ('https://videos.files.wordpress.com/JWcrQ4P7/hollow-head-1.mp4', '../images/portfolio/videos/hollow-head-1.mp4'),
    ('https://videos.files.wordpress.com/5HpMH4qi/shark-fin-bass-shaker-final.mp4', '../images/portfolio/videos/shark-fin-bass-shaker-final.mp4'),
    ('https://videos.files.wordpress.com/fjuVrE5A/pavilion-crane-shot.mp4', '../images/portfolio/videos/pavilion-crane-shot.mp4'),
    ('https://videos.files.wordpress.com/f1CbLYh3/ct-elevate.mp4', '../images/portfolio/videos/ct-elevate.mp4'),
    ('https://videos.files.wordpress.com/wlAgWvqQ/video.mp4', '../images/portfolio/videos/video.mp4'),
]

for old_url, new_path in replacements:
    if old_url in content:
        content = content.replace(old_url, new_path)
        print(f"  ✓ Updated: {new_path.split('/')[-1]}")

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ Updated animations.html")
