#!/bin/bash

echo "🚀 Migrating to Vite structure..."
echo ""

# Create src directories
mkdir -p src/components/ui
mkdir -p src/components/figma

# Move components
echo "📦 Moving components to src/components..."
cp components/*.tsx src/components/ 2>/dev/null || true
cp components/ui/*.tsx src/components/ui/ 2>/dev/null || true
cp components/ui/*.ts src/components/ui/ 2>/dev/null || true
cp components/figma/*.tsx src/components/figma/ 2>/dev/null || true

# Move App.tsx and styles
echo "📦 Moving App.tsx and styles..."
cp App.tsx src/App.tsx
cp -r styles src/

echo ""
echo "✅ Migration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:5173"
echo ""
echo "📹 To add your hometown video:"
echo "   - Create a 'public' folder: mkdir public"
echo "   - Add your video: public/hometown.mp4"
echo "   - Update src/components/Hero.tsx with the video path"
