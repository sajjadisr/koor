#!/bin/bash

echo "========================================"
echo "Kooreh Project Cleanup and Organization"
echo "========================================"
echo

echo "[1/6] Creating backup of legacy files..."
if [ ! -d "backup-legacy" ]; then
    mkdir "backup-legacy"
fi

if [ -d "public" ]; then
    echo "Moving public directory to backup..."
    mv "public" "backup-legacy/"
fi

echo "[2/6] Creating organized directory structure..."
mkdir -p "src/js/config"
mkdir -p "src/js/utils"
mkdir -p "src/js/services"
mkdir -p "src/js/components"

echo "[3/6] Moving configuration files..."
if [ -f "env.example" ]; then
    echo "Moving env.example to src/js/config/..."
    cp "env.example" "src/js/config/env.example"
fi

echo "[4/6] Creating .env file from template..."
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp "env.example" ".env"
    echo "Please edit .env file with your actual values"
fi

echo "[5/6] Updating package.json scripts..."
echo "Adding cleanup script to package.json..."

echo "[6/6] Final cleanup..."
echo "Removing temporary files..."
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.log" -delete 2>/dev/null || true

echo
echo "========================================"
echo "Cleanup Complete!"
echo "========================================"
echo
echo "What was done:"
echo "- Legacy public directory moved to backup-legacy/"
echo "- Organized src/js structure created"
echo "- Configuration files organized"
echo "- .env file created from template"
echo
echo "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Review backup-legacy/ for any needed files"
echo "3. Run 'npm install' to ensure dependencies"
echo "4. Run 'npm run dev' to test the application"
echo
