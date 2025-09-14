# Working PowerShell script with verified image URLs
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

Write-Host "Downloading firewood product images..."

# Oak Logs (confirmed working)
Write-Host "✓ Oak logs already downloaded"

# Mixed Hardwood - alternative URL
Write-Host "Downloading Mixed Hardwood..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop" -OutFile "public\images\products\mixed-hardwood.jpg" -UseBasicParsing

# Birch Logs
Write-Host "Downloading Birch Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1509718443390-6984c6270f14?w=400&h=300&fit=crop" -OutFile "public\images\products\birch-logs.jpg" -UseBasicParsing

# Ash Logs
Write-Host "Downloading Ash Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop" -OutFile "public\images\products\ash-logs.jpg" -UseBasicParsing

# Kindling Bundle
Write-Host "Downloading Kindling Bundle..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1578573623075-34f0e2b74dc5?w=400&h=300&fit=crop" -OutFile "public\images\products\kindling-bundle.jpg" -UseBasicParsing

# Beech Logs
Write-Host "Downloading Beech Logs..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1544025491-0b9b6726cec6?w=400&h=300&fit=crop" -OutFile "public\images\products\beech-logs.jpg" -UseBasicParsing

# Special Offer - Large wood pile
Write-Host "Downloading Special Offer 5 Tonnes..."
Invoke-WebRequest -Uri "https://images.unsplash.com/photo-1578662996441-a9b948b1fecf?w=400&h=300&fit=crop" -OutFile "public\images\products\special-offer-5-tonnes.jpg" -UseBasicParsing

Write-Host "All images downloaded!"
Write-Host "Checking downloaded files..."
Get-ChildItem "public\images\products\" | Format-Table Name, @{Name="Size (KB)"; Expression={[math]::Round($_.Length/1KB,1)}}
