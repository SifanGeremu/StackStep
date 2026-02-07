/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Custom StackStep palette
        background: '#FAF3E1',
        accent: '#FA8112',
        'accent-hover': '#E07010',
        text: '#222222',
        'text-light': '#666666',
        'card-bg': '#FFFBF5',
        'border-color': '#E8DFD3',
      },
      backgroundColor: {
        primary: '#FAF3E1',
        secondary: '#FFFBF5',
        accent: '#FA8112',
      },
      textColor: {
        primary: '#222222',
        secondary: '#666666',
        accent: '#FA8112',
      },
      borderColor: {
        default: '#E8DFD3',
        accent: '#FA8112',
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
  plugins: [],
}
