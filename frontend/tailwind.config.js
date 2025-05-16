import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
   daisyui:{
    themes: [
      "light",
      "dark",
      "coffee",
      "forest",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      'retro',
      'cyberpunk',
      "valentine",
      "halloween",
      "aqua",
      "garden",
      "night"

     

    ]
  }
  
}