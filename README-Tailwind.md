Tailwind CLI usage (project additions)

I added a small Tailwind CLI workflow so you don't have to use PostCSS as a plugin.

Files added/changed

- src/styles/tailwind.css - Tailwind input file with @tailwind directives.
- src/index.css - Generated CSS (output from Tailwind CLI).
- package.json - new scripts and devDependency `concurrently`.

New npm scripts

- dev:css - Build CSS in watch mode
  tailwindcss -i ./src/styles/tailwind.css -o ./src/index.css --watch
- dev - Vite dev server (unchanged)
- dev:all - Run both the CSS watcher and Vite in one terminal (uses concurrently)
  concurrently "npm:dev:css" "npm:dev"
- build:css - Generate minified CSS for production
  tailwindcss -i ./src/styles/tailwind.css -o ./src/index.css --minify
- build:all - Run build:css and then the app build
  npm run build:css && npm run build

How to run (PowerShell)

1. Install dependencies (if not installed yet):

   cd "d:\AI Trainigs Projects\portifolio-app"
   npm install

2. Development: two terminals (simple):

   # terminal 1 (CSS watcher)

   npm run dev:css

   # terminal 2 (Vite dev)

   npm run dev

or a single terminal (uses concurrently):

npm run dev:all

3. Production build:

   npm run build:all

Notes

- The generated CSS file is `src/index.css`. It's imported at the top of `src/main.tsx` so it is included in the app.
- If you prefer not to add `concurrently`, run the two scripts in separate terminals.
- If you want to re-enable PostCSS usage instead of this CLI workflow, we can revert the changes.

If you want me to run `npm install` and start `dev:all` here, confirm and I'll execute those commands in your workspace.
