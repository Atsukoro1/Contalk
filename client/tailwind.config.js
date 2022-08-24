module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'background': "url('/background.png')",
        'homePageBackground': "url('/homePageBackground.png')",
      }
    },
  },
  plugins: [],
}
