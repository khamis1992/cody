import { forwardRef, useState, useCallback, type HTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoGenerator, generateLogo, type LogoConfig, type LogoOutput, LOGO_PRESETS } from '~/lib/logo/generator';
import { LOGO_TEMPLATES, getTemplatesByIndustry, getTemplatesByStyle, validateLogoDesign, type LogoTemplate } from '~/lib/logo/principles';
import { ColorPicker } from '../color/ColorPicker';
import { PaletteLibrary } from '~/lib/color/palettes';

interface LogoBuilderProps extends HTMLAttributes<HTMLDivElement> {
  onLogoGenerate?: (logo: LogoOutput) => void;
  initialConfig?: Partial<LogoConfig>;
}

interface LogoPreviewProps {
  logo: LogoOutput;
  variant?: 'primary' | 'horizontal' | 'vertical' | 'iconOnly' | 'compact';
  showVariations?: boolean;
}

interface TemplateGridProps {
  templates: LogoTemplate[];
  onTemplateSelect: (template: LogoTemplate) => void;
  selectedTemplate?: LogoTemplate;
}

interface StyleConfigPanelProps {
  config: LogoConfig;
  onConfigChange: (updates: Partial<LogoConfig>) => void;
  showColorPicker?: boolean;
}

// Logo Preview Component
const LogoPreview = ({ logo, variant = 'primary', showVariations = false }: LogoPreviewProps) => {
  const [activeVariant, setActiveVariant] = useState(variant);

  const getLogoSvg = () => {
    switch (activeVariant) {
      case 'horizontal':
        return logo.variations.horizontal;
      case 'vertical':
        return logo.variations.vertical;
      case 'iconOnly':
        return logo.variations.iconOnly;
      case 'compact':
        return logo.variations.compact;
      default:
        return logo.svg;
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <div className="flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div
          className="max-w-xs max-h-32"
          dangerouslySetInnerHTML={{ __html: getLogoSvg() }}
        />
      </div>

      {/* Variation Selector */}
      {showVariations && (
        <div className="grid grid-cols-5 gap-2">
          {[
            { key: 'primary', label: 'Primary' },
            { key: 'horizontal', label: 'Horizontal' },
            { key: 'vertical', label: 'Vertical' },
            { key: 'iconOnly', label: 'Icon Only' },
            { key: 'compact', label: 'Compact' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveVariant(key as any)}
              className={classNames(
                'p-2 text-xs rounded-lg border transition-all',
                activeVariant === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Color Variations */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(logo.colorVariations).map(([name, svg]) => (
          <div
            key={name}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">{name}</div>
            <div
              className="w-full h-12 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Template Grid Component
const TemplateGrid = ({ templates, onTemplateSelect, selectedTemplate }: TemplateGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map(template => (
        <motion.button
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className={classNames(
            'p-3 rounded-lg border-2 text-left transition-all',
            selectedTemplate?.id === template.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={classNames('w-full h-16 rounded mb-2', template.preview)} />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {template.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className={classNames(
                'px-2 py-0.5 text-xs rounded capitalize',
                template.complexity === 'simple' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                template.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              )}>
                {template.complexity}
              </span>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded capitalize">
                {template.category}
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

// Style Configuration Panel
const StyleConfigPanel = ({ config, onConfigChange, showColorPicker = false }: StyleConfigPanelProps) => {
  const [showColors, setShowColors] = useState(showColorPicker);

  const industries = ['tech', 'finance', 'healthcare', 'education', 'creative', 'ecommerce', 'food', 'fitness', 'travel', 'real-estate'] as const;
  const styles = ['minimalist', 'geometric', 'gradient', 'modern', 'vintage', 'abstract', 'playful', 'professional'] as const;
  const types = ['wordmark', 'lettermark', 'symbol', 'combination', 'emblem', 'abstract'] as const;
  const fontWeights = ['light', 'regular', 'medium', 'semibold', 'bold'] as const;

  return (
    <div className="space-y-6">
      {/* Basic Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Logo Configuration</h3>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => onConfigChange({ name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter company name"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Industry
          </label>
          <select
            value={config.industry}
            onChange={(e) => onConfigChange({ industry: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {industries.map(industry => (
              <option key={industry} value={industry} className="capitalize">
                {industry.replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Logo Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Logo Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {types.map(type => (
              <button
                key={type}
                onClick={() => onConfigChange({ type })}
                className={classNames(
                  'px-3 py-2 text-sm rounded-lg border transition-colors capitalize',
                  config.type === type
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
              <button
                key={style}
                onClick={() => onConfigChange({ style })}
                className={classNames(
                  'px-3 py-2 text-sm rounded-lg border transition-colors capitalize',
                  config.style === style
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Typography</h4>

        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Font Family
          </label>
          <select
            value={config.typography.family}
            onChange={(e) => onConfigChange({
              typography: { ...config.typography, family: e.target.value }
            })}
            className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="Inter, sans-serif">Inter (Modern)</option>
            <option value="Poppins, sans-serif">Poppins (Geometric)</option>
            <option value="Roboto, sans-serif">Roboto (Professional)</option>
            <option value="Source Sans Pro, sans-serif">Source Sans Pro (Clean)</option>
            <option value="Nunito, sans-serif">Nunito (Friendly)</option>
            <option value="Quicksand, sans-serif">Quicksand (Playful)</option>
          </select>
        </div>

        {/* Font Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Font Weight
          </label>
          <div className="grid grid-cols-5 gap-1">
            {fontWeights.map(weight => (
              <button
                key={weight}
                onClick={() => onConfigChange({
                  typography: { ...config.typography, weight }
                })}
                className={classNames(
                  'px-2 py-1 text-xs rounded border transition-colors capitalize',
                  config.typography.weight === weight
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {weight}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">Colors</h4>
          <button
            onClick={() => setShowColors(!showColors)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showColors ? 'Hide' : 'Show'} Color Picker
          </button>
        </div>

        {/* Quick Color Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Primary Color
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: config.colors.primary }}
              />
              <input
                type="text"
                value={config.colors.primary}
                onChange={(e) => onConfigChange({
                  colors: { ...config.colors, primary: e.target.value }
                })}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Secondary Color
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: config.colors.secondary || '#6366F1' }}
              />
              <input
                type="text"
                value={config.colors.secondary || ''}
                onChange={(e) => onConfigChange({
                  colors: { ...config.colors, secondary: e.target.value }
                })}
                className="flex-1 px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono"
                placeholder="#6366F1"
              />
            </div>
          </div>
        </div>

        {/* Color Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Industry Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(LOGO_PRESETS).map(([industry, preset]) => (
              <button
                key={industry}
                onClick={() => onConfigChange({
                  colors: preset.colors,
                  style: preset.style,
                  typography: preset.typography,
                })}
                className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex gap-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: preset.colors.primary }}
                  />
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: preset.colors.secondary }}
                  />
                </div>
                <span className="text-xs capitalize">{industry}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <AnimatePresence>
          {showColors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <ColorPicker
                value={config.colors.primary}
                onChange={(color) => onConfigChange({
                  colors: { ...config.colors, primary: color }
                })}
                showPalettes={true}
                showHarmony={true}
                showAccessibility={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Main Logo Builder Component
export const LogoBuilder = forwardRef<HTMLDivElement, LogoBuilderProps>(({
  className,
  onLogoGenerate,
  initialConfig,
  ...props
}, ref) => {
  const [activeTab, setActiveTab] = useState<'config' | 'templates' | 'preview'>('config');
  const [logoConfig, setLogoConfig] = useState<LogoConfig>({
    name: 'Your Company',
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
    ...initialConfig,
  });

  const [currentLogo, setCurrentLogo] = useState<LogoOutput | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LogoTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCurrentLogo = useCallback(async () => {
    setIsGenerating(true);
    try {
      const logo = generateLogo(logoConfig);
      setCurrentLogo(logo);
      onLogoGenerate?.(logo);
    } catch (error) {
      console.error('Failed to generate logo:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [logoConfig, onLogoGenerate]);

  const handleConfigChange = (updates: Partial<LogoConfig>) => {
    setLogoConfig(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (template: LogoTemplate) => {
    setSelectedTemplate(template);
    // Apply template configuration
    handleConfigChange({
      type: template.category,
      style: template.style,
    });
  };

  const availableTemplates = getTemplatesByIndustry(logoConfig.industry);
  const validation = validateLogoDesign(logoConfig);

  const tabs = [
    { id: 'config' as const, label: 'Configure', icon: 'i-ph:gear' },
    { id: 'templates' as const, label: 'Templates', icon: 'i-ph:layout' },
    { id: 'preview' as const, label: 'Preview', icon: 'i-ph:eye' },
  ];

  return (
    <div
      ref={ref}
      className={classNames('flex h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden', className)}
      {...props}
    >
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={classNames(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
            >
              <div className={classNames(tab.icon, 'w-4 h-4')} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'config' && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StyleConfigPanel
                  config={logoConfig}
                  onConfigChange={handleConfigChange}
                />
              </motion.div>
            )}

            {activeTab === 'templates' && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    {logoConfig.industry.charAt(0).toUpperCase() + logoConfig.industry.slice(1)} Templates
                  </h3>
                  <TemplateGrid
                    templates={availableTemplates}
                    onTemplateSelect={handleTemplateSelect}
                    selectedTemplate={selectedTemplate}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'preview' && currentLogo && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Logo Variations
                </h3>
                <LogoPreview logo={currentLogo} showVariations={true} />

                {/* Export Options */}
                <div className="space-y-2">
                  <h4 className="text-md font-medium text-gray-900 dark:text-gray-100">
                    Export
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        const blob = new Blob([currentLogo.svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${logoConfig.name}-logo.svg`;
                        a.click();
                      }}
                      className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Download SVG
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentLogo.svg)}
                      className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Copy SVG
                    </button>
                  </div>
                </div>

                {/* Quality Score */}
                {validation.score < 100 && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="i-ph:warning w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Quality Score: {validation.score}/100
                      </span>
                    </div>
                    {validation.suggestions.map((suggestion, index) => (
                      <p key={index} className="text-xs text-yellow-700 dark:text-yellow-300">
                        • {suggestion}
                      </p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Generate Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={generateCurrentLogo}
            disabled={isGenerating}
            className={classNames(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
              isGenerating
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
                <div className="i-ph:magic-wand w-5 h-5" />
                Generate Logo
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {currentLogo ? (
          <div className="w-full max-w-2xl">
            <LogoPreview logo={currentLogo} showVariations={false} />
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="i-ph:palette w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Create Your Logo</p>
            <p className="text-sm">Configure your logo settings and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
});
LogoBuilder.displayName = 'LogoBuilder';

export { LogoPreview, TemplateGrid, StyleConfigPanel };