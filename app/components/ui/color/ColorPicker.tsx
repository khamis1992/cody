import { forwardRef, useState, useEffect, type HTMLAttributes } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorHarmonyGenerator, ColorPalette, type ColorHSL, type ColorRGB, type HarmonyType, type MoodType } from '~/lib/color/harmony';
import { PaletteLibrary, PALETTE_CATEGORIES } from '~/lib/color/palettes';

interface ColorPickerProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  onChange?: (color: string) => void;
  showPalettes?: boolean;
  showHarmony?: boolean;
  showAccessibility?: boolean;
  format?: 'hex' | 'rgb' | 'hsl';
  presets?: string[];
}

interface ColorSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  hue?: number;
  saturation?: number;
  type: 'hue' | 'saturation' | 'lightness' | 'alpha';
}

interface AccessibilityInfoProps {
  color: string;
  backgroundColor?: string;
}

interface PalettePreviewProps {
  palette: ColorPalette;
  onColorSelect: (color: string) => void;
  selectedColor?: string;
}

// Color Slider Component
const ColorSlider = forwardRef<HTMLDivElement, ColorSliderProps>(({
  value,
  onChange,
  min = 0,
  max = 100,
  hue = 0,
  saturation = 100,
  type,
  className,
  ...props
}, ref) => {
  const getSliderBackground = () => {
    switch (type) {
      case 'hue':
        return 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)';
      case 'saturation':
        return `linear-gradient(to right, hsl(${hue}, 0%, 50%), hsl(${hue}, 100%, 50%))`;
      case 'lightness':
        return `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`;
      case 'alpha':
        return 'linear-gradient(to right, transparent, currentColor)';
      default:
        return 'linear-gradient(to right, #000, #fff)';
    }
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={ref}
      className={classNames('relative h-4 rounded-lg overflow-hidden cursor-pointer', className)}
      style={{ background: getSliderBackground() }}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newValue = min + (x / rect.width) * (max - min);
        onChange(Math.max(min, Math.min(max, newValue)));
      }}
      {...props}
    >
      <motion.div
        className="absolute top-0 w-3 h-4 bg-white border-2 border-gray-300 rounded-sm shadow-md cursor-grab active:cursor-grabbing"
        style={{ left: `calc(${percentage}% - 6px)` }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragMomentum={false}
        onDrag={(e, info) => {
          const rect = (e.target as HTMLElement).parentElement?.getBoundingClientRect();
          if (rect) {
            const x = info.point.x - rect.left;
            const newValue = min + (x / rect.width) * (max - min);
            onChange(Math.max(min, Math.min(max, newValue)));
          }
        }}
      />
    </div>
  );
});
ColorSlider.displayName = 'ColorSlider';

// Accessibility Info Component
const AccessibilityInfo = ({ color, backgroundColor = '#FFFFFF' }: AccessibilityInfoProps) => {
  const contrastRatio = ColorHarmonyGenerator.calculateContrastRatio(color, backgroundColor);
  const isAACompliant = contrastRatio >= 4.5;
  const isAAACompliant = contrastRatio >= 7;

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Accessibility</h4>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Contrast Ratio</span>
            <span className="text-sm font-mono">{contrastRatio.toFixed(2)}:1</span>
          </div>
          <div className="space-y-1">
            <div className={classNames(
              'flex items-center text-xs',
              isAACompliant ? 'text-green-600' : 'text-red-600'
            )}>
              <div className={classNames(
                'w-2 h-2 rounded-full mr-2',
                isAACompliant ? 'bg-green-500' : 'bg-red-500'
              )} />
              WCAG AA {isAACompliant ? 'Pass' : 'Fail'}
            </div>
            <div className={classNames(
              'flex items-center text-xs',
              isAAACompliant ? 'text-green-600' : 'text-red-600'
            )}>
              <div className={classNames(
                'w-2 h-2 rounded-full mr-2',
                isAAACompliant ? 'bg-green-500' : 'bg-red-500'
              )} />
              WCAG AAA {isAAACompliant ? 'Pass' : 'Fail'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Preview</div>
          <div className="space-y-1">
            <div
              className="px-2 py-1 text-xs rounded"
              style={{ backgroundColor: color, color: backgroundColor }}
            >
              Sample Text
            </div>
            <div
              className="px-2 py-1 text-xs rounded"
              style={{ backgroundColor, color }}
            >
              Sample Text
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Palette Preview Component
const PalettePreview = ({ palette, onColorSelect, selectedColor }: PalettePreviewProps) => {
  return (
    <motion.div
      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{palette.name}</h4>
        <div className="flex items-center gap-1">
          {palette.accessibility.wcagCompliant && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="WCAG Compliant" />
          )}
          <span className="text-xs text-gray-500 capitalize">{palette.mood}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 mb-2">
        {palette.colors.map((color, index) => (
          <button
            key={index}
            className={classNames(
              'aspect-square rounded-md border-2 transition-all',
              selectedColor === color
                ? 'border-blue-500 scale-110'
                : 'border-transparent hover:border-gray-300'
            )}
            style={{ backgroundColor: color }}
            onClick={() => onColorSelect(color)}
            title={color}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {palette.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

// Main Color Picker Component
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(({
  className,
  value = '#3B82F6',
  onChange,
  showPalettes = true,
  showHarmony = true,
  showAccessibility = true,
  format = 'hex',
  presets = [],
  ...props
}, ref) => {
  const [currentColor, setCurrentColor] = useState(value);
  const [hsl, setHsl] = useState<ColorHSL>(() => ColorHarmonyGenerator.hexToHSL(value));
  const [activeTab, setActiveTab] = useState<'picker' | 'palettes' | 'harmony'>('picker');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('complementary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof PALETTE_CATEGORIES>('business');

  useEffect(() => {
    const newHex = ColorHarmonyGenerator.hslToHex(hsl);
    setCurrentColor(newHex);
    onChange?.(newHex);
  }, [hsl, onChange]);

  const updateHSL = (updates: Partial<ColorHSL>) => {
    setHsl(prev => ({ ...prev, ...updates }));
  };

  const formatColor = (color: string) => {
    switch (format) {
      case 'rgb':
        const rgb = ColorHarmonyGenerator.hexToRGB(color);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl':
        const hslColor = ColorHarmonyGenerator.hexToHSL(color);
        return `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`;
      default:
        return color;
    }
  };

  const harmonyColors = showHarmony ? ColorHarmonyGenerator.generateHarmony(currentColor, selectedHarmony, 4) : [];
  const filteredPalettes = searchQuery
    ? PaletteLibrary.searchPalettes(searchQuery)
    : PaletteLibrary.getPalettesByCategory(selectedCategory);

  const tabs = [
    { id: 'picker' as const, label: 'Color Picker', icon: 'i-ph:palette' },
    ...(showPalettes ? [{ id: 'palettes' as const, label: 'Palettes', icon: 'i-ph:swatches' }] : []),
    ...(showHarmony ? [{ id: 'harmony' as const, label: 'Harmony', icon: 'i-ph:circles-three-plus' }] : []),
  ];

  return (
    <div
      ref={ref}
      className={classNames('w-full max-w-md bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg', className)}
      {...props}
    >
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
          >
            <div className={classNames(tab.icon, 'w-4 h-4')} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'picker' && (
            <motion.div
              key="picker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Current Color Display */}
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
                  style={{ backgroundColor: currentColor }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Current Color
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {formatColor(currentColor)}
                  </div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(currentColor)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Copy color"
                >
                  <div className="i-ph:copy w-4 h-4" />
                </button>
              </div>

              {/* Color Sliders */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Hue: {Math.round(hsl.h)}°
                  </label>
                  <ColorSlider
                    type="hue"
                    value={hsl.h}
                    onChange={(h) => updateHSL({ h })}
                    min={0}
                    max={360}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Saturation: {Math.round(hsl.s)}%
                  </label>
                  <ColorSlider
                    type="saturation"
                    value={hsl.s}
                    onChange={(s) => updateHSL({ s })}
                    hue={hsl.h}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">
                    Lightness: {Math.round(hsl.l)}%
                  </label>
                  <ColorSlider
                    type="lightness"
                    value={hsl.l}
                    onChange={(l) => updateHSL({ l })}
                    hue={hsl.h}
                    saturation={hsl.s}
                  />
                </div>
              </div>

              {/* Preset Colors */}
              {presets.length > 0 && (
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">Presets</label>
                  <div className="grid grid-cols-8 gap-1">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        className="aspect-square rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: preset }}
                        onClick={() => {
                          setCurrentColor(preset);
                          setHsl(ColorHarmonyGenerator.hexToHSL(preset));
                        }}
                        title={preset}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility Info */}
              {showAccessibility && (
                <AccessibilityInfo color={currentColor} />
              )}
            </motion.div>
          )}

          {activeTab === 'palettes' && (
            <motion.div
              key="palettes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Search and Category Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <div className="i-ph:magnifying-glass w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search palettes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {!searchQuery && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(PALETTE_CATEGORIES).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key as keyof typeof PALETTE_CATEGORIES)}
                        className={classNames(
                          'px-3 py-1 text-xs font-medium rounded-lg transition-colors',
                          selectedCategory === key
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        )}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Palette Grid */}
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredPalettes.slice(0, 6).map(palette => (
                  <PalettePreview
                    key={palette.id}
                    palette={palette}
                    onColorSelect={(color) => {
                      setCurrentColor(color);
                      setHsl(ColorHarmonyGenerator.hexToHSL(color));
                      setActiveTab('picker');
                    }}
                    selectedColor={currentColor}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'harmony' && (
            <motion.div
              key="harmony"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Harmony Type Selector */}
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
                  Harmony Type
                </label>
                <select
                  value={selectedHarmony}
                  onChange={(e) => setSelectedHarmony(e.target.value as HarmonyType)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="complementary">Complementary</option>
                  <option value="analogous">Analogous</option>
                  <option value="triadic">Triadic</option>
                  <option value="split-complementary">Split Complementary</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="square">Square</option>
                  <option value="monochromatic">Monochromatic</option>
                </select>
              </div>

              {/* Harmony Colors */}
              <div>
                <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
                  Generated Colors
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {harmonyColors.map((color, index) => (
                    <button
                      key={index}
                      className="aspect-square rounded-lg border border-gray-300 hover:scale-105 transition-transform group relative"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setCurrentColor(color);
                        setHsl(ColorHarmonyGenerator.hexToHSL(color));
                        setActiveTab('picker');
                      }}
                      title={color}
                    >
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all" />
                      <div className="absolute bottom-1 left-1 right-1 text-xs text-white font-mono bg-black bg-opacity-50 rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {color}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const css = harmonyColors.map((color, i) => `--color-${i + 1}: ${color};`).join('\n');
                    navigator.clipboard.writeText(`:root {\n${css}\n}`);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Copy CSS
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(harmonyColors));
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Copy JSON
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';

export { AccessibilityInfo, PalettePreview };