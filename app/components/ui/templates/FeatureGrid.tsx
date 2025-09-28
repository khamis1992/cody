import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../Card';

interface Feature {
  title: string;
  description: string;
  icon?: ReactNode | string;
  image?: string;
  link?: {
    href: string;
    text: string;
  };
}

interface FeatureGridProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  description?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: 'cards' | 'minimal' | 'bordered';
  iconPosition?: 'top' | 'left';
  showImages?: boolean;
}

export const FeatureGrid = forwardRef<HTMLElement, FeatureGridProps>(({
  className,
  title,
  subtitle,
  description,
  features,
  columns = 3,
  variant = 'cards',
  iconPosition = 'top',
  showImages = false,
  ...props
}, ref) => {
  const gridClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const renderIcon = (icon: ReactNode | string) => {
    if (typeof icon === 'string') {
      return <div className={icon} />;
    }
    return icon;
  };

  const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
    const cardContent = (
      <div className={classNames(
        'h-full',
        iconPosition === 'left' ? 'flex gap-4' : 'text-center'
      )}>
        {/* Icon */}
        {feature.icon && (
          <div className={classNames(
            'flex-shrink-0',
            iconPosition === 'top'
              ? 'mb-4 flex justify-center'
              : 'mt-1',
            variant === 'minimal' ? 'text-blue-600 dark:text-blue-400' : ''
          )}>
            <div className={classNames(
              iconPosition === 'top' ? 'w-12 h-12' : 'w-8 h-8',
              'flex items-center justify-center',
              variant === 'cards' ? 'bg-blue-100 dark:bg-blue-900 rounded-lg' : ''
            )}>
              {renderIcon(feature.icon)}
            </div>
          </div>
        )}

        {/* Image */}
        {showImages && feature.image && (
          <div className="mb-4">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className={iconPosition === 'left' ? 'flex-1' : ''}>
          <h3 className={classNames(
            'font-semibold text-bolt-elements-textPrimary mb-2',
            variant === 'minimal' ? 'text-lg' : 'text-xl'
          )}>
            {feature.title}
          </h3>

          <p className="text-bolt-elements-textSecondary leading-relaxed">
            {feature.description}
          </p>

          {/* Link */}
          {feature.link && (
            <a
              href={feature.link.href}
              className="inline-flex items-center mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              {feature.link.text}
              <div className="i-ph:arrow-right ml-1 w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );

    if (variant === 'cards') {
      return (
        <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-6">
            {cardContent}
          </CardContent>
        </Card>
      );
    }

    if (variant === 'bordered') {
      return (
        <div
          key={index}
          className="p-6 border border-bolt-elements-borderColor rounded-xl hover:shadow-md transition-shadow duration-200"
        >
          {cardContent}
        </div>
      );
    }

    return (
      <div key={index} className="p-6">
        {cardContent}
      </div>
    );
  };

  return (
    <section
      ref={ref}
      className={classNames('py-16 lg:py-20', className)}
      {...props}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle || description) && (
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            {subtitle && (
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-4">
                {subtitle}
              </p>
            )}

            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-bolt-elements-textPrimary mb-6">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-lg text-bolt-elements-textSecondary leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={classNames(
          'grid gap-6 lg:gap-8',
          gridClasses[columns]
        )}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

FeatureGrid.displayName = 'FeatureGrid';

// Usage examples for code generation
export const FeatureGridExamples = {
  withCards: {
    title: "Everything you need to succeed",
    subtitle: "Features",
    description: "Our platform provides all the tools and features you need to build amazing web applications.",
    features: [
      {
        title: "AI-Powered",
        description: "Leverage the power of artificial intelligence to build faster and smarter.",
        icon: "i-ph:robot w-6 h-6",
      },
      {
        title: "Real-time Collaboration",
        description: "Work together with your team in real-time, no matter where you are.",
        icon: "i-ph:users w-6 h-6",
      },
      {
        title: "Cloud Deployment",
        description: "Deploy your applications to the cloud with just one click.",
        icon: "i-ph:cloud w-6 h-6",
      },
    ],
    variant: "cards" as const,
  },
  minimal: {
    title: "Why choose our platform?",
    features: [
      {
        title: "Fast Development",
        description: "Build applications 10x faster with our AI-powered tools.",
        icon: "i-ph:lightning w-6 h-6",
      },
      {
        title: "Secure by Default",
        description: "Enterprise-grade security built into every application.",
        icon: "i-ph:shield-check w-6 h-6",
      },
      {
        title: "Scalable Infrastructure",
        description: "Automatically scale your applications as your business grows.",
        icon: "i-ph:trending-up w-6 h-6",
      },
      {
        title: "24/7 Support",
        description: "Get help whenever you need it with our dedicated support team.",
        icon: "i-ph:headset w-6 h-6",
      },
    ],
    variant: "minimal" as const,
    columns: 2 as const,
  },
};