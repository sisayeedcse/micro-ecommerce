# User Service Testing Script
# Run this in PowerShell after starting the user service

Write-Host "`n=== Testing User Service ===" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/" -Method Get
    Write-Host "✓ Service is running: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "✗ Service not responding: $_" -ForegroundColor Red
}

# Test 2: Register New User
Write-Host "`n2. Register User" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    Write-Host "✓ User registered: $($registerResponse.message)" -ForegroundColor Green
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorDetails.message -like "*already registered*") {
        Write-Host "⚠ User already exists (expected if running multiple times)" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Registration failed: $($errorDetails.message)" -ForegroundColor Red
    }
}

# Test 3: Login User
Write-Host "`n3. Login User" -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 50))..." -ForegroundColor Cyan
    
    # Save token for other tests
    $global:authToken = $loginResponse.token
    
} catch {
    $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "✗ Login failed: $($errorDetails.message)" -ForegroundColor Red
}

# Test 4: Login with Wrong Password
Write-Host "`n4. Login with Wrong Password (should fail)" -ForegroundColor Yellow
$wrongLoginBody = @{
    email = "test@example.com"
    password = "WrongPassword"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/login" `
        -Method Post `
        -Body $wrongLoginBody `
        -ContentType "application/json"
    Write-Host "✗ Security issue: Login succeeded with wrong password!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected wrong password" -ForegroundColor Green
}

# Test 5: Register without required fields
Write-Host "`n5. Register without Email (should fail)" -ForegroundColor Yellow
$invalidRegisterBody = @{
    name = "Invalid User"
    password = "Test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/register" `
        -Method Post `
        -Body $invalidRegisterBody `
        -ContentType "application/json"
    Write-Host "✗ Validation issue: Allowed registration without email!" -ForegroundColor Red
} catch {
    Write-Host "✓ Correctly rejected invalid data" -ForegroundColor Green
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
Write-Host "`nIf you got a token, save it for testing other services!" -ForegroundColor Yellow
