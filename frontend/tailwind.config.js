/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // same token names used across components, values repointed
        // to the black / red / gold "boldness" brief
        kasavu: "#D4AF37", // bold gold — headings, borders, highlights
        keralagreen: "#9C7A3C", // repurposed: antique bronze-gold for small labels
        ivory: "#F5EDE1", // off-white text on dark surfaces
        beige: "#15100D", // repurposed: near-black card/section surface
        maroon: "#B3121C", // bold red accent
        noir: "#0A0908", // primary black background
        charcoal: "#1C1613", // secondary dark surface
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"], // bold, regal serif for headings
        body: ["'Manrope'", "sans-serif"],
      },
      backgroundImage: {
        "sunrise-gradient":
          "linear-gradient(180deg, #1C1613 0%, #0A0908 60%, #000000 100%)",
      },
    },
  },
  plugins: [],
};
