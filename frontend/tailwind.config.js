/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'NotoSans': ['Noto Sans Thai', 'Noto Sans', 'sans-serif'],
        // 'NotoSansEng': ['Noto Sans', 'sans-serif'],
        // 'Kanit': ['Kanit', 'sans-serif'],
        
      },
      colors: {
        'ENGi-Red': '#800020',
        'SUT-Grey': '#6D6E70',
        'SUT-Orange': '#F26522',
        'SUT-Gold': '#A67436',
      },
    },
    daisyui: {
      themes: ["light"],
    },
  },
  plugins: [
    require('daisyui'),
  ],
}