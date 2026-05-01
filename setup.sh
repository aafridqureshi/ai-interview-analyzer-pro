#!/bin/bash
# Quick Setup Script for AI Interview Analyzer

echo "🚀 AI Interview Analyzer - Quick Setup"
echo "======================================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd server
npm install
echo "✅ Backend dependencies installed"

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../client
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Configure server/.env with your MongoDB URI and API keys"
echo "2. Configure client/.env with your API URL (default: http://localhost:3001)"
echo ""
echo "To start the project:"
echo "  Terminal 1: cd server && npm start"
echo "  Terminal 2: cd client && npm run dev"
echo ""
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:5173"
