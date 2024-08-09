/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  
      "./dist/**/*.{js,ts}",          
      "./index.html",                 
    ],
    safelist: [
      
        'bg-yellow-300', 
        'bg-green-400',  
    ],
    
  }
  