@echo off
REM Kooreh Deployment Script for Windows
REM This script builds and deploys the Kooreh application

echo 🚀 Starting Kooreh deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
) else (
    echo 📦 Dependencies already installed
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  Warning: .env file not found. Please create one from env.example
    echo    Copy env.example to .env and fill in your configuration values
)

REM Build the frontend
echo 🔨 Building frontend...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Build failed. dist/ directory not found.
    pause
    exit /b 1
)

echo ✅ Frontend built successfully

REM Check if we should start the production server
if "%1"=="--start" (
    echo 🚀 Starting production server...
    set NODE_ENV=production
    npm run start:prod
) else (
    echo ✅ Deployment completed successfully!
    echo.
    echo To start the production server, run:
    echo   npm run start:prod
    echo.
    echo Or use this script with:
    echo   deploy.bat --start
)

echo.
echo 🎉 Kooreh is ready for production!
pause
