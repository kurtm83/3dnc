import json
import os
import urllib.request
from pathlib import Path

base_path = r"C:\Users\kurve\Nextcloud\Documents\Code\GCODE.SUPPLY"
json_path = os.path.join(base_path, "portfolio", "projects.json")
images_base = os.path.join(base_path, "images", "portfolio", "project-images")

# Create directories
Path(images_base).mkdir(parents=True, exist_ok=True)

print("Downloading portfolio images...")

with open(json_path, 'r') as f:
    data = json.load(f)

downloaded = 0

for project in data['projects']:
    project_id = project['id']
    project_dir = os.path.join(images_base, project_id)
    Path(project_dir).mkdir(parents=True, exist_ok=True)
    
    new_images = []
    
    for url in project.get('images', []):
        filename = url.split('?')[0].split('/')[-1]
        filepath = os.path.join(project_dir, filename)
        new_url = f"project-images/{project_id}/{filename}"
        
        if os.path.exists(filepath):
            print(f"  ✓ {filename} (cached)")
            new_images.append(new_url)
            continue
        
        print(f"  ↓ {filename}...", end=" ")
        try:
            urllib.request.urlretrieve(url, filepath)
            print("✓")
            new_images.append(new_url)
            downloaded += 1
        except:
            print("✗")
            new_images.append(url)
    
    project['images'] = new_images

with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"\nMigration complete! Downloaded {downloaded} images")
