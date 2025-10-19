# Setup Instructions - Vite React Portfolio

## Understanding the Current Structure

Right now you have **two sets of files**:

1. **Root directory** (`/App.tsx`, `/components`, `/styles`) - Your current working files
2. **src directory** (`/src`) - Where Vite expects files to be

For Vite to work properly, **everything needs to be inside `/src`**.

## Why the Duplication?

When I set up Vite, I created the `/src` structure, but your original files remained in the root. This is why you're seeing duplicates. Don't worry - we'll fix this!

## Solution: Run the Migration Script

The migration script will copy all your files to the correct locations inside `/src`.

### On Mac/Linux:

```bash
chmod +x migrate-to-vite.sh
./migrate-to-vite.sh
npm install
npm run dev
```

### On Windows:

```bash
migrate-to-vite.bat
npm install
npm run dev
```

## What the Migration Script Does

1. ✅ Copies `/App.tsx` → `/src/App.tsx`
2. ✅ Copies `/components/*` → `/src/components/*`
3. ✅ Copies `/styles/*` → `/src/styles/*`
4. ✅ Creates proper directory structure

## After Migration

Your `/src` folder will look like this:

```
src/
├── components/
│   ├── ui/              # All Shadcn components
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Education.tsx
│   ├── Experience.tsx
│   ├── Gallery.tsx
│   ├── Hero.tsx         # With video background support
│   ├── Navigation.tsx
│   └── Stories.tsx
├── lib/
│   └── utils.ts         # Utility functions
├── styles/
│   └── globals.css      # Your colorful theme
├── App.tsx              # Main app
└── main.tsx             # Vite entry point
```

## Optional: Cleanup Old Files

After migration and confirming everything works, you can delete the old root files:

```bash
# ONLY do this after confirming the app works!
rm -rf components/
rm -rf styles/
rm App.tsx
```

⚠️ **Important:** Test your app first with `npm run dev` before deleting anything!

## Final File Structure

After cleanup, your project will have:

```
portfolio-website/
├── public/              # Static files (add your video here)
├── src/                 # ALL your React code lives here
│   ├── components/
│   ├── lib/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
├── index.html           # Entry HTML
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Common Questions

### Q: Do I need to keep both `/src` and root files?

**A:** No! After migration, only keep files in `/src`. The root files are the originals.

### Q: Can I just delete the `/src` folder instead?

**A:** No, Vite requires the `/src` structure. You need to migrate to it.

### Q: What if I make changes to the root files?

**A:** After migration, make all changes in `/src` files. The root files will be outdated.

### Q: Where do I add my hometown video?

**A:** Create a `/public` folder and add it there (e.g., `/public/my-video.mp4`)

## Troubleshooting

**Issue:** Script says "file not found"

- Make sure you're in the project root directory
- Run `ls` (Mac/Linux) or `dir` (Windows) to verify you see `App.tsx`

**Issue:** npm run dev fails

- Make sure you ran `npm install` first
- Check that `/src/main.tsx` exists
- Look for error messages in the console

## Need Help?

If you encounter issues:

1. Check that the migration script completed successfully
2. Verify files are in `/src` directory
3. Run `npm install` to ensure all dependencies are installed
4. Check the browser console for error messages

---

Happy coding! 🚀
