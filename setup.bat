@echo off
REM Setup script to migrate files to src directory structure for Vite

echo Setting up Vite project structure...

REM Create src directories
if not exist "src\components\ui" mkdir src\components\ui
if not exist "public" mkdir public

REM Copy component files
echo Copying components...
xcopy /Y /Q components\*.tsx src\components\ 2>nul
xcopy /Y /Q components\ui\*.tsx src\components\ui\ 2>nul
xcopy /Y /Q components\ui\*.ts src\components\ui\ 2>nul
REM no figma components to copy

echo.
echo ✓ Project structure created!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open http://localhost:5173 in your browser
echo.
echo To add your hometown video:
echo - Place your video file in the /public directory
echo - Update videoUrl in src/components/Hero.tsx to '/your-video.mp4'
echo - Update locationName to your actual location

pause
