// UI Component Templates for High-Quality Code Generation
// This library provides beautiful, accessible, and modern UI patterns

export * from './HeroSection';
export * from './FeatureGrid';
export * from './PricingCard';
export * from './TestimonialCard';
export * from './StatsSection';
export * from './NewsletterForm';
export * from './NavigationBar';
export * from './FooterSection';
export * from './DashboardLayout';
export * from './DataTable';
export * from './FormComponents';
export * from './LoadingStates';

// Template Categories
export const TEMPLATE_CATEGORIES = {
  marketing: [
    'HeroSection',
    'FeatureGrid',
    'PricingCard',
    'TestimonialCard',
    'StatsSection',
    'NewsletterForm',
  ],
  navigation: [
    'NavigationBar',
    'FooterSection',
  ],
  dashboard: [
    'DashboardLayout',
    'DataTable',
    'StatsSection',
  ],
  forms: [
    'FormComponents',
    'NewsletterForm',
  ],
  ui: [
    'LoadingStates',
  ],
} as const;

// Design tokens that should be used consistently
export const DESIGN_TOKENS = {
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
    '3xl': '6rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
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
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  colors: {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    warning: 'orange',
    danger: 'red',
    info: 'cyan',
  },
} as const;