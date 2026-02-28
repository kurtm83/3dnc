import re

html_path = r"C:\Users\kurve\Nextcloud\Documents\Code\GCODE.SUPPLY\portfolio\index.html"

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace WordPress image URLs with local paths
replacements = [
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2025/11/fswc-kw-dwg-3dnc\.png\?w=1024', 'project-images/portfolio-showcase/fswc-kw-dwg-3dnc.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_720172f9\.png\?w=1024', 'project-images/showcase/snag_720172f9.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_720172f9\.png', 'project-images/showcase/snag_720172f9.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cff\.png\?w=927', 'project-images/showcase/snag_729a2cff.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cff\.png', 'project-images/showcase/snag_729a2cff.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2ce0\.png\?w=1024', 'project-images/showcase/snag_729a2ce0.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2ce0\.png', 'project-images/showcase/snag_729a2ce0.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cd0\.png\?w=563', 'project-images/showcase/snag_729a2cd0.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cd0\.png', 'project-images/showcase/snag_729a2cd0.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cb1\.png\?w=698', 'project-images/showcase/snag_729a2cb1.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2cb1\.png', 'project-images/showcase/snag_729a2cb1.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c92\.png\?w=927', 'project-images/showcase/snag_729a2c92.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c92\.png', 'project-images/showcase/snag_729a2c92.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c72\.png\?w=871', 'project-images/showcase/snag_729a2c72.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c72\.png', 'project-images/showcase/snag_729a2c72.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c05\.png\?w=927', 'project-images/showcase/snag_729a2c05.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2c05\.png', 'project-images/showcase/snag_729a2c05.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2b78\.png\?w=927', 'project-images/showcase/snag_729a2b78.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/snag_729a2b78\.png', 'project-images/showcase/snag_729a2b78.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/soffit_solid\.png\?w=926', 'project-images/showcase/soffit_solid.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/soffit_solid\.png', 'project-images/showcase/soffit_solid.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/soffit_explo\.png\?w=926', 'project-images/showcase/soffit_explo.png'),
    (r'https://3dnccom\.wordpress\.com/wp-content/uploads/2024/06/soffit_explo\.png', 'project-images/showcase/soffit_explo.png'),
]

count = 0
for pattern, replacement in replacements:
    matches = re.findall(pattern, content)
    if matches:
        content = re.sub(pattern, replacement, content)
        count += len(matches)
        print(f"  Replaced: {pattern.split('/')[-1].replace(r'\.', '.')[:40]}... ({len(matches)}x)")

# Generic fallback for any remaining WordPress URLs
pattern = r'https://3dnccom\.wordpress\.com/wp-content/uploads/\d{4}/\d{2}/([^?"\s]+)(?:\?[^"]*)?'
matches = re.findall(pattern, content)
if matches:
    for filename in set(matches):
        old_pattern = rf'https://3dnccom\.wordpress\.com/wp-content/uploads/\d{{4}}/\d{{2}}/{re.escape(filename)}(?:\?[^"]*)?'
        new_path = f'project-images/showcase/{filename}'
        content = re.sub(old_pattern, new_path, content)
    print(f"  Replaced {len(set(matches))} additional items using generic pattern")
    count += len(matches)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✓ Updated portfolio/index.html ({count} replacements)")
