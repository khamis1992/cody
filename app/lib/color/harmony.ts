/**
 * Advanced Color Harmony Generator
 * Based on color theory and trends from Color Hunt and Behance
 */

export interface ColorHSL {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

export interface ColorRGB {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[]; // Hex colors
  harmony: HarmonyType;
  mood: MoodType;
  tags: string[];
  accessibility: {
    wcagCompliant: boolean;
    contrastRatios: number[];
  };
  usage: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export type HarmonyType =
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'split-complementary'
  | 'triadic'
  | 'tetradic'
  | 'square'
  | 'custom';

export type MoodType =
  | 'professional'
  | 'energetic'
  | 'calming'
  | 'warm'
  | 'cool'
  | 'natural'
  | 'vibrant'
  | 'minimal'
  | 'luxurious'
  | 'playful';

/**
 * Color Harmony Generator Class
 */
export class ColorHarmonyGenerator {
  /**
   * Generate color palette based on harmony type
   */
  static generateHarmony(baseColor: string, harmonyType: HarmonyType, count: number = 4): string[] {
    const hsl = this.hexToHSL(baseColor);

    switch (harmonyType) {
      case 'monochromatic':
        return this.generateMonochromatic(hsl, count);
      case 'analogous':
        return this.generateAnalogous(hsl, count);
      case 'complementary':
        return this.generateComplementary(hsl, count);
      case 'split-complementary':
        return this.generateSplitComplementary(hsl);
      case 'triadic':
        return this.generateTriadic(hsl);
      case 'tetradic':
        return this.generateTetradic(hsl);
      case 'square':
        return this.generateSquare(hsl);
      default:
        return [baseColor];
    }
  }

  /**
   * Generate monochromatic palette (same hue, different lightness/saturation)
   */
  static generateMonochromatic(baseHsl: ColorHSL, count: number): string[] {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
      const lightnessVariation = (i / (count - 1)) * 60 + 20; // 20-80 lightness range
      const saturationVariation = Math.max(30, baseHsl.s - (i * 10)); // Maintain decent saturation

      const color: ColorHSL = {
        h: baseHsl.h,
        s: saturationVariation,
        l: lightnessVariation,
      };

      colors.push(this.hslToHex(color));
    }

    return colors;
  }

  /**
   * Generate analogous palette (neighboring colors on color wheel)
   */
  static generateAnalogous(baseHsl: ColorHSL, count: number): string[] {
    const colors: string[] = [];
    const hueStep = 30; // 30 degrees apart

    for (let i = 0; i < count; i++) {
      const hueOffset = (i - Math.floor(count / 2)) * hueStep;
      const color: ColorHSL = {
        h: (baseHsl.h + hueOffset + 360) % 360,
        s: baseHsl.s + (Math.random() - 0.5) * 20, // Slight saturation variation
        l: baseHsl.l + (Math.random() - 0.5) * 20, // Slight lightness variation
      };

      color.s = Math.max(0, Math.min(100, color.s));
      color.l = Math.max(0, Math.min(100, color.l));

      colors.push(this.hslToHex(color));
    }

    return colors;
  }

  /**
   * Generate complementary palette (opposite colors)
   */
  static generateComplementary(baseHsl: ColorHSL, count: number): string[] {
    const complementHue = (baseHsl.h + 180) % 360;
    const colors: string[] = [];

    // Base color variations
    for (let i = 0; i < Math.ceil(count / 2); i++) {
      const color: ColorHSL = {
        h: baseHsl.h,
        s: baseHsl.s - (i * 15),
        l: baseHsl.l + (i * 15),
      };
      colors.push(this.hslToHex(color));
    }

    // Complementary color variations
    for (let i = 0; i < Math.floor(count / 2); i++) {
      const color: ColorHSL = {
        h: complementHue,
        s: baseHsl.s - (i * 15),
        l: baseHsl.l + (i * 15),
      };
      colors.push(this.hslToHex(color));
    }

    return colors;
  }

  /**
   * Generate split-complementary palette
   */
  static generateSplitComplementary(baseHsl: ColorHSL): string[] {
    const complement = (baseHsl.h + 180) % 360;
    const splitAngle = 30;

    return [
      this.hslToHex(baseHsl),
      this.hslToHex({ ...baseHsl, h: (complement - splitAngle + 360) % 360 }),
      this.hslToHex({ ...baseHsl, h: (complement + splitAngle) % 360 }),
      this.hslToHex({ ...baseHsl, l: Math.min(85, baseHsl.l + 20) }), // Lighter variant
    ];
  }

  /**
   * Generate triadic palette (120 degrees apart)
   */
  static generateTriadic(baseHsl: ColorHSL): string[] {
    return [
      this.hslToHex(baseHsl),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 120) % 360 }),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 240) % 360 }),
      this.hslToHex({ ...baseHsl, l: Math.min(90, baseHsl.l + 30), s: Math.max(20, baseHsl.s - 30) }),
    ];
  }

  /**
   * Generate tetradic palette (rectangle on color wheel)
   */
  static generateTetradic(baseHsl: ColorHSL): string[] {
    const angle = 60; // 60 degrees apart for rectangle

    return [
      this.hslToHex(baseHsl),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + angle) % 360 }),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 180) % 360 }),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 180 + angle) % 360 }),
    ];
  }

  /**
   * Generate square palette (90 degrees apart)
   */
  static generateSquare(baseHsl: ColorHSL): string[] {
    return [
      this.hslToHex(baseHsl),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 90) % 360 }),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 180) % 360 }),
      this.hslToHex({ ...baseHsl, h: (baseHsl.h + 270) % 360 }),
    ];
  }

  /**
   * Generate palette based on mood
   */
  static generateMoodPalette(mood: MoodType, baseColor?: string): ColorPalette {
    const baseHue = baseColor ? this.hexToHSL(baseColor).h : this.getMoodBaseHue(mood);
    const moodConfig = this.getMoodConfiguration(mood);

    const colors = this.generateHarmony(
      this.hslToHex({ h: baseHue, s: moodConfig.saturation, l: moodConfig.lightness }),
      moodConfig.harmony,
      4
    );

    return {
      id: `${mood}-${Date.now()}`,
      name: `${this.capitalize(mood)} Palette`,
      colors,
      harmony: moodConfig.harmony,
      mood,
      tags: moodConfig.tags,
      accessibility: this.checkAccessibility(colors),
      usage: this.assignColorUsage(colors),
    };
  }

  /**
   * Get trending color palettes (inspired by Color Hunt)
   */
  static getTrendingPalettes(): ColorPalette[] {
    return [
      {
        id: 'sunset-vibes',
        name: 'Sunset Vibes',
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
        harmony: 'analogous',
        mood: 'warm',
        tags: ['sunset', 'warm', 'energetic', 'summer'],
        accessibility: this.checkAccessibility(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']),
        usage: this.assignColorUsage(['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']),
      },
      {
        id: 'ocean-depth',
        name: 'Ocean Depth',
        colors: ['#0F3460', '#16537E', '#1F8A70', '#BEDB39'],
        harmony: 'analogous',
        mood: 'calming',
        tags: ['ocean', 'blue', 'nature', 'professional'],
        accessibility: this.checkAccessibility(['#0F3460', '#16537E', '#1F8A70', '#BEDB39']),
        usage: this.assignColorUsage(['#0F3460', '#16537E', '#1F8A70', '#BEDB39']),
      },
      {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        colors: ['#2D3748', '#4A5568', '#718096', '#E2E8F0'],
        harmony: 'monochromatic',
        mood: 'minimal',
        tags: ['minimal', 'modern', 'professional', 'clean'],
        accessibility: this.checkAccessibility(['#2D3748', '#4A5568', '#718096', '#E2E8F0']),
        usage: this.assignColorUsage(['#2D3748', '#4A5568', '#718096', '#E2E8F0']),
      },
      {
        id: 'creative-burst',
        name: 'Creative Burst',
        colors: ['#FF007F', '#8B00FF', '#00BFFF', '#00FF7F'],
        harmony: 'tetradic',
        mood: 'vibrant',
        tags: ['creative', 'vibrant', 'artistic', 'energetic'],
        accessibility: this.checkAccessibility(['#FF007F', '#8B00FF', '#00BFFF', '#00FF7F']),
        usage: this.assignColorUsage(['#FF007F', '#8B00FF', '#00BFFF', '#00FF7F']),
      },
      {
        id: 'earth-tones',
        name: 'Earth Tones',
        colors: ['#8B4513', '#CD853F', '#D2691E', '#F4A460'],
        harmony: 'analogous',
        mood: 'natural',
        tags: ['earth', 'natural', 'warm', 'organic'],
        accessibility: this.checkAccessibility(['#8B4513', '#CD853F', '#D2691E', '#F4A460']),
        usage: this.assignColorUsage(['#8B4513', '#CD853F', '#D2691E', '#F4A460']),
      },
      {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        colors: ['#1A1A1A', '#333333', '#D4AF37', '#FFF8DC'],
        harmony: 'complementary',
        mood: 'luxurious',
        tags: ['luxury', 'gold', 'elegant', 'premium'],
        accessibility: this.checkAccessibility(['#1A1A1A', '#333333', '#D4AF37', '#FFF8DC']),
        usage: this.assignColorUsage(['#1A1A1A', '#333333', '#D4AF37', '#FFF8DC']),
      },
    ];
  }

  /**
   * Generate industry-specific palette
   */
  static generateIndustryPalette(industry: string): ColorPalette {
    const industryConfig = this.getIndustryConfiguration(industry);
    const baseColor = industryConfig.primaryColor;

    const colors = this.generateHarmony(baseColor, industryConfig.harmony, 4);

    return {
      id: `${industry}-${Date.now()}`,
      name: `${this.capitalize(industry)} Palette`,
      colors,
      harmony: industryConfig.harmony,
      mood: industryConfig.mood,
      tags: [industry, ...industryConfig.tags],
      accessibility: this.checkAccessibility(colors),
      usage: this.assignColorUsage(colors),
    };
  }

  // Utility methods for color conversion
  static hexToRGB(hex: string): ColorRGB {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  static rgbToHex(rgb: ColorRGB): string {
    return `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
  }

  static hexToHSL(hex: string): ColorHSL {
    const rgb = this.hexToRGB(hex);
    return this.rgbToHSL(rgb);
  }

  static hslToHex(hsl: ColorHSL): string {
    const rgb = this.hslToRGB(hsl);
    return this.rgbToHex(rgb);
  }

  static rgbToHSL(rgb: ColorRGB): ColorHSL {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  static hslToRGB(hsl: ColorHSL): ColorRGB {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  // Helper methods
  private static getMoodBaseHue(mood: MoodType): number {
    const moodHues = {
      professional: 220, // Blue
      energetic: 0,      // Red
      calming: 200,      // Light blue
      warm: 30,          // Orange
      cool: 240,         // Blue-purple
      natural: 120,      // Green
      vibrant: 300,      // Magenta
      minimal: 0,        // No specific hue
      luxurious: 50,     // Gold
      playful: 280,      // Purple
    };
    return moodHues[mood];
  }

  private static getMoodConfiguration(mood: MoodType) {
    const configs = {
      professional: { harmony: 'monochromatic' as HarmonyType, saturation: 70, lightness: 50, tags: ['business', 'corporate', 'clean'] },
      energetic: { harmony: 'complementary' as HarmonyType, saturation: 90, lightness: 60, tags: ['vibrant', 'active', 'bold'] },
      calming: { harmony: 'analogous' as HarmonyType, saturation: 50, lightness: 70, tags: ['peaceful', 'serene', 'relaxing'] },
      warm: { harmony: 'analogous' as HarmonyType, saturation: 80, lightness: 65, tags: ['cozy', 'friendly', 'inviting'] },
      cool: { harmony: 'analogous' as HarmonyType, saturation: 60, lightness: 55, tags: ['fresh', 'modern', 'crisp'] },
      natural: { harmony: 'analogous' as HarmonyType, saturation: 70, lightness: 50, tags: ['organic', 'earth', 'eco'] },
      vibrant: { harmony: 'triadic' as HarmonyType, saturation: 95, lightness: 60, tags: ['energetic', 'fun', 'bold'] },
      minimal: { harmony: 'monochromatic' as HarmonyType, saturation: 20, lightness: 60, tags: ['clean', 'simple', 'elegant'] },
      luxurious: { harmony: 'complementary' as HarmonyType, saturation: 60, lightness: 40, tags: ['premium', 'elegant', 'sophisticated'] },
      playful: { harmony: 'triadic' as HarmonyType, saturation: 85, lightness: 70, tags: ['fun', 'cheerful', 'creative'] },
    };
    return configs[mood];
  }

  private static getIndustryConfiguration(industry: string) {
    const configs: Record<string, any> = {
      tech: { primaryColor: '#3B82F6', harmony: 'monochromatic', mood: 'professional', tags: ['modern', 'digital'] },
      finance: { primaryColor: '#059669', harmony: 'complementary', mood: 'professional', tags: ['trustworthy', 'stable'] },
      healthcare: { primaryColor: '#06B6D4', harmony: 'analogous', mood: 'calming', tags: ['caring', 'clean'] },
      creative: { primaryColor: '#EC4899', harmony: 'triadic', mood: 'vibrant', tags: ['artistic', 'bold'] },
      education: { primaryColor: '#F59E0B', harmony: 'complementary', mood: 'warm', tags: ['friendly', 'approachable'] },
      food: { primaryColor: '#EF4444', harmony: 'analogous', mood: 'warm', tags: ['appetizing', 'fresh'] },
    };
    return configs[industry] || configs.tech;
  }

  private static checkAccessibility(colors: string[]): { wcagCompliant: boolean; contrastRatios: number[] } {
    const contrastRatios: number[] = [];
    let wcagCompliant = true;

    // Check contrast between each color and white/black
    colors.forEach(color => {
      const contrastWithWhite = this.calculateContrastRatio(color, '#FFFFFF');
      const contrastWithBlack = this.calculateContrastRatio(color, '#000000');

      contrastRatios.push(Math.max(contrastWithWhite, contrastWithBlack));

      // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
      if (Math.max(contrastWithWhite, contrastWithBlack) < 3.0) {
        wcagCompliant = false;
      }
    });

    return { wcagCompliant, contrastRatios };
  }

  private static calculateContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getLuminance(color1);
    const lum2 = this.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  private static getLuminance(hex: string): number {
    const rgb = this.hexToRGB(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private static assignColorUsage(colors: string[]): ColorPalette['usage'] {
    return {
      primary: colors[0] || '#3B82F6',
      secondary: colors[1] || '#6366F1',
      accent: colors[2] || '#EC4899',
      background: colors[3] || '#F8FAFC',
      text: this.getLuminance(colors[3] || '#F8FAFC') > 0.5 ? '#1F2937' : '#F9FAFB',
    };
  }

  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}