/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trashgo: "#4CAF50", // hijau brand utama
        softgreen: "#F0FDF4", // background eco fresh
      },
    },
  },
  plugins: [],
};
