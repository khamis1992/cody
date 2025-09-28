/**
 * Logo Design Principles and Templates
 * Based on modern design trends from logggos.club and industry best practices
 */

export interface DesignPrinciple {
  name: string;
  description: string;
  rules: string[];
  examples: string[];
  industry: string[];
}

export interface LogoTemplate {
  id: string;
  name: string;
  category: 'wordmark' | 'lettermark' | 'symbol' | 'combination' | 'emblem';
  industry: string[];
  style: string;
  complexity: 'simple' | 'medium' | 'complex';
  svgTemplate: string;
  variables: TemplateVariable[];
  preview: string;
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'color' | 'number' | 'boolean';
  default: any;
  description: string;
  constraints?: {
    min?: number;
    max?: number;
    options?: string[];
  };
}

/**
 * Core Design Principles for Professional Logos
 */
export const LOGO_DESIGN_PRINCIPLES: DesignPrinciple[] = [
  {
    name: 'Simplicity',
    description: 'A logo should be simple enough to be memorable and versatile',
    rules: [
      'Use minimal elements and avoid clutter',
      'Limit color palette to 2-3 colors maximum',
      'Choose clean, readable typography',
      'Ensure scalability from favicon to billboard size',
      'Remove unnecessary details and decorative elements',
    ],
    examples: ['Apple', 'Nike', 'Google', 'Microsoft'],
    industry: ['tech', 'finance', 'healthcare', 'education'],
  },
  {
    name: 'Memorability',
    description: 'A logo should be distinctive and easy to remember',
    rules: [
      'Create unique visual elements',
      'Use distinctive color combinations',
      'Incorporate memorable shapes or symbols',
      'Avoid clichéd industry symbols',
      'Make it emotionally resonant',
    ],
    examples: ['Twitter', 'McDonald\'s', 'Coca-Cola', 'FedEx'],
    industry: ['social', 'food', 'retail', 'creative'],
  },
  {
    name: 'Timelessness',
    description: 'A logo should remain relevant and effective over time',
    rules: [
      'Avoid trendy design elements that quickly date',
      'Use classic typography and proportions',
      'Choose enduring color schemes',
      'Focus on fundamental rather than fashionable design',
      'Test logo across different time periods',
    ],
    examples: ['IBM', 'Coca-Cola', 'Shell', 'Mercedes-Benz'],
    industry: ['finance', 'automotive', 'energy', 'luxury'],
  },
  {
    name: 'Versatility',
    description: 'A logo should work across all applications and media',
    rules: [
      'Design for multiple sizes and resolutions',
      'Ensure readability in black and white',
      'Work on light and dark backgrounds',
      'Function in horizontal and vertical layouts',
      'Adapt to different aspect ratios',
    ],
    examples: ['Pepsi', 'Adidas', 'Mastercard', 'Spotify'],
    industry: ['retail', 'sports', 'finance', 'entertainment'],
  },
  {
    name: 'Appropriateness',
    description: 'A logo should fit the company\'s industry and audience',
    rules: [
      'Match the tone and personality of the brand',
      'Consider cultural and regional sensitivities',
      'Align with industry expectations',
      'Appeal to the target demographic',
      'Reflect brand values and mission',
    ],
    examples: ['Disney', 'Goldman Sachs', 'Red Cross', 'LinkedIn'],
    industry: ['entertainment', 'finance', 'healthcare', 'professional'],
  },
];

/**
 * Professional Logo Templates
 */
export const LOGO_TEMPLATES: LogoTemplate[] = [
  {
    id: 'minimal-wordmark',
    name: 'Minimal Wordmark',
    category: 'wordmark',
    industry: ['tech', 'finance', 'professional'],
    style: 'minimalist',
    complexity: 'simple',
    svgTemplate: `
      <svg width="{{width}}" height="{{height}}" viewBox="0 0 {{width}} {{height}}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="{{fontFamily}}"
          font-weight="{{fontWeight}}"
          font-size="{{fontSize}}"
          letter-spacing="{{letterSpacing}}"
          fill="{{primaryColor}}"
        >
          {{companyName}}
        </text>
        {{#if showUnderline}}
        <line x1="{{underlineStart}}" y1="{{underlineY}}" x2="{{underlineEnd}}" y2="{{underlineY}}"
              stroke="{{primaryColor}}" stroke-width="1" opacity="0.3"/>
        {{/if}}
      </svg>
    `,
    variables: [
      { name: 'companyName', type: 'text', default: 'Company', description: 'Company name' },
      { name: 'primaryColor', type: 'color', default: '#1F2937', description: 'Primary brand color' },
      { name: 'fontFamily', type: 'text', default: 'Inter, sans-serif', description: 'Font family' },
      { name: 'fontWeight', type: 'number', default: 600, description: 'Font weight' },
      { name: 'fontSize', type: 'number', default: 28, description: 'Font size' },
      { name: 'letterSpacing', type: 'text', default: '0.05em', description: 'Letter spacing' },
      { name: 'showUnderline', type: 'boolean', default: false, description: 'Show decorative underline' },
    ],
    preview: 'bg-gradient-to-r from-gray-50 to-gray-100',
  },
  {
    id: 'geometric-lettermark',
    name: 'Geometric Lettermark',
    category: 'lettermark',
    industry: ['tech', 'creative', 'startup'],
    style: 'geometric',
    complexity: 'medium',
    svgTemplate: `
      <svg width="{{size}}" height="{{size}}" viewBox="0 0 {{size}} {{size}}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {{#if useGradient}}
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:{{primaryColor}}" />
            <stop offset="100%" style="stop-color:{{secondaryColor}}" />
          </linearGradient>
          {{/if}}
        </defs>
        <rect width="{{size}}" height="{{size}}" rx="{{borderRadius}}"
              fill="{{#if useGradient}}url(#bgGradient){{else}}{{primaryColor}}{{/if}}"/>
        <text
          x="50%"
          y="50%"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="{{fontFamily}}"
          font-weight="{{fontWeight}}"
          font-size="{{fontSize}}"
          fill="{{textColor}}"
        >
          {{initials}}
        </text>
      </svg>
    `,
    variables: [
      { name: 'initials', type: 'text', default: 'AB', description: 'Company initials' },
      { name: 'primaryColor', type: 'color', default: '#3B82F6', description: 'Primary color' },
      { name: 'secondaryColor', type: 'color', default: '#6366F1', description: 'Secondary color' },
      { name: 'textColor', type: 'color', default: '#FFFFFF', description: 'Text color' },
      { name: 'size', type: 'number', default: 80, description: 'Logo size' },
      { name: 'borderRadius', type: 'number', default: 16, description: 'Corner radius' },
      { name: 'fontSize', type: 'number', default: 32, description: 'Font size' },
      { name: 'fontFamily', type: 'text', default: 'Poppins, sans-serif', description: 'Font family' },
      { name: 'fontWeight', type: 'number', default: 700, description: 'Font weight' },
      { name: 'useGradient', type: 'boolean', default: true, description: 'Use gradient background' },
    ],
    preview: 'bg-gradient-to-br from-blue-50 to-purple-50',
  },
  {
    id: 'tech-symbol',
    name: 'Tech Symbol',
    category: 'symbol',
    industry: ['tech', 'software', 'ai'],
    style: 'modern',
    complexity: 'medium',
    svgTemplate: `
      <svg width="{{size}}" height="{{size}}" viewBox="0 0 {{size}} {{size}}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:{{primaryColor}}" />
            <stop offset="100%" style="stop-color:{{secondaryColor}}" />
          </linearGradient>
        </defs>
        {{#if showCircle}}
        <circle cx="{{centerX}}" cy="{{centerY}}" r="{{circleRadius}}"
                fill="none" stroke="{{primaryColor}}" stroke-width="{{strokeWidth}}" opacity="0.3"/>
        {{/if}}
        <rect x="{{rectX}}" y="{{rectY}}" width="{{rectWidth}}" height="{{rectHeight}}"
              rx="{{rectRadius}}" fill="url(#techGradient)"/>
        <rect x="{{innerRectX}}" y="{{innerRectY}}" width="{{innerRectWidth}}" height="{{innerRectHeight}}"
              rx="{{innerRadius}}" fill="{{backgroundColor}}"/>
        <circle cx="{{dot1X}}" cy="{{dot1Y}}" r="{{dotSize}}" fill="{{primaryColor}}"/>
        <circle cx="{{dot2X}}" cy="{{dot2Y}}" r="{{dotSize}}" fill="{{primaryColor}}"/>
        <circle cx="{{dot3X}}" cy="{{dot3Y}}" r="{{dotSize}}" fill="{{primaryColor}}"/>
      </svg>
    `,
    variables: [
      { name: 'primaryColor', type: 'color', default: '#3B82F6', description: 'Primary color' },
      { name: 'secondaryColor', type: 'color', default: '#6366F1', description: 'Secondary color' },
      { name: 'backgroundColor', type: 'color', default: '#FFFFFF', description: 'Background color' },
      { name: 'size', type: 'number', default: 64, description: 'Logo size' },
      { name: 'showCircle', type: 'boolean', default: true, description: 'Show outer circle' },
      { name: 'strokeWidth', type: 'number', default: 2, description: 'Stroke width' },
      { name: 'dotSize', type: 'number', default: 2, description: 'Dot size' },
    ],
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  },
  {
    id: 'creative-combination',
    name: 'Creative Combination',
    category: 'combination',
    industry: ['creative', 'design', 'marketing'],
    style: 'playful',
    complexity: 'medium',
    svgTemplate: `
      <svg width="{{width}}" height="{{height}}" viewBox="0 0 {{width}} {{height}}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="creativeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:{{primaryColor}}" />
            <stop offset="50%" style="stop-color:{{secondaryColor}}" />
            <stop offset="100%" style="stop-color:{{accentColor}}" />
          </linearGradient>
        </defs>
        <!-- Creative symbol -->
        <g transform="translate({{symbolX}}, {{symbolY}})">
          <circle cx="20" cy="20" r="15" fill="none" stroke="url(#creativeGradient)" stroke-width="3"/>
          <path d="M15 15 Q20 10 25 15 Q20 20 15 15" fill="{{primaryColor}}"/>
          <circle cx="20" cy="25" r="2" fill="{{accentColor}}"/>
        </g>
        <!-- Company name -->
        <text
          x="{{textX}}"
          y="{{textY}}"
          dominant-baseline="central"
          font-family="{{fontFamily}}"
          font-weight="{{fontWeight}}"
          font-size="{{fontSize}}"
          fill="{{textColor}}"
        >
          {{companyName}}
        </text>
      </svg>
    `,
    variables: [
      { name: 'companyName', type: 'text', default: 'Creative Co', description: 'Company name' },
      { name: 'primaryColor', type: 'color', default: '#EC4899', description: 'Primary color' },
      { name: 'secondaryColor', type: 'color', default: '#8B5CF6', description: 'Secondary color' },
      { name: 'accentColor', type: 'color', default: '#F59E0B', description: 'Accent color' },
      { name: 'textColor', type: 'color', default: '#1F2937', description: 'Text color' },
      { name: 'width', type: 'number', default: 180, description: 'Logo width' },
      { name: 'height', type: 'number', default: 60, description: 'Logo height' },
      { name: 'fontSize', type: 'number', default: 24, description: 'Font size' },
      { name: 'fontFamily', type: 'text', default: 'Nunito, sans-serif', description: 'Font family' },
      { name: 'fontWeight', type: 'number', default: 700, description: 'Font weight' },
    ],
    preview: 'bg-gradient-to-br from-pink-50 to-purple-50',
  },
  {
    id: 'finance-emblem',
    name: 'Finance Emblem',
    category: 'emblem',
    industry: ['finance', 'banking', 'insurance'],
    style: 'professional',
    complexity: 'complex',
    svgTemplate: `
      <svg width="{{size}}" height="{{size}}" viewBox="0 0 {{size}} {{size}}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="financeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:{{primaryColor}}" />
            <stop offset="100%" style="stop-color:{{secondaryColor}}" />
          </linearGradient>
        </defs>
        <!-- Outer circle -->
        <circle cx="{{centerX}}" cy="{{centerY}}" r="{{outerRadius}}"
                fill="url(#financeGradient)" stroke="{{borderColor}}" stroke-width="{{borderWidth}}"/>
        <!-- Inner circle -->
        {{#if showInnerCircle}}
        <circle cx="{{centerX}}" cy="{{centerY}}" r="{{innerRadius}}"
                fill="none" stroke="{{backgroundColor}}" stroke-width="2" opacity="0.3"/>
        {{/if}}
        <!-- Chart symbol -->
        <g transform="translate({{chartX}}, {{chartY}})">
          <path d="M5 15 L10 8 L15 12 L20 5" stroke="{{backgroundColor}}" stroke-width="2" fill="none"/>
          <circle cx="10" cy="8" r="1.5" fill="{{backgroundColor}}"/>
          <circle cx="15" cy="12" r="1.5" fill="{{backgroundColor}}"/>
          <circle cx="20" cy="5" r="1.5" fill="{{backgroundColor}}"/>
        </g>
        <!-- Company name -->
        <text
          x="50%"
          y="{{textY}}"
          dominant-baseline="central"
          text-anchor="middle"
          font-family="{{fontFamily}}"
          font-weight="{{fontWeight}}"
          font-size="{{fontSize}}"
          fill="{{textColor}}"
        >
          {{companyName}}
        </text>
      </svg>
    `,
    variables: [
      { name: 'companyName', type: 'text', default: 'Finance Corp', description: 'Company name' },
      { name: 'primaryColor', type: 'color', default: '#059669', description: 'Primary color' },
      { name: 'secondaryColor', type: 'color', default: '#0D9488', description: 'Secondary color' },
      { name: 'borderColor', type: 'color', default: '#065F46', description: 'Border color' },
      { name: 'backgroundColor', type: 'color', default: '#FFFFFF', description: 'Background color' },
      { name: 'textColor', type: 'color', default: '#FFFFFF', description: 'Text color' },
      { name: 'size', type: 'number', default: 100, description: 'Logo size' },
      { name: 'borderWidth', type: 'number', default: 2, description: 'Border width' },
      { name: 'fontSize', type: 'number', default: 12, description: 'Font size' },
      { name: 'fontFamily', type: 'text', default: 'Source Sans Pro, sans-serif', description: 'Font family' },
      { name: 'fontWeight', type: 'number', default: 700, description: 'Font weight' },
      { name: 'showInnerCircle', type: 'boolean', default: true, description: 'Show inner circle' },
    ],
    preview: 'bg-gradient-to-br from-emerald-50 to-teal-50',
  },
];

/**
 * Logo Style Guidelines
 */
export const LOGO_STYLE_GUIDELINES = {
  minimalist: {
    description: 'Clean, simple designs with minimal elements',
    characteristics: [
      'Limited color palette (1-2 colors)',
      'Simple geometric shapes',
      'Clean typography',
      'Lots of white space',
      'No decorative elements',
    ],
    industries: ['tech', 'finance', 'healthcare', 'education'],
    examples: ['Apple', 'Uber', 'Stripe', 'Zoom'],
  },
  geometric: {
    description: 'Based on geometric shapes and mathematical proportions',
    characteristics: [
      'Perfect circles, squares, triangles',
      'Golden ratio proportions',
      'Symmetrical designs',
      'Bold, angular typography',
      'High contrast colors',
    ],
    industries: ['tech', 'architecture', 'engineering', 'design'],
    examples: ['Microsoft', 'Adobe', 'Slack', 'Firefox'],
  },
  gradient: {
    description: 'Uses color gradients for modern, dynamic appearance',
    characteristics: [
      'Smooth color transitions',
      'Vibrant color combinations',
      'Depth and dimension',
      'Modern, trendy feel',
      'Eye-catching aesthetics',
    ],
    industries: ['tech', 'creative', 'entertainment', 'social'],
    examples: ['Instagram', 'Firefox', 'Asana', 'Figma'],
  },
  vintage: {
    description: 'Classic, timeless designs with retro elements',
    characteristics: [
      'Classic typography',
      'Muted color palettes',
      'Traditional symbols',
      'Hand-crafted feel',
      'Ornamental details',
    ],
    industries: ['food', 'fashion', 'hospitality', 'luxury'],
    examples: ['Coca-Cola', 'Harley Davidson', 'Jack Daniels', 'Levi\'s'],
  },
  abstract: {
    description: 'Non-literal, conceptual designs',
    characteristics: [
      'Unique, original shapes',
      'Creative interpretations',
      'Symbolic meanings',
      'Artistic expression',
      'Memorable visuals',
    ],
    industries: ['creative', 'consulting', 'technology', 'innovation'],
    examples: ['Pepsi', 'Nike', 'Adidas', 'Chase'],
  },
  playful: {
    description: 'Fun, energetic designs with personality',
    characteristics: [
      'Bright, vibrant colors',
      'Rounded, friendly shapes',
      'Casual typography',
      'Whimsical elements',
      'Approachable feel',
    ],
    industries: ['entertainment', 'children', 'food', 'social'],
    examples: ['Disney', 'Nickelodeon', 'Mailchimp', 'Slack'],
  },
};

/**
 * Industry-Specific Logo Guidelines
 */
export const INDUSTRY_LOGO_GUIDELINES = {
  tech: {
    commonElements: ['Circuits', 'Geometric shapes', 'Abstract symbols', 'Clean typography'],
    colorPalettes: ['Blue tones', 'Gradients', 'Monochromatic', 'High contrast'],
    styles: ['Minimalist', 'Geometric', 'Abstract', 'Modern'],
    avoidElements: ['Overly complex designs', 'Traditional symbols', 'Serif fonts'],
  },
  finance: {
    commonElements: ['Charts/graphs', 'Geometric shapes', 'Arrows', 'Strong typography'],
    colorPalettes: ['Blue and green', 'Conservative colors', 'Gold accents', 'Professional tones'],
    styles: ['Professional', 'Minimalist', 'Emblem', 'Classic'],
    avoidElements: ['Playful colors', 'Casual fonts', 'Abstract art', 'Trendy elements'],
  },
  healthcare: {
    commonElements: ['Crosses', 'Hearts', 'Circles', 'Caring symbols'],
    colorPalettes: ['Blue and white', 'Green tones', 'Calming colors', 'Clean palettes'],
    styles: ['Clean', 'Professional', 'Trustworthy', 'Simple'],
    avoidElements: ['Dark colors', 'Sharp edges', 'Complex designs', 'Aggressive symbols'],
  },
  creative: {
    commonElements: ['Artistic symbols', 'Color swatches', 'Brushes', 'Abstract shapes'],
    colorPalettes: ['Vibrant colors', 'Rainbow gradients', 'Bold combinations', 'Artistic palettes'],
    styles: ['Playful', 'Abstract', 'Gradient', 'Artistic'],
    avoidElements: ['Conservative colors', 'Rigid shapes', 'Corporate feel', 'Boring typography'],
  },
  education: {
    commonElements: ['Books', 'Graduation caps', 'Trees', 'Growth symbols'],
    colorPalettes: ['Blue and orange', 'Warm colors', 'Friendly tones', 'Approachable palettes'],
    styles: ['Friendly', 'Professional', 'Trustworthy', 'Approachable'],
    avoidElements: ['Cold colors', 'Complex designs', 'Corporate symbols', 'Intimidating elements'],
  },
};

/**
 * Logo Quality Checklist
 */
export const LOGO_QUALITY_CHECKLIST = [
  {
    category: 'Scalability',
    checks: [
      'Readable at 16px (favicon size)',
      'Clear at 500px (large format)',
      'Works in print and digital',
      'Maintains quality when resized',
    ],
  },
  {
    category: 'Versatility',
    checks: [
      'Works on light backgrounds',
      'Works on dark backgrounds',
      'Readable in grayscale',
      'Functions without color',
    ],
  },
  {
    category: 'Simplicity',
    checks: [
      'Uses minimal colors (2-3 max)',
      'Has clean, readable typography',
      'Avoids unnecessary details',
      'Is memorable and distinctive',
    ],
  },
  {
    category: 'Appropriateness',
    checks: [
      'Fits the industry standards',
      'Appeals to target audience',
      'Reflects brand personality',
      'Is culturally appropriate',
    ],
  },
  {
    category: 'Technical',
    checks: [
      'Uses vector format (SVG)',
      'Has proper file organization',
      'Includes multiple variations',
      'Optimized for web use',
    ],
  },
];

/**
 * Get templates by industry
 */
export function getTemplatesByIndustry(industry: string): LogoTemplate[] {
  return LOGO_TEMPLATES.filter(template => template.industry.includes(industry));
}

/**
 * Get templates by style
 */
export function getTemplatesByStyle(style: string): LogoTemplate[] {
  return LOGO_TEMPLATES.filter(template => template.style === style);
}

/**
 * Get templates by complexity
 */
export function getTemplatesByComplexity(complexity: 'simple' | 'medium' | 'complex'): LogoTemplate[] {
  return LOGO_TEMPLATES.filter(template => template.complexity === complexity);
}

/**
 * Validate logo design against principles
 */
export function validateLogoDesign(logoConfig: any): { score: number; issues: string[]; suggestions: string[] } {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check color complexity
  const colorCount = Object.keys(logoConfig.colors).length;
  if (colorCount > 3) {
    issues.push('Too many colors used');
    suggestions.push('Reduce color palette to 2-3 colors maximum');
    score -= 15;
  }

  // Check text length for wordmarks
  if (logoConfig.type === 'wordmark' && logoConfig.name.length > 12) {
    issues.push('Company name too long for effective wordmark');
    suggestions.push('Consider using a lettermark or abbreviation');
    score -= 10;
  }

  // Check industry appropriateness
  const industryGuidelines = INDUSTRY_LOGO_GUIDELINES[logoConfig.industry as keyof typeof INDUSTRY_LOGO_GUIDELINES];
  if (industryGuidelines && !industryGuidelines.styles.includes(logoConfig.style)) {
    issues.push(`Style '${logoConfig.style}' may not be appropriate for ${logoConfig.industry} industry`);
    suggestions.push(`Consider using: ${industryGuidelines.styles.join(', ')}`);
    score -= 10;
  }

  return { score, issues, suggestions };
}