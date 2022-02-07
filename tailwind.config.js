module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		// import all the images
		"./src/images/*.{png,jpg,jpeg,gif,webp,svg}",
		"./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [
		require("@tailwindcss/aspect-ratio"),
		require("@tailwindcss/forms"),
		require("flowbite/plugin"),
	],
};