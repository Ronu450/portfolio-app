# Portfolio Website

A modern, colorful portfolio website built with React, TypeScript, Vite, and Tailwind CSS v4.

## Features

- 🎨 Vibrant gradient color scheme with purple, pink, and indigo
- 🎥 Video background support in hero section
- 📱 Fully responsive design
- ✏️ Dynamic content management with CRUD operations
- 🎭 Smooth animations and hover effects
- 📧 Contact form with toast notifications
- 🖼️ Image gallery with lightbox view
- 📝 Personal stories/blog section
- 💼 Work experience and education sections

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Quick Setup

**Step 1: Run the migration script**

This will copy all your components and files into the proper Vite `/src` directory structure.

On Mac/Linux:

```bash
chmod +x migrate-to-vite.sh
./migrate-to-vite.sh
```

On Windows:

```bash
migrate-to-vite.bat
```

**Step 2: Install dependencies**

```bash
npm install
```

**Step 3: Start the development server**

```bash
npm run dev
```

**Step 4: Open your browser**
Navigate to `http://localhost:5173` 🎉

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── Hero.tsx         # Hero section with video background
│   │   ├── About.tsx        # About section
│   │   ├── Experience.tsx   # Work experience section
│   │   ├── Education.tsx    # Education section
│   │   ├── Stories.tsx      # Personal stories/blog
│   │   ├── Gallery.tsx      # Image gallery
│   │   ├── Contact.tsx      # Contact form
│   │   └── Navigation.tsx   # Navigation bar
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── styles/
│   │   └── globals.css      # Global styles and Tailwind config
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── postcss.config.js
```

## Customization

### Adding Your Video Background

In `src/components/Hero.tsx`, update the `videoUrl` state:

```typescript
const [videoUrl, setVideoUrl] = useState("path/to/your/video.mp4");
const [locationName, setLocationName] = useState("Your City, Country");
```

### Updating Colors

Edit the CSS custom properties in `src/styles/globals.css`:

```css
:root {
  --primary: #6366f1; /* Indigo */
  --secondary: #ec4899; /* Pink */
  --accent: #8b5cf6; /* Purple */
  /* ... */
}
```

### Personal Information

Update the following in respective components:

- Ronu Skariah in `Hero.tsx` and `Navigation.tsx`
- Contact details in `Contact.tsx`
- Social media links in `Contact.tsx`
- Initial portfolio items in each section

## Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications
- **React Hook Form** - Form handling

## License

MIT License - feel free to use this project for your own portfolio!
