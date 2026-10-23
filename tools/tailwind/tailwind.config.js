// Same palette the page used to pass to the Tailwind CDN script; run `npm run build` here after changing classes.
module.exports = {
  content: ["../../static/index.html", "../../static/*.js"],
  theme: {
    extend: {
      colors: {
        indigo: { 50: "#eef0ff", 100: "#e0e3ff", 200: "#c7ccfc", 300: "#a5acf8", 400: "#818af5", 500: "#6670f1", 600: "#5558ee", 700: "#4647d6", 800: "#3a3bb0", 900: "#2f3088", 950: "#1e1f5a" },
        blue: { 50: "#eef0ff", 100: "#e0e3ff", 200: "#c7ccfc", 300: "#a5acf8", 400: "#818af5", 500: "#6670f1", 600: "#6670f1", 700: "#5558ee", 800: "#4647d6", 900: "#3a3bb0", 950: "#1e1f5a" },
      },
      fontFamily: { sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"] },
    },
  },
};
