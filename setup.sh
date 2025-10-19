#!/bin/bash

# Setup script to migrate files to src directory structure for Vite

echo "Setting up Vite project structure..."

# Create src directories
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p public

# Copy component files
echo "Copying components..."
cp -r components/*.tsx src/components/ 2>/dev/null || true
cp -r components/ui/*.tsx src/components/ui/ 2>/dev/null || true
cp -r components/ui/*.ts src/components/ui/ 2>/dev/null || true
cp -r components/figma/*.tsx src/components/figma/ 2>/dev/null || true

echo "✅ Project structure created!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "To add your hometown video:"
echo "- Place your video file in the /public directory"
echo "- Update videoUrl in src/components/Hero.tsx to '/your-video.mp4'"
echo "- Update locationName to your actual location"
