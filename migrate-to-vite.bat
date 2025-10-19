@echo off
echo.
echo 🚀 Migrating to Vite structure...
echo.

REM Create src directories
if not exist "src\components\ui" mkdir src\components\ui
REM helper 'figma' components removed; no separate folder needed

REM Move components
echo 📦 Moving components to src/components...
xcopy /Y /Q components\*.tsx src\components\ 2>nul
xcopy /Y /Q components\ui\*.tsx src\components\ui\ 2>nul
xcopy /Y /Q components\ui\*.ts src\components\ui\ 2>nul
REM no figma components to copy

REM Move App.tsx and styles
echo 📦 Moving App.tsx and styles...
copy /Y App.tsx src\App.tsx >nul
xcopy /Y /E /I styles src\styles >nul

echo.
echo ✅ Migration complete!
echo.
echo 📋 Next steps:
echo 1. Run: npm install
echo 2. Run: npm run dev
echo 3. Open: http://localhost:5173
echo.
echo 📹 To add your hometown video:
echo    - Create a 'public' folder
echo    - Add your video: public\hometown.mp4
echo    - Update src\components\Hero.tsx with the video path
echo.
pause
