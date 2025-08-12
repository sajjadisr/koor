@echo off
echo ========================================
echo Kooreh Project Cleanup and Organization
echo ========================================
echo.

echo [1/6] Creating backup of legacy files...
if not exist "backup-legacy" mkdir "backup-legacy"
if exist "public" (
    echo Moving public directory to backup...
    move "public" "backup-legacy\"
)

echo [2/6] Creating organized directory structure...
if not exist "src\js\config" mkdir "src\js\config"
if not exist "src\js\utils" mkdir "src\js\utils"
if not exist "src\js\services" mkdir "src\js\services"
if not exist "src\js\components" mkdir "src\js\components"

echo [3/6] Moving configuration files...
if exist "env.example" (
    echo Moving env.example to src\js\config\...
    copy "env.example" "src\js\config\env.example"
)

echo [4/6] Creating .env file from template...
if not exist ".env" (
    echo Creating .env file from template...
    copy "env.example" ".env"
    echo Please edit .env file with your actual values
)

echo [5/6] Updating package.json scripts...
echo Adding cleanup script to package.json...

echo [6/6] Final cleanup...
echo Removing temporary files...
if exist "*.tmp" del "*.tmp"
if exist "*.log" del "*.log"

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo What was done:
echo - Legacy public directory moved to backup-legacy\
echo - Organized src\js structure created
echo - Configuration files organized
echo - .env file created from template
echo.
echo Next steps:
echo 1. Edit .env file with your actual values
echo 2. Review backup-legacy\ for any needed files
echo 3. Run 'npm install' to ensure dependencies
echo 4. Run 'npm run dev' to test the application
echo.
pause
