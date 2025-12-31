// Chair Care Design System - Modern Dark Portfolio Aesthetic
export const theme = {
  colors: {
    // Primary Light Green Colors - Modern clean accent
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80', // Main brand color - light green
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    // Accent Cyan Colors - Bright highlights like in portfolio
    accent: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee', // Bright cyan accent
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    
    // Purple Colors - Decorative elements
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Decorative purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    
    // Neutral Colors - Pure black and dark grays
    gray: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a', // Very dark
      950: '#000000', // Pure black for main background
    },
    
    // Background Colors - Black theme with dotted pattern
    background: {
      primary: '#000000', // Pure black main background
      secondary: '#0a0a0a', // Slightly lighter black
      tertiary: '#1a1a1a', // Dark gray sections
      card: 'rgba(10, 10, 10, 0.9)', // Semi-transparent cards
      cardHover: 'rgba(26, 26, 26, 0.95)', // Card hover state
      pattern: 'radial-gradient(rgba(255, 255, 255, 0.1) 10%, transparent 1%)', // Dotted pattern
      patternSize: '11px 11px', // Pattern size
      light: '#ffffff', // Light mode fallback
      lightSecondary: '#f8fafc',
      lightTertiary: '#f1f5f9',
    },
    
    // Text Colors - Optimized for dark theme
    text: {
      primary: '#f8fafc', // Light text on dark
      secondary: '#cbd5e1', // Muted light text
      tertiary: '#94a3b8', // More muted text
      accent: '#22d3ee', // Cyan accent text
      inverse: '#0f172a', // Dark text for light backgrounds
      lightPrimary: '#0f172a', // Light mode text
      lightSecondary: '#475569',
      lightTertiary: '#64748b',
    },
    
    // Border Colors - Dark theme optimized
    border: {
      primary: 'rgba(64, 64, 64, 0.6)', // Subtle dark borders
      secondary: 'rgba(96, 96, 96, 0.4)',
      accent: 'rgba(74, 222, 128, 0.3)', // Light green accent borders
      light: '#e2e8f0', // Light mode borders
      lightSecondary: '#cbd5e1',
    },
    
    // Status Colors - Dark theme optimized
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    }
  },
  
  // Modern Black & Green Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', // Light green gradient
    accent: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)', // Cyan gradient (kept for variety)
    purple: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
    dark: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)', // Pure black gradient
    darkSubtle: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
    hero: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.95) 50%, rgba(26, 26, 26, 0.8) 100%)',
    card: 'linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
    button: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', // Light green button
    buttonHover: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', // Darker green on hover
  },
  
  // Typography - Modern and sleek like portfolio
  typography: {
    fontFamily: {
      sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'], // For large headings
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem', // Extra large for hero text
      '8xl': '6rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '5rem',
  },
  
  // Border Radius - Modern rounded corners
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Professional Shadows - Enhanced for black theme with green accents
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.15)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.7)',
    professional: '0 4px 15px rgba(74, 222, 128, 0.3)', // Light green glow
    professionalHover: '0 8px 25px rgba(74, 222, 128, 0.4)',
    accent: '0 4px 15px rgba(34, 211, 238, 0.3)', // Cyan glow (kept for variety)
    accentHover: '0 8px 25px rgba(34, 211, 238, 0.4)',
    dark: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    darkLg: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    none: 'none',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Default mode - dark theme as primary experience
  mode: 'dark' as 'light' | 'dark',
  
  // Animation and transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  }
};

export type Theme = typeof theme;