import { LogoConfig, LogoType, Industry, DesignStyle } from '../logo/types';
import { ColorPalette } from '../color/types';
import { PROFESSIONAL_PALETTES } from '../color/palettes';

export interface LogoPromptInput {
  companyName: string;
  industry?: string;
  description?: string;
  style?: string;
  colors?: string[];
  keywords?: string[];
  avoid?: string[];
}

export interface LogoPromptAnalysis {
  suggestedType: LogoType;
  suggestedIndustry: Industry;
  suggestedStyle: DesignStyle;
  suggestedPalette: ColorPalette;
  reasoning: string;
  confidence: number;
}

export class LogoPromptAnalyzer {
  private industryKeywords = {
    tech: ['technology', 'software', 'app', 'digital', 'ai', 'blockchain', 'saas', 'startup', 'innovation'],
    finance: ['bank', 'finance', 'investment', 'money', 'trading', 'crypto', 'fintech', 'insurance'],
    healthcare: ['health', 'medical', 'doctor', 'clinic', 'hospital', 'wellness', 'pharmacy', 'care'],
    retail: ['shop', 'store', 'boutique', 'fashion', 'clothing', 'ecommerce', 'marketplace'],
    food: ['restaurant', 'food', 'cafe', 'bakery', 'catering', 'culinary', 'dining'],
    education: ['school', 'university', 'learning', 'education', 'academy', 'training', 'course'],
    realestate: ['property', 'real estate', 'housing', 'construction', 'architecture'],
    creative: ['design', 'art', 'photography', 'studio', 'creative', 'agency', 'media'],
    sports: ['fitness', 'gym', 'sports', 'athletic', 'training', 'yoga', 'wellness'],
    automotive: ['car', 'auto', 'vehicle', 'transport', 'automotive', 'mechanic'],
    beauty: ['beauty', 'cosmetics', 'salon', 'spa', 'skincare', 'makeup'],
    travel: ['travel', 'tourism', 'hotel', 'vacation', 'booking', 'adventure']
  };

  private styleKeywords = {
    modern: ['modern', 'contemporary', 'sleek', 'clean', 'minimal', 'futuristic'],
    classic: ['classic', 'traditional', 'timeless', 'elegant', 'sophisticated'],
    playful: ['fun', 'playful', 'creative', 'colorful', 'energetic', 'young'],
    bold: ['bold', 'strong', 'powerful', 'dynamic', 'impactful'],
    minimal: ['minimal', 'simple', 'clean', 'geometric', 'subtle'],
    luxury: ['luxury', 'premium', 'exclusive', 'high-end', 'sophisticated'],
    organic: ['organic', 'natural', 'handmade', 'artisan', 'craft'],
    geometric: ['geometric', 'angular', 'structured', 'precise', 'architectural']
  };

  private logoTypeKeywords = {
    wordmark: ['text', 'typography', 'wordmark', 'logotype', 'custom font'],
    lettermark: ['initials', 'monogram', 'abbreviation', 'letters'],
    symbol: ['icon', 'symbol', 'mark', 'pictorial', 'graphic'],
    combination: ['logo and text', 'combined', 'integrated', 'complete'],
    emblem: ['badge', 'emblem', 'seal', 'crest', 'shield'],
    abstract: ['abstract', 'conceptual', 'unique', 'artistic', 'creative']
  };

  analyzePrompt(input: LogoPromptInput): LogoPromptAnalysis {
    const text = `${input.companyName} ${input.industry || ''} ${input.description || ''} ${input.style || ''} ${input.keywords?.join(' ') || ''}`.toLowerCase();

    const suggestedIndustry = this.detectIndustry(text);
    const suggestedStyle = this.detectStyle(text);
    const suggestedType = this.detectLogoType(text, input.companyName);
    const suggestedPalette = this.selectPalette(suggestedIndustry, suggestedStyle, input.colors);

    const confidence = this.calculateConfidence(input);
    const reasoning = this.generateReasoning(suggestedType, suggestedIndustry, suggestedStyle, suggestedPalette, input);

    return {
      suggestedType,
      suggestedIndustry,
      suggestedStyle,
      suggestedPalette,
      reasoning,
      confidence
    };
  }

  private detectIndustry(text: string): Industry {
    let bestMatch: Industry = 'tech';
    let maxScore = 0;

    for (const [industry, keywords] of Object.entries(this.industryKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = industry as Industry;
      }
    }

    return bestMatch;
  }

  private detectStyle(text: string): DesignStyle {
    let bestMatch: DesignStyle = 'modern';
    let maxScore = 0;

    for (const [style, keywords] of Object.entries(this.styleKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = style as DesignStyle;
      }
    }

    return bestMatch;
  }

  private detectLogoType(text: string, companyName: string): LogoType {
    let bestMatch: LogoType = 'combination';
    let maxScore = 0;

    for (const [type, keywords] of Object.entries(this.logoTypeKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (text.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = type as LogoType;
      }
    }

    if (companyName.split(' ').length === 1 && companyName.length <= 8) {
      return 'wordmark';
    }

    if (companyName.split(' ').length >= 2 && companyName.split(' ').every(word => word.length <= 3)) {
      return 'lettermark';
    }

    return bestMatch;
  }

  private selectPalette(industry: Industry, style: DesignStyle, colors?: string[]): ColorPalette {
    if (colors && colors.length > 0) {
      const customPalette = PROFESSIONAL_PALETTES.find(p =>
        colors.some(color => p.colors.some(c => c.toLowerCase().includes(color.toLowerCase())))
      );
      if (customPalette) return customPalette;
    }

    const industryPalettes = PROFESSIONAL_PALETTES.filter(p =>
      p.categories?.includes(industry) || p.mood === this.mapStyleToMood(style)
    );

    if (industryPalettes.length > 0) {
      return industryPalettes[0];
    }

    const stylePalettes = PROFESSIONAL_PALETTES.filter(p => p.mood === this.mapStyleToMood(style));
    if (stylePalettes.length > 0) {
      return stylePalettes[0];
    }

    return PROFESSIONAL_PALETTES[0];
  }

  private mapStyleToMood(style: DesignStyle): string {
    const moodMap: Record<DesignStyle, string> = {
      modern: 'professional',
      classic: 'sophisticated',
      playful: 'energetic',
      bold: 'confident',
      minimal: 'clean',
      luxury: 'premium',
      organic: 'natural',
      geometric: 'structured'
    };
    return moodMap[style] || 'professional';
  }

  private calculateConfidence(input: LogoPromptInput): number {
    let confidence = 0.5;

    if (input.industry) confidence += 0.2;
    if (input.description && input.description.length > 10) confidence += 0.15;
    if (input.style) confidence += 0.1;
    if (input.keywords && input.keywords.length > 0) confidence += 0.05;

    return Math.min(confidence, 1.0);
  }

  private generateReasoning(
    type: LogoType,
    industry: Industry,
    style: DesignStyle,
    palette: ColorPalette,
    input: LogoPromptInput
  ): string {
    const reasons = [];

    reasons.push(`Suggested ${type} logo type based on company name structure and industry standards.`);
    reasons.push(`Identified ${industry} industry from context and keywords.`);
    reasons.push(`Recommended ${style} design style to match brand personality.`);
    reasons.push(`Selected "${palette.name}" color palette for ${palette.mood} mood and industry alignment.`);

    if (input.keywords && input.keywords.length > 0) {
      reasons.push(`Incorporated keywords: ${input.keywords.join(', ')}.`);
    }

    return reasons.join(' ');
  }
}

export function generateLogoConfig(input: LogoPromptInput): LogoConfig {
  const analyzer = new LogoPromptAnalyzer();
  const analysis = analyzer.analyzePrompt(input);

  return {
    name: input.companyName,
    type: analysis.suggestedType,
    industry: analysis.suggestedIndustry,
    style: analysis.suggestedStyle,
    colors: analysis.suggestedPalette.colors,
    fontSize: analysis.suggestedStyle === 'minimal' ? 'large' : 'medium',
    weight: analysis.suggestedStyle === 'bold' ? 'bold' : 'normal',
    spacing: analysis.suggestedStyle === 'luxury' ? 'wide' : 'normal',
    casing: analysis.suggestedStyle === 'classic' ? 'uppercase' : 'normal'
  };
}

export const LOGO_GENERATION_PROMPTS = {
  system: `You are a professional logo designer with expertise in brand identity and visual design.
Generate modern, memorable, and appropriate logos based on user requirements.
Consider industry standards, target audience, and brand personality in your designs.
Always prioritize simplicity, scalability, and visual impact.`,

  user: (input: LogoPromptInput) => {
    const analyzer = new LogoPromptAnalyzer();
    const analysis = analyzer.analyzePrompt(input);

    return `Create a professional logo for "${input.companyName}".

Industry: ${analysis.suggestedIndustry}
Style: ${analysis.suggestedStyle}
Type: ${analysis.suggestedType}
Colors: ${analysis.suggestedPalette.colors.join(', ')}

Requirements:
- Company: ${input.companyName}
${input.industry ? `- Industry: ${input.industry}` : ''}
${input.description ? `- Description: ${input.description}` : ''}
${input.style ? `- Style preference: ${input.style}` : ''}
${input.keywords ? `- Keywords: ${input.keywords.join(', ')}` : ''}
${input.avoid ? `- Avoid: ${input.avoid.join(', ')}` : ''}

Design a ${analysis.suggestedType} logo that embodies ${analysis.suggestedStyle} aesthetics and appeals to the ${analysis.suggestedIndustry} industry.
The logo should be simple, memorable, and work well at various sizes.

Analysis: ${analysis.reasoning}
Confidence: ${(analysis.confidence * 100).toFixed(0)}%`;
  }
};