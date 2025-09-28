/**
 * Design Presets and Themes for Modern App Generation
 * Pre-configured design systems for instant app creation
 */

export interface DesignPreset {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'social' | 'ecommerce' | 'productivity' | 'creative' | 'fintech';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  gradients: {
    primary: string;
    background: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
    accent: string;
  };
  components: {
    borderRadius: 'sharp' | 'rounded' | 'pill';
    shadows: 'none' | 'subtle' | 'medium' | 'strong';
    animations: 'minimal' | 'smooth' | 'playful';
  };
  layout: {
    spacing: 'compact' | 'comfortable' | 'spacious';
    contentWidth: 'narrow' | 'medium' | 'wide' | 'full';
  };
  mobile: {
    navigationStyle: 'tabs' | 'drawer' | 'bottom';
    cardStyle: 'flat' | 'elevated' | 'outlined' | 'glass';
    headerStyle: 'minimal' | 'prominent' | 'transparent';
  };
}

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'modern-saas',
    name: 'Modern SaaS',
    description: 'Clean, professional design perfect for B2B applications and dashboards',
    category: 'business',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#0F172A',
      textMuted: '#64748B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
      accent: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    },
    typography: {
      heading: 'font-inter',
      body: 'font-inter',
      accent: 'font-inter',
    },
    components: {
      borderRadius: 'rounded',
      shadows: 'medium',
      animations: 'smooth',
    },
    layout: {
      spacing: 'comfortable',
      contentWidth: 'medium',
    },
    mobile: {
      navigationStyle: 'bottom',
      cardStyle: 'elevated',
      headerStyle: 'minimal',
    },
  },

  {
    id: 'vibrant-social',
    name: 'Vibrant Social',
    description: 'Colorful, engaging design for social media and community apps',
    category: 'social',
    preview: 'bg-gradient-to-br from-pink-50 to-purple-100',
    colors: {
      primary: '#EC4899',
      secondary: '#F59E0B',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      surface: '#FDF2F8',
      text: '#1F2937',
      textMuted: '#6B7280',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
      background: 'linear-gradient(135deg, #FDF2F8 0%, #FAF5FF 100%)',
      accent: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    },
    typography: {
      heading: 'font-poppins',
      body: 'font-inter',
      accent: 'font-poppins',
    },
    components: {
      borderRadius: 'pill',
      shadows: 'strong',
      animations: 'playful',
    },
    layout: {
      spacing: 'spacious',
      contentWidth: 'medium',
    },
    mobile: {
      navigationStyle: 'tabs',
      cardStyle: 'glass',
      headerStyle: 'prominent',
    },
  },

  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    description: 'Elegant, high-end design for premium products and services',
    category: 'ecommerce',
    preview: 'bg-gradient-to-br from-gray-50 to-stone-100',
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#D4A574',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#0F172A',
      textMuted: '#475569',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
      accent: 'linear-gradient(135deg, #D4A574 0%, #F59E0B 100%)',
    },
    typography: {
      heading: 'font-playfair',
      body: 'font-inter',
      accent: 'font-playfair',
    },
    components: {
      borderRadius: 'sharp',
      shadows: 'subtle',
      animations: 'minimal',
    },
    layout: {
      spacing: 'spacious',
      contentWidth: 'narrow',
    },
    mobile: {
      navigationStyle: 'drawer',
      cardStyle: 'flat',
      headerStyle: 'minimal',
    },
  },

  {
    id: 'fintech-trust',
    name: 'Fintech Trust',
    description: 'Professional, trustworthy design for financial applications',
    category: 'fintech',
    preview: 'bg-gradient-to-br from-emerald-50 to-teal-100',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#064E3B',
      textMuted: '#047857',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669 0%, #0D9488 100%)',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
      accent: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    },
    typography: {
      heading: 'font-inter',
      body: 'font-inter',
      accent: 'font-mono',
    },
    components: {
      borderRadius: 'rounded',
      shadows: 'medium',
      animations: 'smooth',
    },
    layout: {
      spacing: 'comfortable',
      contentWidth: 'medium',
    },
    mobile: {
      navigationStyle: 'bottom',
      cardStyle: 'elevated',
      headerStyle: 'minimal',
    },
  },

  {
    id: 'creative-studio',
    name: 'Creative Studio',
    description: 'Bold, artistic design for creative portfolios and agencies',
    category: 'creative',
    preview: 'bg-gradient-to-br from-violet-50 to-orange-100',
    colors: {
      primary: '#7C3AED',
      secondary: '#F59E0B',
      accent: '#EF4444',
      background: '#FAFAFA',
      surface: '#FFFFFF',
      text: '#1A1A1A',
      textMuted: '#666666',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
      background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
      accent: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    },
    typography: {
      heading: 'font-display',
      body: 'font-inter',
      accent: 'font-display',
    },
    components: {
      borderRadius: 'rounded',
      shadows: 'strong',
      animations: 'playful',
    },
    layout: {
      spacing: 'spacious',
      contentWidth: 'wide',
    },
    mobile: {
      navigationStyle: 'drawer',
      cardStyle: 'glass',
      headerStyle: 'transparent',
    },
  },

  {
    id: 'productivity-focus',
    name: 'Productivity Focus',
    description: 'Clean, distraction-free design for productivity and workflow apps',
    category: 'productivity',
    preview: 'bg-gradient-to-br from-slate-50 to-blue-50',
    colors: {
      primary: '#475569',
      secondary: '#3B82F6',
      accent: '#06B6D4',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      text: '#1E293B',
      textMuted: '#64748B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #475569 0%, #3B82F6 100%)',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
      accent: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
    },
    typography: {
      heading: 'font-inter',
      body: 'font-inter',
      accent: 'font-mono',
    },
    components: {
      borderRadius: 'rounded',
      shadows: 'subtle',
      animations: 'minimal',
    },
    layout: {
      spacing: 'compact',
      contentWidth: 'wide',
    },
    mobile: {
      navigationStyle: 'bottom',
      cardStyle: 'outlined',
      headerStyle: 'minimal',
    },
  },
];

export const DARK_MODE_VARIANTS = {
  'modern-saas': {
    colors: {
      primary: '#60A5FA',
      secondary: '#818CF8',
      accent: '#A78BFA',
      background: '#0F172A',
      surface: '#1E293B',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1E40AF 0%, #3730A3 100%)',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      accent: 'linear-gradient(135deg, #7C3AED 0%, #BE185D 100%)',
    },
  },
  'vibrant-social': {
    colors: {
      primary: '#F472B6',
      secondary: '#FBBF24',
      accent: '#A78BFA',
      background: '#111827',
      surface: '#1F2937',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #BE185D 0%, #7C2D12 100%)',
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      accent: 'linear-gradient(135deg, #D97706 0%, #DC2626 100%)',
    },
  },
  // Add more dark variants as needed
};

export const COMPONENT_THEMES = {
  'modern-saas': {
    button: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
      ghost: 'hover:bg-blue-50 text-blue-600',
    },
    card: {
      default: 'bg-white border border-gray-200 shadow-sm',
      elevated: 'bg-white shadow-lg border-0',
      interactive: 'hover:shadow-md transition-shadow',
    },
    input: {
      default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    },
  },
  'vibrant-social': {
    button: {
      primary: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white',
      secondary: 'bg-pink-100 hover:bg-pink-200 text-pink-900 border border-pink-300',
      ghost: 'hover:bg-pink-50 text-pink-600',
    },
    card: {
      default: 'bg-white/80 backdrop-blur border border-pink-200 shadow-lg',
      elevated: 'bg-gradient-to-br from-pink-50 to-purple-50 shadow-xl border-0',
      interactive: 'hover:scale-105 transition-transform',
    },
    input: {
      default: 'border-pink-300 focus:border-purple-500 focus:ring-purple-500',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    },
  },
  // Add more component themes
};

/**
 * Apply a design preset to generate CSS variables and component configurations
 */
export function applyDesignPreset(preset: DesignPreset, darkMode = false) {
  const colors = darkMode && DARK_MODE_VARIANTS[preset.id as keyof typeof DARK_MODE_VARIANTS]
    ? DARK_MODE_VARIANTS[preset.id as keyof typeof DARK_MODE_VARIANTS].colors
    : preset.colors;

  const gradients = darkMode && DARK_MODE_VARIANTS[preset.id as keyof typeof DARK_MODE_VARIANTS]
    ? DARK_MODE_VARIANTS[preset.id as keyof typeof DARK_MODE_VARIANTS].gradients
    : preset.gradients;

  return {
    cssVariables: {
      '--color-primary': colors.primary,
      '--color-secondary': colors.secondary,
      '--color-accent': colors.accent,
      '--color-background': colors.background,
      '--color-surface': colors.surface,
      '--color-text': colors.text,
      '--color-text-muted': colors.textMuted,
      '--gradient-primary': gradients.primary,
      '--gradient-background': gradients.background,
      '--gradient-accent': gradients.accent,
      '--border-radius': preset.components.borderRadius === 'sharp' ? '0px' :
                         preset.components.borderRadius === 'rounded' ? '8px' : '9999px',
      '--shadow-level': preset.components.shadows === 'none' ? 'none' :
                        preset.components.shadows === 'subtle' ? '0 1px 3px rgba(0,0,0,0.1)' :
                        preset.components.shadows === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                        '0 10px 15px rgba(0,0,0,0.1)',
    },
    componentTheme: COMPONENT_THEMES[preset.id as keyof typeof COMPONENT_THEMES],
    layoutConfig: preset.layout,
    mobileConfig: preset.mobile,
  };
}

/**
 * Generate a complete theme configuration from a preset
 */
export function generateThemeConfig(preset: DesignPreset) {
  const { cssVariables, componentTheme, layoutConfig, mobileConfig } = applyDesignPreset(preset);

  return {
    name: preset.name,
    id: preset.id,
    cssVariables,
    components: {
      ...componentTheme,
      spacing: {
        compact: { padding: 'p-2', margin: 'm-2', gap: 'gap-2' },
        comfortable: { padding: 'p-4', margin: 'm-4', gap: 'gap-4' },
        spacious: { padding: 'p-6', margin: 'm-6', gap: 'gap-6' },
      }[layoutConfig.spacing],
      borderRadius: {
        sharp: 'rounded-none',
        rounded: 'rounded-lg',
        pill: 'rounded-full',
      }[preset.components.borderRadius],
      animations: {
        minimal: 'transition-colors duration-200',
        smooth: 'transition-all duration-300',
        playful: 'transition-all duration-300 hover:scale-105',
      }[preset.components.animations],
    },
    mobile: mobileConfig,
  };
}

/**
 * Get preset recommendations based on app category
 */
export function getPresetRecommendations(category: string): DesignPreset[] {
  return DESIGN_PRESETS.filter(preset => preset.category === category);
}

/**
 * Create custom preset from user preferences
 */
export function createCustomPreset(
  name: string,
  basePreset: DesignPreset,
  customizations: Partial<DesignPreset>
): DesignPreset {
  return {
    ...basePreset,
    id: `custom-${Date.now()}`,
    name,
    ...customizations,
  };
}