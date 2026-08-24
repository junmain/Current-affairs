/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette inspired by the Assamese gamosa (red on white) and tea-garden green
        paper: "#F7F4EC",      // background — unbleached mekhela cloth
        ink: "#1C1B17",        // primary text
        tea: "#1F3D2E",        // deep tea-garden green — primary brand
        teaLight: "#2E5940",
        gamosa: "#A5342A",     // muted gamosa red — accent / highlights
        gold: "#C08A28",       // brass/gold — dates, markers
        line: "#DCD5C2",       // hairline dividers
      },
      fontFamily: {
        display: ["'Tiro Devanagari Hindi'", "Georgia", "serif"],
        body: ["'Noto Sans'", "'Noto Sans Bengali'", "sans-serif"],
        as: ["'Noto Sans Bengali'", "sans-serif"],
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};
