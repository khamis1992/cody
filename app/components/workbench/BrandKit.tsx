import { forwardRef, useState, useCallback, type HTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoOutput } from '~/lib/logo/generator';
import { ColorPalette } from '~/lib/color/harmony';
import { PaletteLibrary } from '~/lib/color/palettes';

interface BrandKitProps extends HTMLAttributes<HTMLDivElement> {
  logo?: LogoOutput;
  palette?: ColorPalette;
  onGenerate?: (brandKit: BrandKit) => void;
}

interface BrandKit {
  id: string;
  name: string;
  logo: LogoOutput;
  palette: ColorPalette;
  typography: TypographySystem;
  iconSet: IconSet;
  templates: TemplateCollection;
  guidelines: BrandGuidelines;
  assets: AssetCollection;
}

interface TypographySystem {
  primary: {
    family: string;
    weights: string[];
    sizes: TypographySizes;
  };
  secondary: {
    family: string;
    weights: string[];
    sizes: TypographySizes;
  };
  monospace: {
    family: string;
    weights: string[];
  };
}

interface TypographySizes {
  display: { fontSize: string; lineHeight: string };
  h1: { fontSize: string; lineHeight: string };
  h2: { fontSize: string; lineHeight: string };
  h3: { fontSize: string; lineHeight: string };
  h4: { fontSize: string; lineHeight: string };
  body: { fontSize: string; lineHeight: string };
  small: { fontSize: string; lineHeight: string };
  caption: { fontSize: string; lineHeight: string };
}

interface IconSet {
  style: 'outline' | 'filled' | 'duotone';
  strokeWidth: number;
  cornerRadius: number;
  icons: string[];
}

interface TemplateCollection {
  businessCard: string;
  letterhead: string;
  presentation: string;
  socialMedia: {
    profile: string;
    cover: string;
    post: string;
    story: string;
  };
  website: {
    hero: string;
    footer: string;
  };
}

interface BrandGuidelines {
  logoUsage: {
    clearSpace: string;
    minSize: string;
    dosDonts: Array<{ do: boolean; description: string; example: string }>;
  };
  colorUsage: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    examples: string[];
  };
  typography: {
    hierarchy: string;
    pairing: string;
    examples: string[];
  };
  imagery: {
    style: string;
    treatment: string;
    examples: string[];
  };
}

interface AssetCollection {
  logos: {
    svg: string;
    png: { [size: string]: string };
    favicon: string;
  };
  colors: {
    css: string;
    scss: string;
    json: string;
    ase: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  icons: string[];
}

interface BrandKitPreviewProps {
  brandKit: BrandKit;
  activeSection: string;
}

interface TemplatePreviewProps {
  template: 'businessCard' | 'letterhead' | 'socialProfile' | 'website';
  brandKit: BrandKit;
}

// Template Preview Component
const TemplatePreview = ({ template, brandKit }: TemplatePreviewProps) => {
  const renderBusinessCard = () => (
    <div className="w-64 h-40 bg-white rounded-lg shadow-md p-4 border border-gray-200 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10"
        style={{ backgroundColor: brandKit.palette.colors[0] }}
      />

      {/* Logo */}
      <div className="mb-3">
        <div
          className="w-12 h-8"
          dangerouslySetInnerHTML={{ __html: brandKit.logo.variations.compact }}
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold" style={{ color: brandKit.palette.colors[0] }}>
          John Doe
        </h3>
        <p className="text-sm text-gray-600">Chief Executive Officer</p>
        <p className="text-xs text-gray-500">john@company.com</p>
        <p className="text-xs text-gray-500">+1 (555) 123-4567</p>
      </div>
    </div>
  );

  const renderLetterhead = () => (
    <div className="w-full h-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b-2" style={{ borderColor: brandKit.palette.colors[0] }}>
        <div
          className="w-16 h-10"
          dangerouslySetInnerHTML={{ __html: brandKit.logo.variations.horizontal }}
        />
        <div className="text-right text-sm text-gray-600">
          <p>123 Business St</p>
          <p>City, State 12345</p>
          <p>info@company.com</p>
        </div>
      </div>

      {/* Content placeholder */}
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-2 bg-gray-100 rounded w-full"></div>
        <div className="h-2 bg-gray-100 rounded w-full"></div>
        <div className="h-2 bg-gray-100 rounded w-3/4"></div>
      </div>
    </div>
  );

  const renderSocialProfile = () => (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover */}
      <div
        className="h-20 relative"
        style={{ backgroundColor: brandKit.palette.colors[1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
      </div>

      {/* Profile */}
      <div className="p-4 -mt-8 relative">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
            style={{ backgroundColor: brandKit.palette.colors[0] }}
          >
            <div
              className="w-10 h-6"
              dangerouslySetInnerHTML={{ __html: brandKit.logo.variations.iconOnly }}
            />
          </div>
          <div className="flex-1 pt-2">
            <h3 className="text-lg font-bold text-gray-900">{brandKit.name}</h3>
            <p className="text-sm text-gray-600">Professional Brand</p>
            <p className="text-xs text-gray-500 mt-1">Trusted by thousands of customers worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWebsite = () => (
    <div className="w-full h-48 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="h-12 bg-gray-50 border-b border-gray-200 px-4 flex items-center justify-between">
        <div
          className="h-6"
          dangerouslySetInnerHTML={{ __html: brandKit.logo.variations.horizontal }}
        />
        <div className="flex gap-2">
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Hero */}
      <div
        className="h-24 flex items-center justify-center text-white relative"
        style={{ background: `linear-gradient(135deg, ${brandKit.palette.colors[0]}, ${brandKit.palette.colors[1]})` }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome to {brandKit.name}</h1>
          <p className="text-sm opacity-90">Building the future together</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        <div className="h-2 bg-gray-100 rounded w-full"></div>
        <div className="h-2 bg-gray-100 rounded w-2/3"></div>
      </div>
    </div>
  );

  switch (template) {
    case 'businessCard':
      return renderBusinessCard();
    case 'letterhead':
      return renderLetterhead();
    case 'socialProfile':
      return renderSocialProfile();
    case 'website':
      return renderWebsite();
    default:
      return renderBusinessCard();
  }
};

// Brand Kit Preview Component
const BrandKitPreview = ({ brandKit, activeSection }: BrandKitPreviewProps) => {
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Brand Identity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Logo Variations</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(brandKit.logo.variations).map(([name, svg]) => (
              <div key={name} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 capitalize">{name}</div>
                <div
                  className="h-12 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Color Palette</h3>
          <div className="grid grid-cols-4 gap-2">
            {brandKit.palette.colors.map((color, index) => (
              <div key={index} className="text-center">
                <div
                  className="w-full h-16 rounded-lg border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: color }}
                />
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">{color}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Primary Font</h4>
            <div style={{ fontFamily: brandKit.typography.primary.family }}>
              <div className="text-2xl font-bold mb-1">Aa Bb Cc</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{brandKit.typography.primary.family}</div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Secondary Font</h4>
            <div style={{ fontFamily: brandKit.typography.secondary.family }}>
              <div className="text-2xl font-bold mb-1">Aa Bb Cc</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{brandKit.typography.secondary.family}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Brand Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Business Card</h4>
          <TemplatePreview template="businessCard" brandKit={brandKit} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Letterhead</h4>
          <TemplatePreview template="letterhead" brandKit={brandKit} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Social Media Profile</h4>
          <TemplatePreview template="socialProfile" brandKit={brandKit} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Website Header</h4>
          <TemplatePreview template="website" brandKit={brandKit} />
        </div>
      </div>
    </div>
  );

  const renderGuidelines = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Brand Guidelines</h3>

      {/* Logo Usage */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Logo Usage</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Clear Space</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">{brandKit.guidelines.logoUsage.clearSpace}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Size</h5>
            <p className="text-xs text-gray-600 dark:text-gray-400">{brandKit.guidelines.logoUsage.minSize}</p>
          </div>
        </div>
      </div>

      {/* Color Usage */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Color Usage</h4>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p><strong>Primary:</strong> {brandKit.guidelines.colorUsage.primary}</p>
          <p><strong>Secondary:</strong> {brandKit.guidelines.colorUsage.secondary}</p>
          <p><strong>Accent:</strong> {brandKit.guidelines.colorUsage.accent}</p>
        </div>
      </div>

      {/* Typography Guidelines */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-3">Typography</h4>
        <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
          <p><strong>Hierarchy:</strong> {brandKit.guidelines.typography.hierarchy}</p>
          <p><strong>Pairing:</strong> {brandKit.guidelines.typography.pairing}</p>
        </div>
      </div>
    </div>
  );

  switch (activeSection) {
    case 'templates':
      return renderTemplates();
    case 'guidelines':
      return renderGuidelines();
    default:
      return renderOverview();
  }
};

// Main Brand Kit Component
export const BrandKit = forwardRef<HTMLDivElement, BrandKitProps>(({
  className,
  logo,
  palette,
  onGenerate,
  ...props
}, ref) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateBrandKit = useCallback(async () => {
    if (!logo || !palette) return;

    setIsGenerating(true);
    try {
      // Create a comprehensive brand kit
      const newBrandKit: BrandKit = {
        id: `brand-kit-${Date.now()}`,
        name: logo.name,
        logo,
        palette,
        typography: {
          primary: {
            family: 'Inter, sans-serif',
            weights: ['400', '500', '600', '700'],
            sizes: {
              display: { fontSize: '3.5rem', lineHeight: '1.1' },
              h1: { fontSize: '2.5rem', lineHeight: '1.2' },
              h2: { fontSize: '2rem', lineHeight: '1.3' },
              h3: { fontSize: '1.5rem', lineHeight: '1.4' },
              h4: { fontSize: '1.25rem', lineHeight: '1.4' },
              body: { fontSize: '1rem', lineHeight: '1.6' },
              small: { fontSize: '0.875rem', lineHeight: '1.5' },
              caption: { fontSize: '0.75rem', lineHeight: '1.4' },
            },
          },
          secondary: {
            family: 'Source Sans Pro, sans-serif',
            weights: ['400', '600'],
            sizes: {
              display: { fontSize: '3rem', lineHeight: '1.1' },
              h1: { fontSize: '2.25rem', lineHeight: '1.2' },
              h2: { fontSize: '1.875rem', lineHeight: '1.3' },
              h3: { fontSize: '1.375rem', lineHeight: '1.4' },
              h4: { fontSize: '1.125rem', lineHeight: '1.4' },
              body: { fontSize: '1rem', lineHeight: '1.6' },
              small: { fontSize: '0.875rem', lineHeight: '1.5' },
              caption: { fontSize: '0.75rem', lineHeight: '1.4' },
            },
          },
          monospace: {
            family: 'JetBrains Mono, monospace',
            weights: ['400', '500'],
          },
        },
        iconSet: {
          style: 'outline',
          strokeWidth: 2,
          cornerRadius: 4,
          icons: ['home', 'user', 'settings', 'search', 'bell', 'mail', 'phone', 'calendar'],
        },
        templates: {
          businessCard: 'business-card-template',
          letterhead: 'letterhead-template',
          presentation: 'presentation-template',
          socialMedia: {
            profile: 'social-profile-template',
            cover: 'social-cover-template',
            post: 'social-post-template',
            story: 'social-story-template',
          },
          website: {
            hero: 'website-hero-template',
            footer: 'website-footer-template',
          },
        },
        guidelines: {
          logoUsage: {
            clearSpace: 'Maintain minimum clear space equal to the height of the logo symbol',
            minSize: '24px for digital, 0.5 inch for print',
            dosDonts: [
              { do: true, description: 'Use on solid backgrounds', example: 'solid-bg-example' },
              { do: false, description: 'Do not stretch or distort', example: 'distort-example' },
              { do: true, description: 'Maintain proper contrast', example: 'contrast-example' },
              { do: false, description: 'Do not place on busy backgrounds', example: 'busy-bg-example' },
            ],
          },
          colorUsage: {
            primary: 'Use for main brand elements, headers, and primary actions',
            secondary: 'Use for supporting elements and secondary actions',
            accent: 'Use sparingly for highlights and call-to-action elements',
            neutral: 'Use for body text, backgrounds, and subtle elements',
            examples: ['primary-usage', 'secondary-usage', 'accent-usage'],
          },
          typography: {
            hierarchy: 'Display > H1 > H2 > H3 > H4 > Body > Small > Caption',
            pairing: 'Primary font for headings, Secondary font for body text',
            examples: ['heading-example', 'body-example', 'caption-example'],
          },
          imagery: {
            style: 'Modern, clean photography with consistent lighting',
            treatment: 'High contrast, saturated colors that complement the brand palette',
            examples: ['hero-image', 'product-image', 'lifestyle-image'],
          },
        },
        assets: {
          logos: {
            svg: logo.svg,
            png: {
              '32': logo.files.favicon,
              '64': logo.files.png,
              '128': logo.files.png,
              '256': logo.files.png,
              '512': logo.files.png,
            },
            favicon: logo.files.favicon,
          },
          colors: {
            css: PaletteLibrary.exportPalette(palette.id, 'css'),
            scss: PaletteLibrary.exportPalette(palette.id, 'scss'),
            json: PaletteLibrary.exportPalette(palette.id, 'json'),
            ase: PaletteLibrary.exportPalette(palette.id, 'ase'),
          },
          fonts: {
            primary: 'Inter',
            secondary: 'Source Sans Pro',
          },
          icons: [],
        },
      };

      setBrandKit(newBrandKit);
      onGenerate?.(newBrandKit);
    } catch (error) {
      console.error('Failed to generate brand kit:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [logo, palette, onGenerate]);

  const sections = [
    { id: 'overview', label: 'Overview', icon: 'i-ph:eye' },
    { id: 'templates', label: 'Templates', icon: 'i-ph:layout' },
    { id: 'guidelines', label: 'Guidelines', icon: 'i-ph:book' },
  ];

  const downloadBrandKit = () => {
    if (!brandKit) return;

    const kitData = {
      ...brandKit,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(kitData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${brandKit.name}-brand-kit.json`;
    a.click();
  };

  return (
    <div
      ref={ref}
      className={classNames('flex h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden', className)}
      {...props}
    >
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Brand Kit</h2>
          {brandKit && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{brandKit.name}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={classNames(
                  'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left',
                  activeSection === section.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
              >
                <div className={classNames(section.icon, 'w-4 h-4')} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          {!brandKit ? (
            <button
              onClick={generateBrandKit}
              disabled={!logo || !palette || isGenerating}
              className={classNames(
                'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                !logo || !palette || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              )}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  Generating...
                </>
              ) : (
                <>
                  <div className="i-ph:magic-wand w-4 h-4" />
                  Generate Kit
                </>
              )}
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={downloadBrandKit}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <div className="i-ph:download w-4 h-4" />
                Download Kit
              </button>
              <button
                onClick={() => setBrandKit(null)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <div className="i-ph:arrow-clockwise w-4 h-4" />
                Regenerate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {brandKit ? (
          <div className="p-6">
            <BrandKitPreview brandKit={brandKit} activeSection={activeSection} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="i-ph:package w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Create Your Brand Kit</p>
              <p className="text-sm">Generate a logo and select colors to build your complete brand kit</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
BrandKit.displayName = 'BrandKit';

export { TemplatePreview, BrandKitPreview };