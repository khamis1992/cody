/**
 * Professional Logo Generation System
 * Creates high-quality SVG logos based on modern design principles
 */

export interface LogoConfig {
  name: string;
  industry: 'tech' | 'finance' | 'healthcare' | 'education' | 'creative' | 'ecommerce' | 'food' | 'fitness' | 'travel' | 'real-estate';
  style: 'minimalist' | 'geometric' | 'gradient' | 'modern' | 'vintage' | 'abstract' | 'playful' | 'professional';
  type: 'wordmark' | 'lettermark' | 'symbol' | 'combination' | 'emblem' | 'abstract';
  colors: {
    primary: string;
    secondary?: string;
    accent?: string;
  };
  typography: {
    family: string;
    weight: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
    style: 'normal' | 'italic';
  };
  variations: {
    horizontal: boolean;
    vertical: boolean;
    iconOnly: boolean;
    compact: boolean;
  };
}

export interface LogoOutput {
  id: string;
  name: string;
  svg: string;
  variations: {
    horizontal: string;
    vertical: string;
    iconOnly: string;
    compact: string;
  };
  colorVariations: {
    primary: string;
    white: string;
    black: string;
    monochrome: string;
  };
  dimensions: {
    width: number;
    height: number;
    aspectRatio: number;
  };
  files: {
    svg: string;
    png: string;
    favicon: string;
  };
}

/**
 * Core Logo Generator Class
 */
export class LogoGenerator {
  private config: LogoConfig;
  private symbolLibrary: Map<string, string> = new Map();
  private fontLibrary: Map<string, string> = new Map();

  constructor(config: LogoConfig) {
    this.config = config;
    this.initializeLibraries();
  }

  /**
   * Generate complete logo package
   */
  generateLogo(): LogoOutput {
    const logoId = this.generateId();
    const baseSvg = this.createBaseLogo();

    return {
      id: logoId,
      name: this.config.name,
      svg: baseSvg,
      variations: this.generateVariations(baseSvg),
      colorVariations: this.generateColorVariations(baseSvg),
      dimensions: this.calculateDimensions(baseSvg),
      files: this.generateFileVariants(baseSvg, logoId),
    };
  }

  /**
   * Create base logo based on type and style
   */
  private createBaseLogo(): string {
    switch (this.config.type) {
      case 'wordmark':
        return this.createWordmark();
      case 'lettermark':
        return this.createLettermark();
      case 'symbol':
        return this.createSymbol();
      case 'combination':
        return this.createCombination();
      case 'emblem':
        return this.createEmblem();
      case 'abstract':
        return this.createAbstract();
      default:
        return this.createWordmark();
    }
  }

  /**
   * Create wordmark logo (text-based)
   */
  private createWordmark(): string {
    const cleanName = this.sanitizeText(this.config.name);
    const fontSize = this.calculateFontSize(cleanName);
    const letterSpacing = this.calculateLetterSpacing();

    const styleClasses = this.getStyleClasses();
    const textEffects = this.getTextEffects();

    return `
      <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="${this.config.typography.family}"
          font-weight="${this.getFontWeight()}"
          font-style="${this.config.typography.style}"
          font-size="${fontSize}"
          letter-spacing="${letterSpacing}"
          fill="${this.getPrimaryFill()}"
          class="${styleClasses}"
          ${textEffects}
        >
          ${cleanName}
        </text>
        ${this.addDecorations()}
      </svg>
    `;
  }

  /**
   * Create lettermark logo (initials)
   */
  private createLettermark(): string {
    const initials = this.extractInitials(this.config.name);
    const fontSize = Math.max(32, 60 / initials.length);

    return `
      <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        ${this.generateBackground()}
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="${this.config.typography.family}"
          font-weight="${this.getFontWeight()}"
          font-size="${fontSize}"
          fill="${this.getContrastFill()}"
        >
          ${initials}
        </text>
      </svg>
    `;
  }

  /**
   * Create symbol/icon logo
   */
  private createSymbol(): string {
    const symbol = this.getIndustrySymbol();
    const size = 60;

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        ${symbol}
      </svg>
    `;
  }

  /**
   * Create combination logo (symbol + text)
   */
  private createCombination(): string {
    const symbol = this.getIndustrySymbol();
    const cleanName = this.sanitizeText(this.config.name);
    const symbolSize = 40;
    const fontSize = 24;

    return `
      <svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        <g transform="translate(10, 10)">
          ${symbol}
        </g>
        <text
          x="70"
          y="30"
          dominant-baseline="central"
          font-family="${this.config.typography.family}"
          font-weight="${this.getFontWeight()}"
          font-size="${fontSize}"
          fill="${this.getPrimaryFill()}"
        >
          ${cleanName}
        </text>
      </svg>
    `;
  }

  /**
   * Create emblem logo (text inside symbol)
   */
  private createEmblem(): string {
    const cleanName = this.sanitizeText(this.config.name);
    const radius = 35;
    const fontSize = Math.min(16, 400 / cleanName.length);

    return `
      <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        <circle
          cx="40"
          cy="40"
          r="${radius}"
          fill="${this.getPrimaryFill()}"
          stroke="${this.config.colors.secondary || this.config.colors.primary}"
          stroke-width="2"
        />
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="${this.config.typography.family}"
          font-weight="${this.getFontWeight()}"
          font-size="${fontSize}"
          fill="${this.getContrastFill()}"
        >
          ${cleanName}
        </text>
      </svg>
    `;
  }

  /**
   * Create abstract logo
   */
  private createAbstract(): string {
    const shapes = this.generateAbstractShapes();

    return `
      <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${this.generateGradients()}
          ${this.generateFilters()}
        </defs>
        ${shapes}
      </svg>
    `;
  }

  /**
   * Generate logo variations
   */
  private generateVariations(baseSvg: string): LogoOutput['variations'] {
    return {
      horizontal: this.createHorizontalVariation(baseSvg),
      vertical: this.createVerticalVariation(baseSvg),
      iconOnly: this.createIconOnlyVariation(baseSvg),
      compact: this.createCompactVariation(baseSvg),
    };
  }

  /**
   * Generate color variations
   */
  private generateColorVariations(baseSvg: string): LogoOutput['colorVariations'] {
    return {
      primary: baseSvg,
      white: this.replaceColors(baseSvg, '#FFFFFF'),
      black: this.replaceColors(baseSvg, '#000000'),
      monochrome: this.createMonochromeVersion(baseSvg),
    };
  }

  // Utility methods

  private initializeLibraries(): void {
    // Initialize symbol library
    this.symbolLibrary.set('tech', this.getTechSymbols());
    this.symbolLibrary.set('finance', this.getFinanceSymbols());
    this.symbolLibrary.set('healthcare', this.getHealthcareSymbols());
    this.symbolLibrary.set('education', this.getEducationSymbols());
    this.symbolLibrary.set('creative', this.getCreativeSymbols());
    this.symbolLibrary.set('ecommerce', this.getEcommerceSymbols());

    // Initialize font library
    this.fontLibrary.set('minimalist', 'Inter, system-ui, sans-serif');
    this.fontLibrary.set('geometric', 'Poppins, sans-serif');
    this.fontLibrary.set('modern', 'Roboto, sans-serif');
    this.fontLibrary.set('professional', 'Source Sans Pro, sans-serif');
    this.fontLibrary.set('creative', 'Nunito, sans-serif');
    this.fontLibrary.set('playful', 'Quicksand, sans-serif');
  }

  private generateId(): string {
    return `logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeText(text: string): string {
    return text.trim().replace(/[^\w\s]/gi, '');
  }

  private extractInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 3)
      .join('');
  }

  private calculateFontSize(text: string): number {
    const baseSize = 28;
    const maxLength = 12;
    if (text.length > maxLength) {
      return Math.max(16, baseSize - (text.length - maxLength) * 1.5);
    }
    return baseSize;
  }

  private calculateLetterSpacing(): string {
    switch (this.config.style) {
      case 'minimalist':
        return '0.05em';
      case 'geometric':
        return '0.1em';
      case 'professional':
        return '0.02em';
      default:
        return '0.03em';
    }
  }

  private getFontWeight(): string {
    const weights = {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    };
    return weights[this.config.typography.weight];
  }

  private getPrimaryFill(): string {
    if (this.config.style === 'gradient' && this.config.colors.secondary) {
      return 'url(#primaryGradient)';
    }
    return this.config.colors.primary;
  }

  private getContrastFill(): string {
    // Calculate contrast color
    const hex = this.config.colors.primary.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  private generateGradients(): string {
    if (!this.config.colors.secondary) return '';

    return `
      <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${this.config.colors.primary}" />
        <stop offset="100%" style="stop-color:${this.config.colors.secondary}" />
      </linearGradient>
      <radialGradient id="radialGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" style="stop-color:${this.config.colors.primary}" />
        <stop offset="100%" style="stop-color:${this.config.colors.secondary}" />
      </radialGradient>
    `;
  }

  private generateFilters(): string {
    if (this.config.style === 'modern' || this.config.style === 'professional') {
      return `
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
        </filter>
      `;
    }
    return '';
  }

  private getStyleClasses(): string {
    const classes = [];
    if (this.config.style === 'modern') classes.push('drop-shadow');
    if (this.config.style === 'playful') classes.push('animate-bounce');
    return classes.join(' ');
  }

  private getTextEffects(): string {
    if (this.config.style === 'modern') {
      return 'filter="url(#shadow)"';
    }
    return '';
  }

  private addDecorations(): string {
    if (this.config.style === 'minimalist') {
      return `<line x1="10" y1="45" x2="190" y2="45" stroke="${this.config.colors.primary}" stroke-width="1" opacity="0.3"/>`;
    }
    return '';
  }

  private generateBackground(): string {
    switch (this.config.style) {
      case 'geometric':
        return `<rect width="80" height="80" rx="8" fill="${this.getPrimaryFill()}"/>`;
      case 'gradient':
        return `<circle cx="40" cy="40" r="35" fill="url(#radialGradient)"/>`;
      case 'modern':
        return `<rect width="80" height="80" rx="16" fill="${this.getPrimaryFill()}"/>`;
      default:
        return `<circle cx="40" cy="40" r="35" fill="${this.getPrimaryFill()}"/>`;
    }
  }

  private getIndustrySymbol(): string {
    const symbols = this.symbolLibrary.get(this.config.industry) || this.getTechSymbols();
    return symbols;
  }

  // Industry-specific symbol generators
  private getTechSymbols(): string {
    return `
      <rect x="15" y="15" width="30" height="30" rx="6" fill="${this.getPrimaryFill()}" opacity="0.8"/>
      <rect x="20" y="20" width="20" height="20" rx="4" fill="${this.getContrastFill()}"/>
      <circle cx="25" cy="25" r="3" fill="${this.getPrimaryFill()}"/>
      <circle cx="35" cy="25" r="2" fill="${this.getPrimaryFill()}"/>
      <circle cx="30" cy="35" r="2" fill="${this.getPrimaryFill()}"/>
    `;
  }

  private getFinanceSymbols(): string {
    return `
      <path d="M20 40 L30 20 L40 30 L50 15" stroke="${this.getPrimaryFill()}" stroke-width="3" fill="none"/>
      <circle cx="30" cy="20" r="2" fill="${this.getPrimaryFill()}"/>
      <circle cx="40" cy="30" r="2" fill="${this.getPrimaryFill()}"/>
      <circle cx="50" cy="15" r="2" fill="${this.getPrimaryFill()}"/>
    `;
  }

  private getHealthcareSymbols(): string {
    return `
      <rect x="28" y="15" width="4" height="30" fill="${this.getPrimaryFill()}"/>
      <rect x="15" y="28" width="30" height="4" fill="${this.getPrimaryFill()}"/>
      <circle cx="30" cy="30" r="18" stroke="${this.getPrimaryFill()}" stroke-width="2" fill="none"/>
    `;
  }

  private getEducationSymbols(): string {
    return `
      <path d="M10 25 L30 15 L50 25 L30 35 Z" fill="${this.getPrimaryFill()}"/>
      <rect x="28" y="35" width="4" height="15" fill="${this.getPrimaryFill()}"/>
      <rect x="20" y="48" width="20" height="3" fill="${this.getPrimaryFill()}"/>
    `;
  }

  private getCreativeSymbols(): string {
    return `
      <circle cx="30" cy="30" r="15" fill="none" stroke="${this.getPrimaryFill()}" stroke-width="2"/>
      <path d="M25 25 Q30 20 35 25 Q30 30 25 25" fill="${this.getPrimaryFill()}"/>
      <circle cx="30" cy="35" r="2" fill="${this.getPrimaryFill()}"/>
    `;
  }

  private getEcommerceSymbols(): string {
    return `
      <rect x="15" y="20" width="30" height="20" rx="2" fill="none" stroke="${this.getPrimaryFill()}" stroke-width="2"/>
      <circle cx="22" cy="45" r="3" fill="${this.getPrimaryFill()}"/>
      <circle cx="38" cy="45" r="3" fill="${this.getPrimaryFill()}"/>
      <path d="M20 20 L25 15 L35 15 L40 20" stroke="${this.getPrimaryFill()}" stroke-width="2" fill="none"/>
    `;
  }

  private generateAbstractShapes(): string {
    const shapes = [];
    for (let i = 0; i < 3; i++) {
      const x = 15 + i * 15;
      const y = 20 + i * 10;
      const size = 20 - i * 3;
      shapes.push(`<circle cx="${x}" cy="${y}" r="${size}" fill="${this.getPrimaryFill()}" opacity="${0.8 - i * 0.2}"/>`);
    }
    return shapes.join('');
  }

  // Variation generators
  private createHorizontalVariation(baseSvg: string): string {
    // Convert to horizontal layout
    return baseSvg.replace(/width="80"/, 'width="160"').replace(/height="80"/, 'height="40"');
  }

  private createVerticalVariation(baseSvg: string): string {
    // Convert to vertical layout
    return baseSvg.replace(/width="180"/, 'width="90"').replace(/height="60"/, 'height="120"');
  }

  private createIconOnlyVariation(baseSvg: string): string {
    // Extract only the symbol part
    if (this.config.type === 'combination' || this.config.type === 'emblem') {
      return this.createSymbol();
    }
    return baseSvg;
  }

  private createCompactVariation(baseSvg: string): string {
    // Create smaller version
    return baseSvg.replace(/font-size="(\d+)"/, (match, size) => `font-size="${Math.floor(parseInt(size) * 0.8)}"`);
  }

  private replaceColors(svg: string, newColor: string): string {
    return svg
      .replace(/fill="[^"]*"/g, `fill="${newColor}"`)
      .replace(/stroke="[^"]*"/g, `stroke="${newColor}"`);
  }

  private createMonochromeVersion(svg: string): string {
    return svg
      .replace(/fill="[^"]*"/g, 'fill="#6B7280"')
      .replace(/stroke="[^"]*"/g, 'stroke="#6B7280"')
      .replace(/url\(#[^)]*\)/g, '#6B7280');
  }

  private calculateDimensions(svg: string): LogoOutput['dimensions'] {
    const widthMatch = svg.match(/width="(\d+)"/);
    const heightMatch = svg.match(/height="(\d+)"/);
    const width = widthMatch ? parseInt(widthMatch[1]) : 100;
    const height = heightMatch ? parseInt(heightMatch[1]) : 100;
    return {
      width,
      height,
      aspectRatio: width / height,
    };
  }

  private generateFileVariants(svg: string, logoId: string): LogoOutput['files'] {
    return {
      svg: svg,
      png: `data:image/png;base64,${this.svgToPng(svg)}`,
      favicon: this.generateFavicon(svg),
    };
  }

  private svgToPng(svg: string): string {
    // Placeholder for SVG to PNG conversion
    // In real implementation, use canvas or server-side rendering
    return btoa(svg);
  }

  private generateFavicon(svg: string): string {
    // Create 32x32 favicon version
    return svg
      .replace(/width="[^"]*"/, 'width="32"')
      .replace(/height="[^"]*"/, 'height="32"')
      .replace(/viewBox="[^"]*"/, 'viewBox="0 0 32 32"');
  }
}

/**
 * Quick logo generation function
 */
export function generateLogo(config: Partial<LogoConfig>): LogoOutput {
  const defaultConfig: LogoConfig = {
    name: 'Logo',
    industry: 'tech',
    style: 'minimalist',
    type: 'wordmark',
    colors: {
      primary: '#3B82F6',
      secondary: '#6366F1',
    },
    typography: {
      family: 'Inter, sans-serif',
      weight: 'semibold',
      style: 'normal',
    },
    variations: {
      horizontal: true,
      vertical: true,
      iconOnly: true,
      compact: true,
    },
  };

  const generator = new LogoGenerator({ ...defaultConfig, ...config });
  return generator.generateLogo();
}

/**
 * Industry-specific logo presets
 */
export const LOGO_PRESETS = {
  tech: {
    style: 'minimalist' as const,
    colors: { primary: '#3B82F6', secondary: '#6366F1' },
    typography: { family: 'Inter, sans-serif', weight: 'semibold' as const, style: 'normal' as const },
  },
  finance: {
    style: 'professional' as const,
    colors: { primary: '#059669', secondary: '#0D9488' },
    typography: { family: 'Source Sans Pro, sans-serif', weight: 'bold' as const, style: 'normal' as const },
  },
  creative: {
    style: 'playful' as const,
    colors: { primary: '#EC4899', secondary: '#8B5CF6' },
    typography: { family: 'Nunito, sans-serif', weight: 'bold' as const, style: 'normal' as const },
  },
  healthcare: {
    style: 'professional' as const,
    colors: { primary: '#3B82F6', secondary: '#06B6D4' },
    typography: { family: 'Roboto, sans-serif', weight: 'medium' as const, style: 'normal' as const },
  },
} as const;