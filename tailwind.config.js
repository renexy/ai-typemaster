/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "desktop-layout": `
          [full-width-start] minmax(var(--padding-inline-desktop), 1fr) 
          [breakout-start] minmax(0, var(--breakout-size)) 
          [content-start] min(100% - (var(--padding-inline-desktop) * 2), var(--content-max-width))
          [content-end] 
          minmax(0, var(--breakout-size)) [breakout-end] 
          minmax(var(--padding-inline-desktop), 1fr) [full-width-end]
          `,
        "tablet-layout": `
          [full-width-start] minmax(var(--padding-inline-tablet), 1fr) 
          [content-start] min(100% - (var(--padding-inline-tablet) * 2), var(--content-max-width))
          [content-end] 
          minmax(var(--padding-inline-tablet), 1fr) [full-width-end]
          `,
        "mobile-layout": `
          [full-width-start] minmax(var(--padding-inline-mobile), 1fr) 
          [content-start] min(100% - (var(--padding-inline-mobile) * 2), var(--content-max-width))
          [content-end] 
          minmax(var(--padding-inline-mobile), 1fr) [full-width-end]`,
        "global-grid-desktop": "repeat(12,minmax(0,1fr))",
        "global-grid-tablet": "repeat(8,minmax(0,1fr))",
        "global-grid-mobile": "repeat(4,minmax(0,1fr))",
      },
      gridColumn: {
        "full-width": "full-width-start / full-width-end",
        content: "content-start / content-end",
        breakout: "breakout-start / breakout-end"
      },
      animation: {
        fadeInSlideUp: "fadeInSlideUp 0.5s ease-out",
      },
      keyframes: {
        fadeInSlideUp: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}

