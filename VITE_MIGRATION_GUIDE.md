# Vite Migration Guide

This guide will help you set up your portfolio as a standalone Vite React application.

## Quick Start

### Option 1: Using the Setup Script (Recommended)

**On macOS/Linux:**

```bash
chmod +x setup.sh
./setup.sh
npm install
npm run dev
```

**On Windows:**

```cmd
setup.bat
npm install
npm run dev
```

### Option 2: Manual Setup

1. **Copy all component files to src directory:**

```bash
# Create directories
mkdir -p src/components/ui public

# Copy components
cp components/*.tsx src/components/
cp components/ui/* src/components/ui/
REM no figma helper components to copy
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start the development server:**

```bash
npm run dev
```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

After migration, your project will have this structure:

```
portfolio-website/
├── public/                    # Static assets
│   └── your-video.mp4        # Your hometown video (add this)
├── src/
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Education.tsx
│   │   ├── Experience.tsx
│   │   ├── Gallery.tsx
│   │   ├── Hero.tsx          # Contains video background
│   │   ├── Navigation.tsx
│   │   └── Stories.tsx
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css       # Global styles
│   ├── App.tsx               # Main app
│   └── main.tsx              # Entry point
├── index.html                # HTML entry point
├── package.json
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
└── README.md
```

## Adding Your Hometown Video

1. **Prepare your video:**

   - Recommended format: MP4 (H.264)
   - Recommended resolution: 1920x1080 or 1280x720
   - Keep file size reasonable (< 10MB for faster loading)

2. **Add video to project:**

   - Place your video file in the `/public` directory
   - For example: `/public/my-hometown.mp4`

3. **Update Hero component:**

Open `src/components/Hero.tsx` and update:

```typescript
const [videoUrl, setVideoUrl] = useState("/my-hometown.mp4"); // Your video filename
const [locationName, setLocationName] = useState("San Francisco, CA"); // Your location
```

## Customization Guide

### 1. Update Personal Information

**Navigation & Hero (`src/components/Navigation.tsx` and `src/components/Hero.tsx`):**

```typescript
// Change "Ronu Skariah" to your actual name
<h1 className="text-primary">John Doe</h1>
```

**Hero (`src/components/Hero.tsx`):**

```typescript
// Update your title and description
<h2>Full Stack Developer | Designer | Creative Thinker</h2>
<p>I'm a passionate developer...</p>
```

### 2. Update Contact Information

**Contact (`src/components/Contact.tsx`):**

```typescript
const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "ronu0623@gmail.com", // ← Change this
    href: "mailto:ronu0623@gmail.com",
  },
  // Update phone and location too
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/yourusername" }, // ← Update URLs
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
  },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/yourusername" },
];
```

### 3. Customize Colors

Edit `src/styles/globals.css`:

```css
:root {
  --primary: #6366f1; /* Indigo - Main brand color */
  --secondary: #ec4899; /* Pink - Accent color */
  --accent: #8b5cf6; /* Purple - Secondary accent */
  /* Adjust these to your preferred colors */
}
```

### 4. Add Initial Portfolio Content

Each section (Experience, Education, Stories, Gallery) comes with sample data. Update these in their respective component files:

- **Experience:** `src/components/Experience.tsx` - Line 19
- **Education:** `src/components/Education.tsx` - Line 19
- **Stories:** `src/components/Stories.tsx` - Line 21
- **Gallery:** `src/components/Gallery.tsx` - Line 18

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect Vite
5. Click "Deploy"

### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Click "Deploy"

### Deploy to GitHub Pages

1. Install gh-pages:

```bash
npm install -D gh-pages
```

2. Add to `package.json`:

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/portfolio"
}
```

3. Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: "/portfolio/", // Your repo name
  // ...
});
```

4. Deploy:

```bash
npm run deploy
```

## Troubleshooting

### Issue: Video not showing

**Solution:**

- Ensure video is in `/public` directory
- Use absolute path: `/video.mp4` not `./video.mp4`
- Check video format is MP4
- Open browser console for errors

### Issue: Components not found

**Solution:**

- Run the setup script again
- Manually verify files are in `src/components/`
- Check import paths are correct

### Issue: Styles not applied

**Solution:**

- Ensure `src/styles/globals.css` exists
- Check it's imported in `src/main.tsx`
- Clear browser cache and rebuild

### Issue: Port already in use

**Solution:**

```bash
# Kill process on port 5173
# On macOS/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## Getting Help

- Check the [Vite Documentation](https://vitejs.dev)
- Check the [React Documentation](https://react.dev)
- Check the [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)

## Next Steps

1. ✅ Set up the project structure
2. ✅ Install dependencies
3. ✅ Add your hometown video
4. ✅ Customize personal information
5. ✅ Update contact details
6. ✅ Add your experience and education
7. ✅ Deploy to your preferred platform

Enjoy your new portfolio! 🎉
