import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind classes with clsx
 * Similar to ShadCN's cn utility but adapted for UnoCSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate responsive classes for UnoCSS
 */
export function responsive(base: string, breakpoints?: Record<string, string>) {
  if (!breakpoints) return base;

  return Object.entries(breakpoints)
    .map(([bp, value]) => `${bp}:${value}`)
    .concat(base)
    .join(' ');
}

/**
 * Generate color variant classes
 */
export function colorVariant(color: string, variant: 'solid' | 'outline' | 'ghost' | 'link' = 'solid') {
  const baseClasses = {
    solid: `bg-${color}-500 text-white hover:bg-${color}-600 active:bg-${color}-700`,
    outline: `border border-${color}-500 text-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-950`,
    ghost: `text-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-950`,
    link: `text-${color}-500 underline-offset-4 hover:underline`,
  };

  return baseClasses[variant];
}

/**
 * Generate size variant classes
 */
export function sizeVariant(size: 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return sizeClasses[size];
}

/**
 * Generate animation classes with proper timing
 */
export function animationClass(animation: 'fade' | 'slide' | 'scale' | 'bounce' = 'fade') {
  const animations = {
    fade: 'transition-opacity duration-200 ease-in-out',
    slide: 'transition-transform duration-200 ease-in-out',
    scale: 'transition-transform duration-200 ease-in-out',
    bounce: 'transition-all duration-200 ease-bounce',
  };

  return animations[animation];
}

/**
 * Generate shadow classes based on elevation
 */
export function shadowVariant(elevation: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md') {
  const shadows = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  return shadows[elevation];
}

/**
 * Generate focus ring classes
 */
export function focusRing(color: string = 'blue') {
  return `focus:outline-none focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`;
}

/**
 * Convert hex color to RGB values
 */
export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Generate CSS custom properties for a color palette
 */
export function generateColorProperties(name: string, colors: Record<string, string>) {
  return Object.entries(colors).reduce((acc, [shade, value]) => {
    acc[`--color-${name}-${shade}`] = value;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get contrast text color for a background
 */
export function getContrastColor(backgroundColor: string): 'white' | 'black' {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return 'black';

  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Format component name for display
 */
export function formatComponentName(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

/**
 * Generate random ID for components
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}