@echo off
echo ========================================
echo Koor Project Merge - Cleanup and Test
echo ========================================
echo.

echo [1/4] Testing the merged project...
echo Starting development server...
start "Koor Dev Server" cmd /k "npm run dev"

echo.
echo [2/4] Waiting for server to start...
timeout /t 5 /nobreak >nul

echo.
echo [3/4] Opening the application in browser...
start http://localhost:3000

echo.
echo [4/4] Cleanup instructions:
echo.
echo Once you're satisfied the merged project works:
echo 1. Stop the development server (Ctrl+C)
echo 2. Delete the old /kore folder from your workspace
echo 3. The merged project is now complete in /koor
echo.
echo ========================================
echo Merge completed successfully!
echo ========================================
pause
