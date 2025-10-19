export default {
  plugins: {
    // We generate Tailwind CSS via the CLI (dev:css / build:css).
    // Do NOT run Tailwind as a PostCSS plugin here to avoid errors
    // with newer Tailwind versions. Keep autoprefixer if you want
    // vendor prefixing handled by PostCSS.
    autoprefixer: {},
  },
};
