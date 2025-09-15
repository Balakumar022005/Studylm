/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // All your React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Deep purple for buttons/headers
        secondary: "#F59E0B", // Amber for highlights
        accent: "#10B981", // Teal accent
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
