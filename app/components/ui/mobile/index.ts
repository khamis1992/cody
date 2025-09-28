/**
 * Mobile-First Design System
 * Modern app design patterns inspired by 2024 trends
 */

export * from './AppShell';
export * from './BottomNavigation';
export * from './MobileCard';
export * from './MobileForm';
export * from './GradientBackground';
export * from './LoadingScreen';
export * from './SwipeableCard';
export * from './PullToRefresh';

// Mobile Design Constants
export const MOBILE_DESIGN_TOKENS = {
  // Modern app spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },

  // App-style border radius
  borderRadius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // Modern shadows for depth
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    card: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fab: '0 6px 16px rgba(0, 0, 0, 0.2)',
  },

  // Gradient palettes for modern look
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ocean: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    cosmic: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    cyberpunk: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
  },

  // Typography scales for mobile
  typography: {
    display: {
      fontSize: '2.5rem',
      lineHeight: '3rem',
      fontWeight: '800',
    },
    title: {
      fontSize: '1.875rem',
      lineHeight: '2.25rem',
      fontWeight: '700',
    },
    heading: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: '600',
    },
    subheading: {
      fontSize: '1.25rem',
      lineHeight: '1.75rem',
      fontWeight: '500',
    },
    body: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '400',
    },
    caption: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      fontWeight: '400',
    },
    small: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: '400',
    },
  },

  // App breakpoints
  breakpoints: {
    mobile: '320px',
    mobileLg: '375px',
    tablet: '768px',
    desktop: '1024px',
  },

  // Interactive elements
  interactive: {
    tapTargetSize: '44px', // iOS/Android recommended
    animationDuration: '200ms',
    animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Modern color palettes for apps
export const APP_COLOR_SCHEMES = {
  default: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      900: '#1e3a8a',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#94a3b8',
    },
  },

  dark: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      900: '#1e3a8a',
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#64748b',
    },
  },

  vibrant: {
    primary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      500: '#a855f7',
      600: '#9333ea',
      900: '#581c87',
    },
    background: {
      primary: '#ffffff',
      secondary: '#fafafa',
      tertiary: '#f4f4f5',
    },
    text: {
      primary: '#18181b',
      secondary: '#52525b',
      tertiary: '#a1a1aa',
    },
  },

  minimal: {
    primary: {
      50: '#f9fafb',
      100: '#f3f4f6',
      500: '#6b7280',
      600: '#4b5563',
      900: '#111827',
    },
    background: {
      primary: '#ffffff',
      secondary: '#fefefe',
      tertiary: '#f9fafb',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      tertiary: '#9ca3af',
    },
  },
} as const;

// Component size variants for mobile
export const MOBILE_COMPONENT_SIZES = {
  button: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },

  input: {
    sm: 'px-3 py-2 text-sm h-9',
    md: 'px-4 py-2.5 text-base h-11',
    lg: 'px-4 py-3 text-lg h-12',
  },

  card: {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  },
} as const;