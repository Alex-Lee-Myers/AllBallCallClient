module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    // import all the images
    "./src/images/*.{png,jpg,jpeg,gif,webp,svg}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms')
  ]
}