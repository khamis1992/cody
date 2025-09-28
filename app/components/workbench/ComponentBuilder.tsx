import { forwardRef, type HTMLAttributes, type ReactNode, useState, useMemo } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';

// Component Library Types
interface ComponentDefinition {
  id: string;
  name: string;
  category: 'layout' | 'forms' | 'navigation' | 'data' | 'feedback' | 'mobile';
  icon: string;
  description: string;
  props: ComponentProp[];
  template: string;
  preview?: ReactNode;
}

interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'object';
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  description?: string;
  required?: boolean;
}

interface SelectedComponent {
  id: string;
  componentId: string;
  props: Record<string, any>;
  children?: SelectedComponent[];
  parentId?: string;
}

interface ComponentBuilderProps extends HTMLAttributes<HTMLDivElement> {
  onCodeGenerate?: (code: string) => void;
  initialComponents?: SelectedComponent[];
  theme?: 'light' | 'dark';
}

// Component Library Data
const COMPONENT_LIBRARY: ComponentDefinition[] = [
  // Mobile Components
  {
    id: 'mobile-card',
    name: 'Mobile Card',
    category: 'mobile',
    icon: 'i-ph:rectangle',
    description: 'Modern card component with variants and interactive states',
    props: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Elevated', value: 'elevated' },
          { label: 'Gradient', value: 'gradient' },
          { label: 'Glass', value: 'glass' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Flat', value: 'flat' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        defaultValue: 'md',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
      {
        name: 'interactive',
        type: 'boolean',
        defaultValue: false,
        description: 'Enable hover and click interactions',
      },
    ],
    template: `<MobileCard variant="{variant}" size="{size}" interactive={interactive}>
  <div>
    <h3 className="font-semibold mb-2">Card Title</h3>
    <p className="text-gray-600 dark:text-gray-400">Card content goes here.</p>
  </div>
</MobileCard>`,
  },
  {
    id: 'bottom-navigation',
    name: 'Bottom Navigation',
    category: 'mobile',
    icon: 'i-ph:navigation',
    description: 'Modern bottom navigation with ripple effects',
    props: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Glass', value: 'glass' },
          { label: 'Floating', value: 'floating' },
          { label: 'Minimal', value: 'minimal' },
        ],
      },
      {
        name: 'showLabels',
        type: 'boolean',
        defaultValue: true,
        description: 'Show text labels below icons',
      },
      {
        name: 'hasNotch',
        type: 'boolean',
        defaultValue: false,
        description: 'Add notch for floating action button',
      },
    ],
    template: `<BottomNavigation
  items={[
    { id: 'home', label: 'Home', icon: 'i-ph:house', activeIcon: 'i-ph:house-fill' },
    { id: 'search', label: 'Search', icon: 'i-ph:magnifying-glass' },
    { id: 'favorites', label: 'Favorites', icon: 'i-ph:heart', badge: 3 },
    { id: 'profile', label: 'Profile', icon: 'i-ph:user' },
  ]}
  activeItem="home"
  onItemChange={(id) => console.log('Active:', id)}
  variant="{variant}"
  showLabels={showLabels}
  hasNotch={hasNotch}
/>`,
  },
  {
    id: 'app-shell',
    name: 'App Shell',
    category: 'layout',
    icon: 'i-ph:layout',
    description: 'Complete mobile app layout structure',
    props: [
      {
        name: 'background',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Gradient', value: 'gradient' },
          { label: 'Dark', value: 'dark' },
          { label: 'Image', value: 'image' },
        ],
      },
      {
        name: 'hasBottomNav',
        type: 'boolean',
        defaultValue: true,
        description: 'Include bottom navigation',
      },
      {
        name: 'hasSafeArea',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable safe area padding',
      },
    ],
    template: `<AppShell
  background="{background}"
  hasBottomNav={hasBottomNav}
  hasSafeArea={hasSafeArea}
  header={
    <AppHeader
      title="My App"
      leftAction={{ icon: 'i-ph:list', onClick: () => {}, label: 'Menu' }}
      rightAction={{ icon: 'i-ph:bell', onClick: () => {}, label: 'Notifications' }}
    />
  }
  navigation={
    <BottomNavigation
      items={navigationItems}
      activeItem="home"
      onItemChange={(id) => setActiveTab(id)}
    />
  }
>
  {/* Your app content goes here */}
</AppShell>`,
  },
  {
    id: 'mobile-form',
    name: 'Mobile Form',
    category: 'forms',
    icon: 'i-ph:text-box',
    description: 'Mobile-optimized form inputs with validation',
    props: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Filled', value: 'filled' },
          { label: 'Outlined', value: 'outlined' },
          { label: 'Minimal', value: 'minimal' },
        ],
      },
      {
        name: 'size',
        type: 'select',
        defaultValue: 'md',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
      },
    ],
    template: `<div className="space-y-4">
  <MobileTextInput
    label="Email"
    type="email"
    placeholder="Enter your email"
    variant="{variant}"
    size="{size}"
    icon={{ left: 'i-ph:envelope' }}
    required
  />
  <MobileTextInput
    label="Password"
    type="password"
    placeholder="Enter your password"
    variant="{variant}"
    size="{size}"
    icon={{ left: 'i-ph:lock' }}
    required
  />
  <MobileCheckbox
    label="Remember me"
    description="Keep me logged in for 30 days"
  />
</div>`,
  },
  {
    id: 'gradient-background',
    name: 'Gradient Background',
    category: 'layout',
    icon: 'i-ph:gradient',
    description: 'Modern gradient backgrounds with patterns',
    props: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'aurora',
        options: [
          { label: 'Aurora', value: 'aurora' },
          { label: 'Sunset', value: 'sunset' },
          { label: 'Ocean', value: 'ocean' },
          { label: 'Cosmic', value: 'cosmic' },
          { label: 'Cyberpunk', value: 'cyberpunk' },
          { label: 'Forest', value: 'forest' },
        ],
      },
      {
        name: 'pattern',
        type: 'select',
        defaultValue: 'none',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Dots', value: 'dots' },
          { label: 'Grid', value: 'grid' },
          { label: 'Waves', value: 'waves' },
          { label: 'Mesh', value: 'mesh' },
        ],
      },
      {
        name: 'animated',
        type: 'boolean',
        defaultValue: false,
        description: 'Enable animated elements',
      },
    ],
    template: `<GradientBackground
  variant="{variant}"
  pattern="{pattern}"
  animated={animated}
  intensity="medium"
>
  {/* Your content here */}
</GradientBackground>`,
  },
  {
    id: 'loading-screen',
    name: 'Loading Screen',
    category: 'feedback',
    icon: 'i-ph:spinner',
    description: 'Beautiful loading screens and splash screens',
    props: [
      {
        name: 'variant',
        type: 'select',
        defaultValue: 'splash',
        options: [
          { label: 'Splash', value: 'splash' },
          { label: 'Minimal', value: 'minimal' },
          { label: 'Gradient', value: 'gradient' },
        ],
      },
      {
        name: 'showProgress',
        type: 'boolean',
        defaultValue: false,
        description: 'Show progress bar',
      },
    ],
    template: `<LoadingScreen
  variant="{variant}"
  logo={{
    icon: 'i-ph:rocket-launch',
    text: 'MyApp'
  }}
  message="Welcome back!"
  showProgress={showProgress}
  background="gradient"
/>`,
  },
];

// Component Builder Interface
export const ComponentBuilder = forwardRef<HTMLDivElement, ComponentBuilderProps>(({
  className,
  onCodeGenerate,
  initialComponents = [],
  theme = 'light',
  ...props
}, ref) => {
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>(initialComponents);
  const [activeComponent, setActiveComponent] = useState<SelectedComponent | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showPreview, setShowPreview] = useState(true);

  const categories = [
    { id: 'all', label: 'All', icon: 'i-ph:stack' },
    { id: 'layout', label: 'Layout', icon: 'i-ph:layout' },
    { id: 'mobile', label: 'Mobile', icon: 'i-ph:device-mobile' },
    { id: 'forms', label: 'Forms', icon: 'i-ph:text-box' },
    { id: 'navigation', label: 'Navigation', icon: 'i-ph:navigation' },
    { id: 'data', label: 'Data', icon: 'i-ph:table' },
    { id: 'feedback', label: 'Feedback', icon: 'i-ph:info' },
  ];

  const filteredComponents = useMemo(() => {
    return COMPONENT_LIBRARY.filter(component => {
      const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           component.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || component.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const addComponent = (componentDef: ComponentDefinition) => {
    const newComponent: SelectedComponent = {
      id: `${componentDef.id}-${Date.now()}`,
      componentId: componentDef.id,
      props: componentDef.props.reduce((acc, prop) => {
        acc[prop.name] = prop.defaultValue;
        return acc;
      }, {} as Record<string, any>),
    };

    setSelectedComponents(prev => [...prev, newComponent]);
    setActiveComponent(newComponent);
  };

  const updateComponentProp = (componentId: string, propName: string, value: any) => {
    setSelectedComponents(prev =>
      prev.map(comp =>
        comp.id === componentId
          ? { ...comp, props: { ...comp.props, [propName]: value } }
          : comp
      )
    );

    if (activeComponent?.id === componentId) {
      setActiveComponent(prev =>
        prev ? { ...prev, props: { ...prev.props, [propName]: value } } : null
      );
    }
  };

  const removeComponent = (componentId: string) => {
    setSelectedComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (activeComponent?.id === componentId) {
      setActiveComponent(null);
    }
  };

  const generateCode = () => {
    const imports = new Set<string>();
    const componentCode = selectedComponents.map(component => {
      const componentDef = COMPONENT_LIBRARY.find(def => def.id === component.componentId);
      if (!componentDef) return '';

      // Add import based on component category
      if (componentDef.category === 'mobile') {
        imports.add(`import { ${componentDef.name.replace(/\s+/g, '')} } from '~/components/ui/mobile';`);
      } else {
        imports.add(`import { ${componentDef.name.replace(/\s+/g, '')} } from '~/components/ui';`);
      }

      // Replace placeholders in template with actual prop values
      let code = componentDef.template;
      Object.entries(component.props).forEach(([key, value]) => {
        const placeholder = `{${key}}`;
        if (typeof value === 'string') {
          code = code.replace(placeholder, value);
        } else if (typeof value === 'boolean') {
          code = code.replace(placeholder, value.toString());
        } else {
          code = code.replace(placeholder, JSON.stringify(value));
        }
      });

      return code;
    }).join('\n\n');

    const fullCode = `${Array.from(imports).join('\n')}\n\nexport default function GeneratedComponent() {\n  return (\n    <div className="min-h-screen">\n${componentCode.split('\n').map(line => `      ${line}`).join('\n')}\n    </div>\n  );\n}`;

    onCodeGenerate?.(fullCode);
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'flex h-full bg-gray-50 dark:bg-gray-900',
        className
      )}
      {...props}
    >
      {/* Component Library Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Component Library
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <div className="i-ph:magnifying-glass w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={classNames(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <div className={classNames(category.icon, 'w-3 h-3 inline-block mr-1')} />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Component List */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2">
            {filteredComponents.map(component => (
              <motion.button
                key={component.id}
                onClick={() => addComponent(component)}
                className="w-full p-3 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-3">
                  <div className={classNames(
                    component.icon,
                    'w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'
                  )} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-900 dark:group-hover:text-blue-100">
                      {component.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {component.description}
                    </p>
                    <div className="mt-1">
                      <span className={classNames(
                        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',
                        component.category === 'mobile' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        component.category === 'layout' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        component.category === 'forms' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      )}>
                        {component.category}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={classNames(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                showPreview
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <div className="i-ph:eye w-4 h-4 inline-block mr-1" />
              Preview
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedComponents.length} component{selectedComponents.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={generateCode}
              disabled={selectedComponents.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              <div className="i-ph:code w-4 h-4 inline-block mr-1" />
              Generate Code
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 flex">
          {/* Preview Area */}
          {showPreview && (
            <div className="flex-1 p-8 overflow-auto">
              {selectedComponents.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <div className="i-ph:plus-circle w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Start Building</p>
                    <p className="text-sm">Add components from the library to get started</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {selectedComponents.map((component, index) => (
                    <motion.div
                      key={component.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={classNames(
                        'relative border-2 border-dashed rounded-lg p-4 transition-colors',
                        activeComponent?.id === component.id
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                      )}
                      onClick={() => setActiveComponent(component)}
                    >
                      {/* Component Preview */}
                      <div className="min-h-[100px] bg-white dark:bg-gray-800 rounded p-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Component #{index + 1}: {COMPONENT_LIBRARY.find(def => def.id === component.componentId)?.name}
                        </div>
                        <div className="font-mono text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded p-2">
                          {JSON.stringify(component.props, null, 2)}
                        </div>
                      </div>

                      {/* Component Actions */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveComponent(component);
                          }}
                          className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="i-ph:gear w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeComponent(component.id);
                          }}
                          className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <div className="i-ph:trash w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Properties Panel */}
          {activeComponent && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  Properties
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {COMPONENT_LIBRARY.find(def => def.id === activeComponent.componentId)?.name}
                </p>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {COMPONENT_LIBRARY.find(def => def.id === activeComponent.componentId)?.props.map(prop => (
                  <div key={prop.name} className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {prop.name}
                      {prop.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {prop.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {prop.description}
                      </p>
                    )}

                    {prop.type === 'string' && (
                      <input
                        type="text"
                        value={activeComponent.props[prop.name] || ''}
                        onChange={(e) => updateComponentProp(activeComponent.id, prop.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    )}

                    {prop.type === 'number' && (
                      <input
                        type="number"
                        value={activeComponent.props[prop.name] || 0}
                        onChange={(e) => updateComponentProp(activeComponent.id, prop.name, Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    )}

                    {prop.type === 'boolean' && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={activeComponent.props[prop.name] || false}
                          onChange={(e) => updateComponentProp(activeComponent.id, prop.name, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {prop.name}
                        </span>
                      </label>
                    )}

                    {prop.type === 'select' && prop.options && (
                      <select
                        value={activeComponent.props[prop.name] || prop.defaultValue}
                        onChange={(e) => updateComponentProp(activeComponent.id, prop.name, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        {prop.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {prop.type === 'color' && (
                      <input
                        type="color"
                        value={activeComponent.props[prop.name] || '#000000'}
                        onChange={(e) => updateComponentProp(activeComponent.id, prop.name, e.target.value)}
                        className="w-full h-10 border border-gray-200 dark:border-gray-700 rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
ComponentBuilder.displayName = 'ComponentBuilder';

// Export the component library for external use
export { COMPONENT_LIBRARY, type ComponentDefinition, type SelectedComponent };