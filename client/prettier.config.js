module.exports = {
  singleQuote: true,
  semi: false,
  singleAttributePerLine: true,
  arrowParens: "avoid",
  plugins: [require("prettier-plugin-tailwindcss")],
  tailwindConfig: "./tailwind.config.js",
};
