import os
import urllib.request
from pathlib import Path

base_path = r"C:\Users\kurve\Nextcloud\Documents\Code\GCODE.SUPPLY"
showcase_dir = os.path.join(base_path, "images", "portfolio", "project-images", "showcase")

Path(showcase_dir).mkdir(parents=True, exist_ok=True)

images = [
    ('https://3dnccom.wordpress.com/wp-content/uploads/2025/11/fswc-kw-dwg-3dnc.png', 'fswc-kw-dwg-3dnc.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_720172f9.png', 'snag_720172f9.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2cff.png', 'snag_729a2cff.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2ce0.png', 'snag_729a2ce0.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2cd0.png', 'snag_729a2cd0.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2cb1.png', 'snag_729a2cb1.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2c92.png', 'snag_729a2c92.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2c72.png', 'snag_729a2c72.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2c05.png', 'snag_729a2c05.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/snag_729a2b78.png', 'snag_729a2b78.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/soffit_solid.png', 'soffit_solid.png'),
    ('https://3dnccom.wordpress.com/wp-content/uploads/2024/06/soffit_explo.png', 'soffit_explo.png'),
]

print("Downloading showcase images...")
downloaded = 0

for url, filename in images:
    filepath = os.path.join(showcase_dir, filename)
    
    if os.path.exists(filepath):
        print(f"  ✓ {filename} (cached)")
        continue
    
    print(f"  ↓ {filename}...", end=" ")
    try:
        urllib.request.urlretrieve(url, filepath)
        print("✓")
        downloaded += 1
    except Exception as e:
        print(f"✗ ({str(e)[:30]})")

print(f"\nDownloaded {downloaded} showcase images")
