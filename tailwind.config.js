/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
  plugins: [require('daisyui')],
  theme: {
    extend: {
      fontFamily: {
        spacemono: ['"Space Mono"'],
        noto: ['"Noto"']
      }
    }
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          '.btn': {
            border: 'none',
            'border-radius': '0.25rem',
            'font-size': '1rem',
            'font-weight': '600',
            padding: '0.5rem 1rem'
          },
          '.neobrutalist-box': {
            'align-items': 'center',
            'background-color': 'white',
            border: '2px solid black',
            color: 'black',
            'font-size': '20px',
            'font-weight': 'bold',
            transition: 'box-shadow 200ms ease-in-out, transform 200ms ease-in-out'
          },
          '.neobrutalist-box:hover': {
            'box-shadow': '6px 6px 0 0 #000000',
            transform: 'translate(-4px, -4px)'
          },
          '.neobrutalist-input': {
            border: 'none',
            'border-bottom': '2px solid black',
            'background-color': 'transparent',
            'font-size': '1rem',
            'font-weight': 'normal',
            outline: 'none'
          }
        }
      }
    ]
  }
}
