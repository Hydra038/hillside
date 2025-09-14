# PowerShell script to download product images
# Run these commands one by one in PowerShell

# Create the directory structure
New-Item -ItemType Directory -Force -Path "public\images\products"

# Download each image
Write-Host "Downloading Premium Oak Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\oak-logs.jpg"

Write-Host "Downloading Mixed Hardwood Bundle..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1551801841-ecad875a020?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\mixed-hardwood.jpg"

Write-Host "Downloading Birch Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1445024441609-ba2eb8650f95?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\birch-logs.jpg"

Write-Host "Downloading Ash Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\ash-logs.jpg"

Write-Host "Downloading Kindling Bundle..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\kindling-bundle.jpg"

Write-Host "Downloading Beech Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\beech-logs.jpg"

Write-Host "Downloading Special Offer 5 Tonnes..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1550985543-52d8ee9d0c2c?w=400&h=300&fit=crop&auto=format" -OutFile "public\images\products\special-offer-5-tonnes.jpg"

Write-Host "All images downloaded successfully!"
Write-Host "Files saved to: public\images\products\"

# List the downloaded files
Get-ChildItem "public\images\products\" | Format-Table Name, Length
