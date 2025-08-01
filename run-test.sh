#!/bin/bash

# Single Ballot System Test Runner
# Quick setup and execution script

echo "🗳️  Single Ballot System Test Runner"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if backend is running
echo "🔍 Checking if backend is running..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "❌ Backend is not running on localhost:5000"
    echo "Please start the backend server first:"
    echo "  cd backend && npm start"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Menu for test selection
echo ""
echo "Select test to run:"
echo "1) Quick Test (30 seconds, fully automated)"
echo "2) Full Test (5-10 minutes, interactive)"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Running Quick Test..."
        node test-quick-ballot.js
        ;;
    2)
        echo "🧪 Running Full Test..."
        node test-single-ballot-system.js
        ;;
    3)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

# Check exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Test completed successfully!"
    echo "✅ Single ballot system is working correctly"
else
    echo ""
    echo "💥 Test failed!"
    echo "❌ Please check the error messages above"
    exit 1
fi