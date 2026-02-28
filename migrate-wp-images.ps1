$basePath = "C:\Users\kurve\Nextcloud\Documents\Code\GCODE.SUPPLY"
$jsonPath = "$basePath\portfolio\projects.json"
$imgBasePath = "$basePath\images\portfolio\project-images"

New-Item -ItemType Directory -Path $imgBasePath -Force | Out-Null

Write-Host "Downloading portfolio images..." -ForegroundColor Cyan

$json = Get-Content $jsonPath | ConvertFrom-Json
$downloaded = 0

foreach ($project in $json.projects) {
    $projImages = @()
    $projectDir = "$imgBasePath\$($project.id)"
    New-Item -ItemType Directory -Path $projectDir -Force | Out-Null
    
    foreach ($url in $project.images) {
        $filename = (($url -split "\?")[0]).Split("/")[-1]
        $filepath = "$projectDir\$filename"
        $newUrl = "project-images/$($project.id)/$filename"
        
        if (Test-Path $filepath) {
            Write-Host "  ✓ $filename (cached)" -ForegroundColor Green
            $projImages += $newUrl
            continue
        }
        
        Write-Host "  ↓ $filename" -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $filepath -ErrorAction SilentlyContinue
        
        if (Test-Path $filepath) {
            Write-Host " OK" -ForegroundColor Green
            $projImages += $newUrl
            $downloaded++
        } else {
            Write-Host " FAIL" -ForegroundColor Red
            $projImages += $url
        }
    }
    
    $project.images = $projImages
}

$json | ConvertTo-Json -Depth 10 | Set-Content -Path $jsonPath
Write-Host "`nMigration complete! Downloaded: $downloaded images" -ForegroundColor Cyan
