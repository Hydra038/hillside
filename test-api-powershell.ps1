# PowerShell script to test the admin order status update API
Write-Host "🧪 Testing Admin Order Status Update API" -ForegroundColor Cyan
Write-Host ""

# Test data
$orderId = "0092aeba-ed2a-491e-bf30-8b731942eff7"
$apiUrl = "http://localhost:3000/api/admin/orders/$orderId"
$testStatus = "processing"

Write-Host "📋 Test Details:" -ForegroundColor Yellow
Write-Host "   Order ID: $orderId"
Write-Host "   API URL: $apiUrl"
Write-Host "   Status: $testStatus"
Write-Host ""

# Test body
$body = @{
    status = $testStatus
} | ConvertTo-Json

Write-Host "📤 Request Body: $body" -ForegroundColor Green
Write-Host ""

try {
    Write-Host "🚀 Making API Request..." -ForegroundColor Cyan
    
    # Make the request (this will fail with 401 since we don't have auth token)
    $response = Invoke-WebRequest -Uri $apiUrl -Method PATCH -Body $body -ContentType "application/json" -ErrorAction Stop
    
    Write-Host "✅ Unexpected Success!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
    
}
catch {
    Write-Host "📊 Response Details:" -ForegroundColor Yellow
    
    if ($_.Exception.Response) {
        $statusCode = [int]$_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        
        Write-Host "   Status Code: $statusCode" -ForegroundColor Red
        Write-Host "   Status Description: $statusDescription" -ForegroundColor Red
        
        # Try to read the response body
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            Write-Host "   Response Body: $responseBody" -ForegroundColor Red
        }
        catch {
            Write-Host "   Could not read response body: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        if ($statusCode -eq 401) {
            Write-Host ""
            Write-Host "✅ Expected 401 - Authentication required" -ForegroundColor Green
            Write-Host "   This confirms the API endpoint is working"
            Write-Host "   The issue is likely with authentication in the browser"
        }
    }
    else {
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check if you're logged in as admin in the browser"
Write-Host "2. Open browser dev tools and check the auth-token cookie"
Write-Host "3. Try the update again in the admin interface"
Write-Host "4. Check the enhanced error logging in browser console"