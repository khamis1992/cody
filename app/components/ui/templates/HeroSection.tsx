import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { Button } from '../Button';

interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'centered' | 'split' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'gradient' | 'solid' | 'image' | 'none';
  title: string;
  subtitle?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  image?: {
    src: string;
    alt: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'accent' | 'success';
  };
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({
  className,
  variant = 'centered',
  size = 'lg',
  background = 'gradient',
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  image,
  badge,
  ...props
}, ref) => {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800',
    solid: 'bg-white dark:bg-gray-900',
    image: 'bg-cover bg-center bg-no-repeat',
    none: '',
  };

  const sizeClasses = {
    sm: 'py-12 lg:py-16',
    md: 'py-16 lg:py-20',
    lg: 'py-20 lg:py-24',
    xl: 'py-24 lg:py-32',
  };

  const containerClasses = {
    centered: 'text-center max-w-4xl mx-auto',
    split: 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center',
    minimal: 'text-center max-w-3xl mx-auto',
  };

  const badgeVariants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    accent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <section
      ref={ref}
      className={classNames(
        'relative overflow-hidden',
        backgroundClasses[background],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {/* Background Pattern */}
      {background === 'gradient' && (
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e5e7eb" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
      )}

      <div className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={containerClasses[variant]}>
          {/* Content */}
          <div className={variant === 'split' ? 'order-2 lg:order-1' : ''}>
            {/* Badge */}
            {badge && (
              <div className="mb-6">
                <span className={classNames(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  badgeVariants[badge.variant || 'default']
                )}>
                  {badge.text}
                </span>
              </div>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h1 className={classNames(
              'font-bold text-bolt-elements-textPrimary leading-tight',
              size === 'xl' ? 'text-4xl sm:text-5xl lg:text-6xl' :
              size === 'lg' ? 'text-3xl sm:text-4xl lg:text-5xl' :
              size === 'md' ? 'text-2xl sm:text-3xl lg:text-4xl' :
              'text-xl sm:text-2xl lg:text-3xl'
            )}>
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className={classNames(
                'text-bolt-elements-textSecondary leading-relaxed mt-6',
                size === 'xl' ? 'text-lg sm:text-xl' :
                size === 'lg' ? 'text-base sm:text-lg' :
                'text-base'
              )}>
                {description}
              </p>
            )}

            {/* Actions */}
            {(primaryAction || secondaryAction) && (
              <div className={classNames(
                'mt-8 flex gap-4',
                variant === 'centered' || variant === 'minimal' ? 'justify-center' : 'justify-start',
                'flex-col sm:flex-row'
              )}>
                {primaryAction && (
                  <Button
                    onClick={primaryAction.onClick}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button
                    variant="ghost"
                    onClick={secondaryAction.onClick}
                    size="lg"
                    className="px-8 py-3 text-base font-semibold"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Image */}
          {image && variant === 'split' && (
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500 rounded-full opacity-20 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-cyan-500 rounded-full opacity-20 blur-xl" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// Usage examples for code generation
export const HeroSectionExamples = {
  centered: {
    title: "Build beautiful web apps with AI",
    subtitle: "AI-Powered Development",
    description: "Create stunning, responsive web applications in minutes with our AI-powered platform. No coding experience required.",
    primaryAction: { label: "Get Started", onClick: () => {} },
    secondaryAction: { label: "Watch Demo", onClick: () => {} },
    badge: { text: "✨ New Feature", variant: "accent" as const },
  },
  split: {
    title: "Transform your ideas into reality",
    description: "Our platform helps you build professional web applications with the power of artificial intelligence.",
    primaryAction: { label: "Start Building", onClick: () => {} },
    image: { src: "/api/placeholder/600/400", alt: "Dashboard preview" },
  },
  minimal: {
    title: "Simple. Powerful. Beautiful.",
    description: "Everything you need to create amazing web experiences.",
    primaryAction: { label: "Learn More", onClick: () => {} },
  },
};