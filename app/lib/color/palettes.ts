/**
 * Professional Color Palette Library
 * Curated collection inspired by Color Hunt, Behance, and modern design trends
 */

import { ColorPalette, ColorHarmonyGenerator, MoodType, HarmonyType } from './harmony';

/**
 * Curated Professional Color Palettes
 * Based on trending combinations from Color Hunt and professional design
 */
export const PROFESSIONAL_PALETTES: ColorPalette[] = [
  // Business & Corporate Palettes
  {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    colors: ['#1E40AF', '#3B82F6', '#60A5FA', '#DBEAFE'],
    harmony: 'monochromatic',
    mood: 'professional',
    tags: ['business', 'corporate', 'trustworthy', 'blue'],
    accessibility: { wcagCompliant: true, contrastRatios: [8.2, 5.1, 3.8, 1.2] },
    usage: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#DBEAFE',
      text: '#1F2937',
    },
  },
  {
    id: 'finance-green',
    name: 'Finance Green',
    colors: ['#065F46', '#059669', '#10B981', '#D1FAE5'],
    harmony: 'monochromatic',
    mood: 'professional',
    tags: ['finance', 'money', 'growth', 'green'],
    accessibility: { wcagCompliant: true, contrastRatios: [9.1, 6.2, 4.3, 1.1] },
    usage: {
      primary: '#065F46',
      secondary: '#059669',
      accent: '#10B981',
      background: '#D1FAE5',
      text: '#1F2937',
    },
  },
  {
    id: 'tech-gradient',
    name: 'Tech Gradient',
    colors: ['#6366F1', '#8B5CF6', '#EC4899', '#F3F4F6'],
    harmony: 'analogous',
    mood: 'professional',
    tags: ['tech', 'modern', 'gradient', 'purple'],
    accessibility: { wcagCompliant: true, contrastRatios: [5.8, 4.9, 4.2, 1.0] },
    usage: {
      primary: '#6366F1',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      background: '#F3F4F6',
      text: '#1F2937',
    },
  },

  // Creative & Vibrant Palettes
  {
    id: 'sunset-dream',
    name: 'Sunset Dream',
    colors: ['#F59E0B', '#EF4444', '#EC4899', '#FEF3C7'],
    harmony: 'analogous',
    mood: 'warm',
    tags: ['sunset', 'warm', 'creative', 'energetic'],
    accessibility: { wcagCompliant: true, contrastRatios: [4.8, 5.2, 4.1, 1.2] },
    usage: {
      primary: '#F59E0B',
      secondary: '#EF4444',
      accent: '#EC4899',
      background: '#FEF3C7',
      text: '#1F2937',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    colors: ['#0891B2', '#06B6D4', '#67E8F9', '#CFFAFE'],
    harmony: 'monochromatic',
    mood: 'calming',
    tags: ['ocean', 'blue', 'calming', 'fresh'],
    accessibility: { wcagCompliant: true, contrastRatios: [6.1, 4.8, 2.9, 1.0] },
    usage: {
      primary: '#0891B2',
      secondary: '#06B6D4',
      accent: '#67E8F9',
      background: '#CFFAFE',
      text: '#1F2937',
    },
  },
  {
    id: 'neon-nights',
    name: 'Neon Nights',
    colors: ['#7C3AED', '#A855F7', '#C084FC', '#F3E8FF'],
    harmony: 'monochromatic',
    mood: 'vibrant',
    tags: ['neon', 'purple', 'vibrant', 'creative'],
    accessibility: { wcagCompliant: true, contrastRatios: [7.2, 5.4, 3.1, 1.0] },
    usage: {
      primary: '#7C3AED',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#F3E8FF',
      text: '#1F2937',
    },
  },

  // Minimal & Clean Palettes
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    colors: ['#374151', '#6B7280', '#9CA3AF', '#F9FAFB'],
    harmony: 'monochromatic',
    mood: 'minimal',
    tags: ['minimal', 'gray', 'clean', 'modern'],
    accessibility: { wcagCompliant: true, contrastRatios: [8.9, 5.8, 3.9, 1.0] },
    usage: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#9CA3AF',
      background: '#F9FAFB',
      text: '#1F2937',
    },
  },
  {
    id: 'clean-slate',
    name: 'Clean Slate',
    colors: ['#1E293B', '#475569', '#CBD5E1', '#F8FAFC'],
    harmony: 'monochromatic',
    mood: 'minimal',
    tags: ['clean', 'minimal', 'professional', 'slate'],
    accessibility: { wcagCompliant: true, contrastRatios: [12.1, 6.4, 2.1, 1.0] },
    usage: {
      primary: '#1E293B',
      secondary: '#475569',
      accent: '#CBD5E1',
      background: '#F8FAFC',
      text: '#1F2937',
    },
  },

  // Natural & Earth Tones
  {
    id: 'earth-tones',
    name: 'Earth Tones',
    colors: ['#92400E', '#D97706', '#F59E0B', '#FEF3C7'],
    harmony: 'monochromatic',
    mood: 'natural',
    tags: ['earth', 'brown', 'natural', 'organic'],
    accessibility: { wcagCompliant: true, contrastRatios: [6.8, 4.2, 3.1, 1.2] },
    usage: {
      primary: '#92400E',
      secondary: '#D97706',
      accent: '#F59E0B',
      background: '#FEF3C7',
      text: '#1F2937',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    colors: ['#14532D', '#166534', '#16A34A', '#DCFCE7'],
    harmony: 'monochromatic',
    mood: 'natural',
    tags: ['forest', 'green', 'natural', 'eco'],
    accessibility: { wcagCompliant: true, contrastRatios: [10.2, 7.1, 4.5, 1.0] },
    usage: {
      primary: '#14532D',
      secondary: '#166534',
      accent: '#16A34A',
      background: '#DCFCE7',
      text: '#1F2937',
    },
  },

  // Luxury & Premium Palettes
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    colors: ['#1C1917', '#44403C', '#D4AF37', '#FEF7ED'],
    harmony: 'complementary',
    mood: 'luxurious',
    tags: ['luxury', 'gold', 'premium', 'elegant'],
    accessibility: { wcagCompliant: true, contrastRatios: [15.2, 7.8, 3.2, 1.0] },
    usage: {
      primary: '#1C1917',
      secondary: '#44403C',
      accent: '#D4AF37',
      background: '#FEF7ED',
      text: '#1F2937',
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    colors: ['#581C87', '#7C2D12', '#A855F7', '#FAF5FF'],
    harmony: 'split-complementary',
    mood: 'luxurious',
    tags: ['royal', 'purple', 'luxury', 'elegant'],
    accessibility: { wcagCompliant: true, contrastRatios: [11.4, 9.2, 4.1, 1.0] },
    usage: {
      primary: '#581C87',
      secondary: '#7C2D12',
      accent: '#A855F7',
      background: '#FAF5FF',
      text: '#1F2937',
    },
  },

  // Seasonal Palettes
  {
    id: 'spring-fresh',
    name: 'Spring Fresh',
    colors: ['#65A30D', '#84CC16', '#BEF264', '#F7FEE7'],
    harmony: 'monochromatic',
    mood: 'natural',
    tags: ['spring', 'fresh', 'green', 'nature'],
    accessibility: { wcagCompliant: true, contrastRatios: [5.8, 4.1, 2.3, 1.0] },
    usage: {
      primary: '#65A30D',
      secondary: '#84CC16',
      accent: '#BEF264',
      background: '#F7FEE7',
      text: '#1F2937',
    },
  },
  {
    id: 'summer-vibes',
    name: 'Summer Vibes',
    colors: ['#EA580C', '#FB923C', '#FED7AA', '#FFF7ED'],
    harmony: 'monochromatic',
    mood: 'warm',
    tags: ['summer', 'orange', 'warm', 'energetic'],
    accessibility: { wcagCompliant: true, contrastRatios: [6.2, 3.8, 1.8, 1.0] },
    usage: {
      primary: '#EA580C',
      secondary: '#FB923C',
      accent: '#FED7AA',
      background: '#FFF7ED',
      text: '#1F2937',
    },
  },
  {
    id: 'autumn-warmth',
    name: 'Autumn Warmth',
    colors: ['#9A3412', '#DC2626', '#FCA5A5', '#FEF2F2'],
    harmony: 'analogous',
    mood: 'warm',
    tags: ['autumn', 'red', 'warm', 'cozy'],
    accessibility: { wcagCompliant: true, contrastRatios: [8.1, 5.3, 2.4, 1.0] },
    usage: {
      primary: '#9A3412',
      secondary: '#DC2626',
      accent: '#FCA5A5',
      background: '#FEF2F2',
      text: '#1F2937',
    },
  },
  {
    id: 'winter-cool',
    name: 'Winter Cool',
    colors: ['#1E3A8A', '#3B82F6', '#93C5FD', '#EFF6FF'],
    harmony: 'monochromatic',
    mood: 'cool',
    tags: ['winter', 'blue', 'cool', 'crisp'],
    accessibility: { wcagCompliant: true, contrastRatios: [9.7, 5.1, 2.1, 1.0] },
    usage: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#93C5FD',
      background: '#EFF6FF',
      text: '#1F2937',
    },
  },

  // Industry-Specific Palettes
  {
    id: 'healthcare-trust',
    name: 'Healthcare Trust',
    colors: ['#155E75', '#0891B2', '#67E8F9', '#F0F9FF'],
    harmony: 'monochromatic',
    mood: 'calming',
    tags: ['healthcare', 'medical', 'trust', 'clean'],
    accessibility: { wcagCompliant: true, contrastRatios: [7.9, 4.8, 2.1, 1.0] },
    usage: {
      primary: '#155E75',
      secondary: '#0891B2',
      accent: '#67E8F9',
      background: '#F0F9FF',
      text: '#1F2937',
    },
  },
  {
    id: 'education-friendly',
    name: 'Education Friendly',
    colors: ['#C2410C', '#EA580C', '#FDBA74', '#FFF7ED'],
    harmony: 'monochromatic',
    mood: 'warm',
    tags: ['education', 'friendly', 'approachable', 'orange'],
    accessibility: { wcagCompliant: true, contrastRatios: [7.2, 5.8, 2.1, 1.0] },
    usage: {
      primary: '#C2410C',
      secondary: '#EA580C',
      accent: '#FDBA74',
      background: '#FFF7ED',
      text: '#1F2937',
    },
  },
  {
    id: 'food-appetizing',
    name: 'Food Appetizing',
    colors: ['#B91C1C', '#EF4444', '#FCA5A5', '#FEF2F2'],
    harmony: 'monochromatic',
    mood: 'warm',
    tags: ['food', 'appetizing', 'red', 'delicious'],
    accessibility: { wcagCompliant: true, contrastRatios: [8.4, 5.3, 2.4, 1.0] },
    usage: {
      primary: '#B91C1C',
      secondary: '#EF4444',
      accent: '#FCA5A5',
      background: '#FEF2F2',
      text: '#1F2937',
    },
  },
];

/**
 * Trending Color Combinations (updated regularly)
 */
export const TRENDING_PALETTES: ColorPalette[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    colors: ['#0F0F23', '#FF00FF', '#00FFFF', '#FFFF00'],
    harmony: 'triadic',
    mood: 'vibrant',
    tags: ['cyber', 'neon', 'futuristic', 'bold'],
    accessibility: { wcagCompliant: false, contrastRatios: [15.8, 3.2, 3.8, 2.1] },
    usage: {
      primary: '#0F0F23',
      secondary: '#FF00FF',
      accent: '#00FFFF',
      background: '#1A1A2E',
      text: '#FFFFFF',
    },
  },
  {
    id: 'pastel-dreams',
    name: 'Pastel Dreams',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9'],
    harmony: 'analogous',
    mood: 'playful',
    tags: ['pastel', 'soft', 'dreamy', 'gentle'],
    accessibility: { wcagCompliant: false, contrastRatios: [1.8, 1.6, 1.4, 1.7] },
    usage: {
      primary: '#FFB3BA',
      secondary: '#FFDFBA',
      accent: '#FFFFBA',
      background: '#BAFFC9',
      text: '#1F2937',
    },
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode Pro',
    colors: ['#0D1117', '#161B22', '#21262D', '#F0F6FC'],
    harmony: 'monochromatic',
    mood: 'minimal',
    tags: ['dark', 'mode', 'professional', 'modern'],
    accessibility: { wcagCompliant: true, contrastRatios: [21.0, 14.2, 9.8, 1.0] },
    usage: {
      primary: '#0D1117',
      secondary: '#161B22',
      accent: '#21262D',
      background: '#0D1117',
      text: '#F0F6FC',
    },
  },
];

/**
 * Color Palette Categories
 */
export const PALETTE_CATEGORIES = {
  business: {
    name: 'Business & Corporate',
    description: 'Professional palettes for business applications',
    palettes: ['corporate-blue', 'finance-green', 'tech-gradient', 'clean-slate'],
  },
  creative: {
    name: 'Creative & Artistic',
    description: 'Vibrant palettes for creative projects',
    palettes: ['sunset-dream', 'neon-nights', 'cyber-neon', 'pastel-dreams'],
  },
  minimal: {
    name: 'Minimal & Clean',
    description: 'Simple, elegant palettes for modern designs',
    palettes: ['minimal-gray', 'clean-slate', 'dark-mode'],
  },
  natural: {
    name: 'Natural & Organic',
    description: 'Earth-inspired palettes for organic brands',
    palettes: ['earth-tones', 'forest-green', 'spring-fresh'],
  },
  luxury: {
    name: 'Luxury & Premium',
    description: 'Sophisticated palettes for high-end brands',
    palettes: ['luxury-gold', 'royal-purple'],
  },
  seasonal: {
    name: 'Seasonal',
    description: 'Season-inspired color combinations',
    palettes: ['spring-fresh', 'summer-vibes', 'autumn-warmth', 'winter-cool'],
  },
  industry: {
    name: 'Industry-Specific',
    description: 'Palettes tailored for specific industries',
    palettes: ['healthcare-trust', 'education-friendly', 'food-appetizing'],
  },
};

/**
 * Palette Search and Filter Functions
 */
export class PaletteLibrary {
  private static allPalettes = [...PROFESSIONAL_PALETTES, ...TRENDING_PALETTES];

  /**
   * Get all palettes
   */
  static getAllPalettes(): ColorPalette[] {
    return this.allPalettes;
  }

  /**
   * Get palettes by category
   */
  static getPalettesByCategory(category: keyof typeof PALETTE_CATEGORIES): ColorPalette[] {
    const categoryData = PALETTE_CATEGORIES[category];
    if (!categoryData) return [];

    return this.allPalettes.filter(palette =>
      categoryData.palettes.includes(palette.id)
    );
  }

  /**
   * Get palettes by mood
   */
  static getPalettesByMood(mood: MoodType): ColorPalette[] {
    return this.allPalettes.filter(palette => palette.mood === mood);
  }

  /**
   * Search palettes by tags
   */
  static searchPalettes(query: string): ColorPalette[] {
    const lowerQuery = query.toLowerCase();
    return this.allPalettes.filter(palette =>
      palette.name.toLowerCase().includes(lowerQuery) ||
      palette.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get accessibility-compliant palettes
   */
  static getAccessiblePalettes(): ColorPalette[] {
    return this.allPalettes.filter(palette => palette.accessibility.wcagCompliant);
  }

  /**
   * Get trending palettes
   */
  static getTrendingPalettes(): ColorPalette[] {
    return TRENDING_PALETTES;
  }

  /**
   * Get palette by ID
   */
  static getPaletteById(id: string): ColorPalette | undefined {
    return this.allPalettes.find(palette => palette.id === id);
  }

  /**
   * Generate similar palettes
   */
  static getSimilarPalettes(paletteId: string, count: number = 3): ColorPalette[] {
    const targetPalette = this.getPaletteById(paletteId);
    if (!targetPalette) return [];

    // Find palettes with similar mood or harmony
    const similar = this.allPalettes.filter(palette =>
      palette.id !== paletteId &&
      (palette.mood === targetPalette.mood ||
       palette.harmony === targetPalette.harmony ||
       palette.tags.some(tag => targetPalette.tags.includes(tag)))
    );

    return similar.slice(0, count);
  }

  /**
   * Get random palette
   */
  static getRandomPalette(): ColorPalette {
    const randomIndex = Math.floor(Math.random() * this.allPalettes.length);
    return this.allPalettes[randomIndex];
  }

  /**
   * Filter palettes by multiple criteria
   */
  static filterPalettes(filters: {
    mood?: MoodType;
    harmony?: HarmonyType;
    tags?: string[];
    accessible?: boolean;
  }): ColorPalette[] {
    return this.allPalettes.filter(palette => {
      if (filters.mood && palette.mood !== filters.mood) return false;
      if (filters.harmony && palette.harmony !== filters.harmony) return false;
      if (filters.accessible && !palette.accessibility.wcagCompliant) return false;
      if (filters.tags && !filters.tags.some(tag => palette.tags.includes(tag))) return false;
      return true;
    });
  }

  /**
   * Export palette for different formats
   */
  static exportPalette(paletteId: string, format: 'css' | 'scss' | 'json' | 'ase' | 'swatches'): string {
    const palette = this.getPaletteById(paletteId);
    if (!palette) return '';

    switch (format) {
      case 'css':
        return this.exportToCSS(palette);
      case 'scss':
        return this.exportToSCSS(palette);
      case 'json':
        return JSON.stringify(palette, null, 2);
      case 'swatches':
        return this.exportToSwatches(palette);
      default:
        return JSON.stringify(palette.colors);
    }
  }

  private static exportToCSS(palette: ColorPalette): string {
    return `:root {
  /* ${palette.name} */
  --color-primary: ${palette.usage.primary};
  --color-secondary: ${palette.usage.secondary};
  --color-accent: ${palette.usage.accent};
  --color-background: ${palette.usage.background};
  --color-text: ${palette.usage.text};

  /* Palette Colors */
${palette.colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}`;
  }

  private static exportToSCSS(palette: ColorPalette): string {
    return `// ${palette.name}
$primary: ${palette.usage.primary};
$secondary: ${palette.usage.secondary};
$accent: ${palette.usage.accent};
$background: ${palette.usage.background};
$text: ${palette.usage.text};

// Palette Colors
${palette.colors.map((color, index) => `$color-${index + 1}: ${color};`).join('\n')}

$colors: (
${palette.colors.map((color, index) => `  "color-${index + 1}": ${color}`).join(',\n')}
);`;
  }

  private static exportToSwatches(palette: ColorPalette): string {
    return palette.colors.map((color, index) => `Color ${index + 1}: ${color}`).join('\n');
  }
}

/**
 * Quick access to popular palettes
 */
export const POPULAR_PALETTES = {
  modern: PaletteLibrary.getPaletteById('tech-gradient')!,
  minimal: PaletteLibrary.getPaletteById('minimal-gray')!,
  corporate: PaletteLibrary.getPaletteById('corporate-blue')!,
  creative: PaletteLibrary.getPaletteById('sunset-dream')!,
  luxury: PaletteLibrary.getPaletteById('luxury-gold')!,
  natural: PaletteLibrary.getPaletteById('forest-green')!,
};