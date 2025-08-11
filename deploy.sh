#!/bin/bash

# Kooreh Deployment Script
# This script builds and deploys the Kooreh application

set -e  # Exit on any error

echo "🚀 Starting Kooreh deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "📦 Dependencies already installed"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one from env.example"
    echo "   Copy env.example to .env and fill in your configuration values"
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist/ directory not found."
    exit 1
fi

echo "✅ Frontend built successfully"

# Check if we should start the production server
if [ "$1" = "--start" ]; then
    echo "🚀 Starting production server..."
    export NODE_ENV=production
    npm run start:prod
else
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "To start the production server, run:"
    echo "  npm run start:prod"
    echo ""
    echo "Or use this script with:"
    echo "  ./deploy.sh --start"
fi

echo ""
echo "🎉 Kooreh is ready for production!"
