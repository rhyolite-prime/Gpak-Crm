// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#da3737ff',
      },
      animation: {
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card-hover': '0 20px 40px -12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
}