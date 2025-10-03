// Tailwind preset consumers can add via: presets: [require('@your-org/ui/tailwind-preset')]
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#168ac9",
        faint: "#f6f7fb",
        "faint-blue": "#EAF6FF",
        dark: "#0b0b0b",
        // Add any named tokens you rely on in components
      },
    },
  },
  safelist: [
    // Add dynamic classes your components may emit at runtime to ensure JIT generates them
    "text-sm",
    "text-base",
    "text-lg",
    "text-xl",
    "text-2xl",
    "md:text-base",
    "lg:text-lg",
    "xl:text-xl",
    "2xl:text-2xl",
    "border-primary",
    "bg-primary",
    "text-primary",
    "bg-faint",
    "bg-faint-blue",
    "shadow-soft",
    "dark:bg-[#0E3954]",
  ],
  plugins: [
    function ({ addUtilities, theme }) {
      addUtilities({
        '.shadow-soft': {
          'box-shadow': '0 2px 20px rgba(0, 0, 0, 0.05)',
        },
        '.dark .shadow-soft': {
          'box-shadow': '0 2px 20px rgba(0, 0, 0, 0.9)',
        },
      })
    },
  ],
};
