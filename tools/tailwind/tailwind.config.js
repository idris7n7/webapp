// Same palette the page used to pass to the Tailwind CDN script; run `npm run build` here after changing classes.
// indigo / blue are the brand colour: they read the current palette's steps from static/palette.css.
const pal = (step) => `rgb(var(--pal-${step}) / <alpha-value>)`;
module.exports = {
  content: ["../../static/index.html", "../../static/*.js"],
  theme: {
    extend: {
      colors: {
        indigo: { 50: pal(50), 100: pal(100), 200: pal(200), 300: pal(300), 400: pal(400), 500: pal(500), 600: pal(600), 700: pal(700), 800: pal(800), 900: pal(900), 950: pal(950) },
        blue: { 50: pal(50), 100: pal(100), 200: pal(200), 300: pal(300), 400: pal(400), 500: pal(500), 600: pal(500), 700: pal(600), 800: pal(700), 900: pal(800), 950: pal(950) },
      },
      fontFamily: { sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"] },
    },
  },
};
