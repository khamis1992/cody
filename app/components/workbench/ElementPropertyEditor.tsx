import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ElementInfo } from './Inspector';

interface ElementPropertyEditorProps {
  elementInfo: ElementInfo | null;
  isVisible: boolean;
  onClose: () => void;
  onApplyChanges: (elementInfo: ElementInfo, changes: Record<string, string>) => void;
}

interface PropertyGroup {
  name: string;
  icon: string;
  properties: Array<{
    key: string;
    label: string;
    type: 'text' | 'color' | 'number' | 'select' | 'boolean';
    value: string;
    options?: string[];
    unit?: string;
  }>;
}

export const ElementPropertyEditor = ({
  elementInfo,
  isVisible,
  onClose,
  onApplyChanges,
}: ElementPropertyEditorProps) => {
  const [propertyGroups, setPropertyGroups] = useState<PropertyGroup[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [changes, setChanges] = useState<Record<string, string>>({});

  const organizeProperties = useCallback((styles: Record<string, string>): PropertyGroup[] => {
    const groups: PropertyGroup[] = [
      {
        name: 'Layout',
        icon: 'i-ph:layout',
        properties: [],
      },
      {
        name: 'Typography',
        icon: 'i-ph:text-aa',
        properties: [],
      },
      {
        name: 'Colors',
        icon: 'i-ph:palette',
        properties: [],
      },
      {
        name: 'Spacing',
        icon: 'i-ph:square-split-horizontal',
        properties: [],
      },
      {
        name: 'Border',
        icon: 'i-ph:square',
        properties: [],
      },
      {
        name: 'Effects',
        icon: 'i-ph:magic-wand',
        properties: [],
      },
    ];

    const propertyMapping: Record<string, number> = {
      'display': 0, 'position': 0, 'width': 0, 'height': 0, 'flex-direction': 0, 'justify-content': 0, 'align-items': 0,
      'font-size': 1, 'font-family': 1, 'font-weight': 1, 'text-align': 1, 'line-height': 1, 'letter-spacing': 1,
      'color': 2, 'background': 2, 'background-color': 2, 'background-image': 2,
      'margin': 3, 'padding': 3, 'margin-top': 3, 'margin-right': 3, 'margin-bottom': 3, 'margin-left': 3,
      'padding-top': 3, 'padding-right': 3, 'padding-bottom': 3, 'padding-left': 3,
      'border': 4, 'border-width': 4, 'border-style': 4, 'border-color': 4, 'border-radius': 4,
      'box-shadow': 5, 'opacity': 5, 'transform': 5, 'filter': 5,
    };

    Object.entries(styles).forEach(([key, value]) => {
      const groupIndex = propertyMapping[key] ?? 5;

      let type: 'text' | 'color' | 'number' | 'select' | 'boolean' = 'text';
      let options: string[] | undefined;
      let unit: string | undefined;

      // Determine property type and options
      if (key.includes('color') || key === 'background') {
        type = 'color';
      } else if (key.match(/(width|height|size|spacing|radius|margin|padding)/)) {
        type = 'number';
        unit = 'px';
      } else if (key === 'display') {
        type = 'select';
        options = ['block', 'inline', 'inline-block', 'flex', 'grid', 'none'];
      } else if (key === 'position') {
        type = 'select';
        options = ['static', 'relative', 'absolute', 'fixed', 'sticky'];
      } else if (key === 'text-align') {
        type = 'select';
        options = ['left', 'center', 'right', 'justify'];
      } else if (key === 'font-weight') {
        type = 'select';
        options = ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
      }

      groups[groupIndex].properties.push({
        key,
        label: key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        type,
        value,
        options,
        unit,
      });
    });

    return groups.filter(group => group.properties.length > 0);
  }, []);

  useEffect(() => {
    if (elementInfo?.styles) {
      setPropertyGroups(organizeProperties(elementInfo.styles));
      setChanges({});
    }
  }, [elementInfo, organizeProperties]);

  const handlePropertyChange = (key: string, value: string) => {
    setChanges(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyChanges = () => {
    if (elementInfo && Object.keys(changes).length > 0) {
      onApplyChanges(elementInfo, changes);
      setChanges({});
    }
  };

  const handleResetChanges = () => {
    setChanges({});
  };

  const renderPropertyInput = (property: any) => {
    const currentValue = changes[property.key] ?? property.value;

    switch (property.type) {
      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={currentValue.startsWith('#') ? currentValue : '#000000'}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600"
            />
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handlePropertyChange(property.key, e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Enter color value"
            />
          </div>
        );

      case 'number':
        return (
          <div className="flex">
            <input
              type="number"
              value={currentValue.replace(/[^\d.-]/g, '')}
              onChange={(e) => handlePropertyChange(property.key, e.target.value + (property.unit || ''))}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-l bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {property.unit && (
              <span className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r text-gray-700 dark:text-gray-300">
                {property.unit}
              </span>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            value={currentValue}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {property.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={currentValue === 'true'}
              onChange={(e) => handlePropertyChange(property.key, e.target.checked.toString())}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable</span>
          </label>
        );

      default:
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handlePropertyChange(property.key, e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Enter value"
          />
        );
    }
  };

  if (!elementInfo) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Property Editor Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-96 z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Element Properties
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className="i-ph:x w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate">
                {elementInfo.displayText}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                {propertyGroups.map((group, index) => (
                  <button
                    key={group.name}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === index
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className={`${group.icon} w-4 h-4`} />
                    {group.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Property List */}
            <div className="flex-1 overflow-y-auto p-4">
              {propertyGroups[activeTab] && (
                <div className="space-y-4">
                  {propertyGroups[activeTab].properties.map((property) => (
                    <div key={property.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {property.label}
                      </label>
                      {renderPropertyInput(property)}
                      {changes[property.key] && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Modified
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <button
                  onClick={handleApplyChanges}
                  disabled={Object.keys(changes).length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Apply Changes ({Object.keys(changes).length})
                </button>
                <button
                  onClick={handleResetChanges}
                  disabled={Object.keys(changes).length === 0}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};