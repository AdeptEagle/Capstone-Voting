# Single Ballot System Test Runner (PowerShell)
# Quick setup and execution script for Windows

Write-Host "🗳️  Single Ballot System Test Runner" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if backend is running
Write-Host "🔍 Checking if backend is running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running on localhost:5000" -ForegroundColor Red
    Write-Host "Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "  cd backend && npm start" -ForegroundColor White
    exit 1
}

# Install dependencies if needed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Menu for test selection
Write-Host ""
Write-Host "Select test to run:" -ForegroundColor Cyan
Write-Host "1) Quick Test (30 seconds, fully automated)" -ForegroundColor White
Write-Host "2) Full Test (5-10 minutes, interactive)" -ForegroundColor White
Write-Host "3) Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Running Quick Test..." -ForegroundColor Green
        node test-quick-ballot.js
        $exitCode = $LASTEXITCODE
    }
    "2" {
        Write-Host "🧪 Running Full Test..." -ForegroundColor Green
        node test-single-ballot-system.js
        $exitCode = $LASTEXITCODE
    }
    "3" {
        Write-Host "👋 Goodbye!" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
        exit 1
    }
}

# Check exit code
if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "🎉 Test completed successfully!" -ForegroundColor Green
    Write-Host "✅ Single ballot system is working correctly" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "💥 Test failed!" -ForegroundColor Red
    Write-Host "❌ Please check the error messages above" -ForegroundColor Red
    exit 1
}