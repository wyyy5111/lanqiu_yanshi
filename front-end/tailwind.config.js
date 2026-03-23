import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D4A84B',
          foreground: '#1A1510',
          muted: '#F5C542',
        },
        accent: '#B8860A',
        // Premium Luxury Gold 7层色彩系统
        gold: {
          100: '#FFF8E7',  // 极致浅金
          200: '#FFEFC4',  // 浅香槟金
          300: '#FFD966',  // 明亮金
          400: '#F5C542',  // 标准金
          500: '#D4A84B',  // 古典金
          600: '#B8860A',  // 深金
          700: '#8B6914',  // 暗金
          800: '#5C4A1F',  // 深褐金
          900: '#3D2E14',  // 近黑金
          light: '#FFE066',
          DEFAULT: '#F5C542',
          dark: '#D4A84B',
          dim: '#8B6914',
          glow: '#F5C542',
          rich: '#B8860A',
          deep: '#5C4A1F',
        },
        // Glow tones
        glow: {
          gold: 'rgba(245, 197, 66, 0.5)',
          goldLight: 'rgba(255, 224, 102, 0.5)',
          goldDark: 'rgba(212, 168, 75, 0.5)',
          intense: 'rgba(255, 224, 102, 0.6)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Premium Gold Gradients
        'gradient-aurora': 'linear-gradient(135deg, #8B6914 0%, #D4A84B 30%, #FFE066 50%, #D4A84B 70%, #8B6914 100%)',
        'gradient-ionic': 'linear-gradient(135deg, #8B6914 0%, #D4A84B 50%, #FFE066 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #5C4A1F 0%, #B8860A 20%, #FFD966 40%, #F5C542 50%, #FFD966 60%, #B8860A 80%, #5C4A1F 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #5C4A1F 0%, #B8860A 25%, #FFD966 50%, #F5C542 50%, #FFD966 75%, #B8860A 100%)',
        'gradient-champagne': 'linear-gradient(135deg, #8B6914 0%, #D4A84B 50%, #FFE066 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #3D2E14 0%, #8B6914 30%, #D4A84B 60%, #FFD966 100%)',
        // Dark background
        'gradient-dark': 'linear-gradient(145deg, #050608 0%, #0A0B0E 50%, #080A0D 100%)',
        // Glow effects
        'glow-gold': 'radial-gradient(circle at center, rgba(245, 197, 66, 0.4), transparent 70%)',
        'glow-gold-strong': 'radial-gradient(circle at center, rgba(255, 224, 102, 0.5), transparent 70%)',
        'glow-gold-intense': 'radial-gradient(circle at center, rgba(245, 197, 66, 0.6), transparent 70%)',
      },
      boxShadow: {
        brand: '0 20px 45px -20px rgba(212, 168, 75, 0.45)',
        // Premium Gold Glow Effects
        'gold-glow': '0 0 30px rgba(245, 197, 66, 0.5), 0 0 60px rgba(212, 168, 75, 0.3)',
        'gold-glow-sm': '0 0 15px rgba(245, 197, 66, 0.4), 0 0 30px rgba(212, 168, 75, 0.2)',
        'gold-glow-lg': '0 0 40px rgba(255, 224, 102, 0.6), 0 0 80px rgba(245, 197, 66, 0.4), 0 0 120px rgba(212, 168, 75, 0.2)',
        'gold-inner': 'inset 0 0 30px rgba(245, 197, 66, 0.15)',
        'gold-glow-intense': '0 0 40px rgba(255, 224, 102, 0.6), 0 0 80px rgba(245, 197, 66, 0.4), 0 0 120px rgba(212, 168, 75, 0.2)',
        'glow-lg': '0 10px 40px -10px rgba(184, 134, 11, 0.4)',
        'glow-xl': '0 20px 60px -15px rgba(184, 134, 11, 0.5)',
        'inner-glow': 'inset 0 0 30px rgba(184, 134, 11, 0.2)',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      animation: {
        // Premium Animations
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 4s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'rotate-slow': 'rotate 20s linear infinite',
        // Gold Pulse Animations
        'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
        'gold-shimmer': 'gold-shimmer 3s ease-in-out infinite',
        'gold-glow': 'gold-glow 2s ease-in-out infinite alternate',
        'gold-flow': 'gold-flow 4s ease-in-out infinite',
        'gold-shine': 'gold-shine 4s ease-in-out infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        'gold-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 30px rgba(245, 197, 66, 0.4), 0 0 60px rgba(212, 168, 75, 0.2)'
          },
          '50%': {
            boxShadow: '0 0 50px rgba(255, 224, 102, 0.6), 0 0 80px rgba(245, 197, 66, 0.4)'
          }
        },
        'gold-shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        'gold-glow': {
          '0%': {
            boxShadow: '0 0 20px rgba(245, 197, 66, 0.3), 0 0 40px rgba(212, 168, 75, 0.2)'
          },
          '100%': {
            boxShadow: '0 0 40px rgba(255, 224, 102, 0.5), 0 0 60px rgba(245, 197, 66, 0.3)'
          }
        },
        'gold-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%', filter: 'brightness(1)' },
          '50%': { backgroundPosition: '100% 50%', filter: 'brightness(1.15)' }
        },
        'gold-shine': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [tailwindcssAnimate],
};
