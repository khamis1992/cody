/**
 * Advanced Code Formatter and Quality Enhancement System
 * Generates clean, production-ready code with proper formatting
 */

import { DesignPreset } from '../design/presets';

export interface CodeGenerationOptions {
  preset?: DesignPreset;
  framework: 'react' | 'vue' | 'angular' | 'svelte';
  typescript: boolean;
  styling: 'tailwind' | 'styled-components' | 'css-modules' | 'emotion';
  stateManagement: 'react-state' | 'zustand' | 'redux' | 'context' | 'none';
  testing: boolean;
  accessibility: boolean;
  responsive: boolean;
  darkMode: boolean;
  animations: boolean;
  codeStyle: 'standard' | 'airbnb' | 'google' | 'prettier';
  includeComments: boolean;
  includeTypes: boolean;
  includeTests: boolean;
  modularity: 'single-file' | 'component-split' | 'feature-based';
}

export interface GeneratedCode {
  files: CodeFile[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
  config: Record<string, any>;
}

export interface CodeFile {
  path: string;
  content: string;
  type: 'component' | 'style' | 'type' | 'test' | 'config' | 'util';
  language: 'typescript' | 'javascript' | 'css' | 'json' | 'html';
}

/**
 * Enhanced Code Generator with Professional Formatting
 */
export class AdvancedCodeGenerator {
  private options: CodeGenerationOptions;

  constructor(options: CodeGenerationOptions) {
    this.options = options;
  }

  /**
   * Generate complete application code
   */
  generateApplication(components: any[], appName: string): GeneratedCode {
    const files: CodeFile[] = [];
    const dependencies: string[] = this.getBaseDependencies();
    const devDependencies: string[] = this.getDevDependencies();

    // Generate main app component
    files.push(this.generateAppComponent(components, appName));

    // Generate individual components
    components.forEach(component => {
      files.push(...this.generateComponent(component));
    });

    // Generate configuration files
    files.push(...this.generateConfigFiles());

    // Generate types if TypeScript
    if (this.options.typescript) {
      files.push(this.generateTypes());
    }

    // Generate tests if enabled
    if (this.options.testing) {
      files.push(...this.generateTests(components));
    }

    // Generate theme files
    if (this.options.preset) {
      files.push(this.generateThemeFile());
    }

    return {
      files,
      dependencies,
      devDependencies,
      scripts: this.generateScripts(),
      config: this.generateProjectConfig(),
    };
  }

  /**
   * Generate main app component
   */
  private generateAppComponent(components: any[], appName: string): CodeFile {
    const imports = this.generateImports(components);
    const stateManagement = this.generateStateManagement();
    const themeProvider = this.generateThemeProvider();
    const componentTree = this.generateComponentTree(components);

    const content = this.formatCode(`
${imports}

${this.options.includeComments ? `/**\n * ${appName} - Generated with Advanced UI Builder\n * Modern, accessible, and responsive application\n */` : ''}

${stateManagement}

${this.options.typescript ? 'export default function App(): JSX.Element {' : 'export default function App() {'}
  ${this.options.includeComments ? '// Main application component with theme provider and state management' : ''}
  return (
    ${themeProvider ? `<ThemeProvider>` : ''}
      <div className="min-h-screen bg-background text-foreground">
        ${this.options.accessibility ? `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded">Skip to main content</a>` : ''}
        <main id="main-content" className="container mx-auto">
          ${componentTree}
        </main>
      </div>
    ${themeProvider ? `</ThemeProvider>` : ''}
  );
}
    `);

    return {
      path: this.options.typescript ? 'src/App.tsx' : 'src/App.jsx',
      content,
      type: 'component',
      language: this.options.typescript ? 'typescript' : 'javascript',
    };
  }

  /**
   * Generate individual component files
   */
  private generateComponent(component: any): CodeFile[] {
    const files: CodeFile[] = [];
    const componentName = this.pascalCase(component.name || component.type);

    // Main component file
    const componentContent = this.generateComponentContent(component, componentName);
    files.push({
      path: `src/components/${componentName}/${componentName}.${this.options.typescript ? 'tsx' : 'jsx'}`,
      content: componentContent,
      type: 'component',
      language: this.options.typescript ? 'typescript' : 'javascript',
    });

    // Separate styles if using CSS modules
    if (this.options.styling === 'css-modules') {
      files.push({
        path: `src/components/${componentName}/${componentName}.module.css`,
        content: this.generateComponentStyles(component),
        type: 'style',
        language: 'css',
      });
    }

    // Types file if TypeScript and modularity is feature-based
    if (this.options.typescript && this.options.modularity === 'feature-based') {
      files.push({
        path: `src/components/${componentName}/types.ts`,
        content: this.generateComponentTypes(component),
        type: 'type',
        language: 'typescript',
      });
    }

    // Test file if testing enabled
    if (this.options.testing) {
      files.push({
        path: `src/components/${componentName}/${componentName}.test.${this.options.typescript ? 'tsx' : 'jsx'}`,
        content: this.generateComponentTest(component, componentName),
        type: 'test',
        language: this.options.typescript ? 'typescript' : 'javascript',
      });
    }

    return files;
  }

  /**
   * Generate component content with proper formatting
   */
  private generateComponentContent(component: any, componentName: string): string {
    const imports = this.generateComponentImports(component);
    const props = this.generateComponentProps(component);
    const hooks = this.generateComponentHooks(component);
    const jsx = this.generateComponentJSX(component);

    return this.formatCode(`
${imports}

${this.options.includeComments ? `/**\n * ${componentName} Component\n * ${component.description || 'Generated component with modern design patterns'}\n */` : ''}

${props}

${this.options.typescript ? `export const ${componentName} = forwardRef<HTMLDivElement, ${componentName}Props>(({` : `export const ${componentName} = forwardRef(({`}
  className,
  children,
  ...props
${this.options.typescript ? `}, ref) => {` : `}, ref) => {`}
  ${hooks}

  return (
    ${jsx}
  );
});

${componentName}.displayName = '${componentName}';

${this.options.includeComments ? `// Export for easier imports` : ''}
export default ${componentName};
    `);
  }

  /**
   * Generate TypeScript interfaces and types
   */
  private generateTypes(): CodeFile {
    const content = this.formatCode(`
${this.options.includeComments ? `/**\n * Global Type Definitions\n * Shared types and interfaces for the application\n */` : ''}

import { ReactNode, HTMLAttributes } from 'react';

${this.options.includeComments ? '// Base component props extending HTML attributes' : ''}
export interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  className?: string;
}

${this.options.includeComments ? '// Theme and styling types' : ''}
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

${this.options.includeComments ? '// Component variant types' : ''}
export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';

${this.options.includeComments ? '// State management types' : ''}
export interface AppState {
  theme: ThemeConfig;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  preferences: {
    language: string;
    notifications: boolean;
  };
}

${this.options.includeComments ? '// API response types' : ''}
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
    `);

    return {
      path: 'src/types/index.ts',
      content,
      type: 'type',
      language: 'typescript',
    };
  }

  /**
   * Generate theme configuration file
   */
  private generateThemeFile(): CodeFile {
    const preset = this.options.preset!;

    const content = this.formatCode(`
${this.options.includeComments ? `/**\n * Theme Configuration\n * Based on ${preset.name} design preset\n */` : ''}

import { ThemeConfig } from '../types';

export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    primary: '${preset.colors.primary}',
    secondary: '${preset.colors.secondary}',
    accent: '${preset.colors.accent}',
    background: '${preset.colors.background}',
    foreground: '${preset.colors.text}',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
};

export const darkTheme: ThemeConfig = {
  ...lightTheme,
  mode: 'dark',
  colors: {
    primary: '${preset.colors.primary}',
    secondary: '${preset.colors.secondary}',
    accent: '${preset.colors.accent}',
    background: '#0f172a',
    foreground: '#f8fafc',
  },
};

export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  default: lightTheme,
};

${this.options.includeComments ? '// CSS custom properties for dynamic theming' : ''}
export const generateCSSVariables = (theme: ThemeConfig) => ({
  '--color-primary': theme.colors.primary,
  '--color-secondary': theme.colors.secondary,
  '--color-accent': theme.colors.accent,
  '--color-background': theme.colors.background,
  '--color-foreground': theme.colors.foreground,
});
    `);

    return {
      path: 'src/lib/theme.ts',
      content,
      type: 'config',
      language: 'typescript',
    };
  }

  /**
   * Generate test files
   */
  private generateTests(components: any[]): CodeFile[] {
    const files: CodeFile[] = [];

    // App test
    files.push({
      path: `src/App.test.${this.options.typescript ? 'tsx' : 'jsx'}`,
      content: this.generateAppTest(),
      type: 'test',
      language: this.options.typescript ? 'typescript' : 'javascript',
    });

    return files;
  }

  /**
   * Generate configuration files
   */
  private generateConfigFiles(): CodeFile[] {
    const files: CodeFile[] = [];

    // Tailwind config
    if (this.options.styling === 'tailwind') {
      files.push({
        path: 'tailwind.config.js',
        content: this.generateTailwindConfig(),
        type: 'config',
        language: 'javascript',
      });
    }

    // TypeScript config
    if (this.options.typescript) {
      files.push({
        path: 'tsconfig.json',
        content: this.generateTSConfig(),
        type: 'config',
        language: 'json',
      });
    }

    // ESLint config
    files.push({
      path: '.eslintrc.json',
      content: this.generateESLintConfig(),
      type: 'config',
      language: 'json',
    });

    // Prettier config
    files.push({
      path: '.prettierrc',
      content: this.generatePrettierConfig(),
      type: 'config',
      language: 'json',
    });

    return files;
  }

  /**
   * Code formatting utilities
   */
  private formatCode(code: string): string {
    // Remove extra whitespace and format indentation
    return code
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => this.addProperIndentation(line))
      .join('\n');
  }

  private addProperIndentation(line: string): string {
    const indentLevel = this.calculateIndentLevel(line);
    const indent = '  '.repeat(indentLevel);
    return indent + line.trim();
  }

  private calculateIndentLevel(line: string): number {
    // Simple indentation calculation based on brackets and keywords
    let level = 0;
    if (line.includes('{') && !line.includes('}')) level++;
    if (line.includes('(') && !line.includes(')')) level++;
    if (line.startsWith('export') || line.startsWith('import')) level = 0;
    return Math.max(0, level);
  }

  /**
   * Utility methods
   */
  private pascalCase(str: string): string {
    return str.replace(/(?:^|[-_\s])(\w)/g, (_, char) => char.toUpperCase());
  }

  private camelCase(str: string): string {
    const pascal = this.pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  private getBaseDependencies(): string[] {
    const deps = ['react', 'react-dom'];

    if (this.options.styling === 'tailwind') {
      deps.push('tailwindcss', 'autoprefixer', 'postcss');
    }

    if (this.options.animations) {
      deps.push('framer-motion');
    }

    if (this.options.stateManagement === 'zustand') {
      deps.push('zustand');
    }

    return deps;
  }

  private getDevDependencies(): string[] {
    const deps = [];

    if (this.options.typescript) {
      deps.push('@types/react', '@types/react-dom', 'typescript');
    }

    if (this.options.testing) {
      deps.push('@testing-library/react', '@testing-library/jest-dom', 'vitest');
    }

    deps.push('eslint', 'prettier', '@vitejs/plugin-react');

    return deps;
  }

  private generateScripts(): Record<string, string> {
    return {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      'lint:fix': 'eslint src --ext ts,tsx --fix',
      format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"',
      'type-check': this.options.typescript ? 'tsc --noEmit' : undefined,
      test: this.options.testing ? 'vitest' : undefined,
      'test:ui': this.options.testing ? 'vitest --ui' : undefined,
    };
  }

  private generateProjectConfig(): Record<string, any> {
    return {
      name: 'generated-app',
      version: '0.1.0',
      type: 'module',
      engines: {
        node: '>=18.0.0',
      },
    };
  }

  // Additional generation methods would be implemented here...
  private generateImports(components: any[]): string { return ''; }
  private generateStateManagement(): string { return ''; }
  private generateThemeProvider(): string { return ''; }
  private generateComponentTree(components: any[]): string { return ''; }
  private generateComponentImports(component: any): string { return ''; }
  private generateComponentProps(component: any): string { return ''; }
  private generateComponentHooks(component: any): string { return ''; }
  private generateComponentJSX(component: any): string { return ''; }
  private generateComponentStyles(component: any): string { return ''; }
  private generateComponentTypes(component: any): string { return ''; }
  private generateComponentTest(component: any, name: string): string { return ''; }
  private generateAppTest(): string { return ''; }
  private generateTailwindConfig(): string { return ''; }
  private generateTSConfig(): string { return ''; }
  private generateESLintConfig(): string { return ''; }
  private generatePrettierConfig(): string { return ''; }
}

/**
 * Quick code generation function
 */
export function generateHighQualityCode(
  components: any[],
  appName: string,
  options: Partial<CodeGenerationOptions> = {}
): GeneratedCode {
  const defaultOptions: CodeGenerationOptions = {
    framework: 'react',
    typescript: true,
    styling: 'tailwind',
    stateManagement: 'react-state',
    testing: true,
    accessibility: true,
    responsive: true,
    darkMode: true,
    animations: true,
    codeStyle: 'prettier',
    includeComments: true,
    includeTypes: true,
    includeTests: false,
    modularity: 'component-split',
  };

  const generator = new AdvancedCodeGenerator({ ...defaultOptions, ...options });
  return generator.generateApplication(components, appName);
}

/**
 * Code quality checks and improvements
 */
export function enhanceCodeQuality(code: string): string {
  return code
    .replace(/\s+$/gm, '') // Remove trailing whitespace
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .replace(/;\s*;/g, ';') // Remove duplicate semicolons
    .trim();
}