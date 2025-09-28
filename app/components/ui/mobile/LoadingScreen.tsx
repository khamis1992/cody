import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'splash' | 'minimal' | 'gradient' | 'logo' | 'skeleton' | 'spinner';
  logo?: {
    src?: string;
    icon?: string;
    text?: string;
  };
  message?: string;
  progress?: number;
  showProgress?: boolean;
  background?: 'light' | 'dark' | 'gradient' | 'custom';
  animated?: boolean;
  duration?: number;
  onComplete?: () => void;
}

interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'card' | 'list' | 'profile' | 'article' | 'dashboard';
  count?: number;
  animated?: boolean;
}

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dots' | 'circle' | 'bars' | 'pulse' | 'bounce' | 'ripple';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'white';
}

// Loading Screen Component
export const LoadingScreen = forwardRef<HTMLDivElement, LoadingScreenProps>(({
  className,
  variant = 'splash',
  logo,
  message = 'Loading...',
  progress,
  showProgress = false,
  background = 'light',
  animated = true,
  duration = 3000,
  onComplete,
  ...props
}, ref) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (progress !== undefined) {
      setCurrentProgress(progress);
    } else if (animated) {
      const interval = setInterval(() => {
        setCurrentProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsVisible(false);
              onComplete?.();
            }, 500);
            return 100;
          }
          return prev + (100 / (duration / 100));
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [progress, animated, duration, onComplete]);

  const backgroundClasses = {
    light: 'bg-white',
    dark: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
    custom: '',
  };

  if (!isVisible) return null;

  if (variant === 'splash') {
    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={classNames(
            'fixed inset-0 z-50 flex flex-col items-center justify-center',
            backgroundClasses[background],
            className
          )}
          {...props}
        >
          {/* Logo/Icon */}
          <div className="mb-8">
            {logo?.src && (
              <motion.img
                src={logo.src}
                alt="Logo"
                className="w-24 h-24 object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
            )}
            {logo?.icon && (
              <motion.div
                className={classNames(
                  logo.icon,
                  'w-24 h-24',
                  background === 'dark' ? 'text-white' : 'text-gray-900'
                )}
                initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
              />
            )}
            {logo?.text && (
              <motion.h1
                className={classNames(
                  'text-4xl font-bold text-center',
                  background === 'dark' ? 'text-white' : 'text-gray-900'
                )}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {logo.text}
              </motion.h1>
            )}
          </div>

          {/* Loading Animation */}
          <div className="mb-6">
            <motion.div
              className={classNames(
                'flex space-x-1',
                background === 'dark' ? 'text-white' : 'text-gray-900'
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-current rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Message */}
          <motion.p
            className={classNames(
              'text-lg font-medium mb-8',
              background === 'dark' ? 'text-gray-300' : 'text-gray-600'
            )}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {message}
          </motion.p>

          {/* Progress Bar */}
          {showProgress && (
            <motion.div
              className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={classNames(
          'fixed inset-0 z-50 flex items-center justify-center',
          backgroundClasses[background],
          className
        )}
        {...props}
      >
        <div className="text-center">
          <Spinner size="lg" variant="circle" color={background === 'dark' ? 'white' : 'primary'} />
          <p className={classNames(
            'mt-4 text-sm',
            background === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            {message}
          </p>
        </div>
      </motion.div>
    );
  }

  if (variant === 'gradient') {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={classNames(
          'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600',
          className
        )}
        {...props}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 100, -100, 0],
                y: [0, -100, 100, 0],
                scale: [1, 1.2, 0.8, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white">
          {logo?.icon && (
            <motion.div
              className={classNames(logo.icon, 'w-20 h-20 mx-auto mb-6')}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          <motion.h1
            className="text-3xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {logo?.text || 'Loading'}
          </motion.h1>

          <motion.p
            className="text-lg opacity-90"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-8 bg-white rounded-full"
                animate={{
                  scaleY: [1, 2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return null;
});
LoadingScreen.displayName = 'LoadingScreen';

// Skeleton Loader Component
export const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(({
  className,
  type = 'card',
  count = 1,
  animated = true,
  ...props
}, ref) => {
  const skeletonClasses = 'bg-gray-200 dark:bg-gray-700 rounded';
  const animationClasses = animated ? 'animate-pulse' : '';

  const renderSkeletonCard = () => (
    <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
      <div className={classNames(skeletonClasses, animationClasses, 'h-48 w-full')} />
      <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-3/4')} />
      <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-1/2')} />
      <div className="flex space-x-2">
        <div className={classNames(skeletonClasses, animationClasses, 'h-8 w-20')} />
        <div className={classNames(skeletonClasses, animationClasses, 'h-8 w-16')} />
      </div>
    </div>
  );

  const renderSkeletonList = () => (
    <div className="flex items-center space-x-3 p-4">
      <div className={classNames(skeletonClasses, animationClasses, 'h-12 w-12 rounded-full')} />
      <div className="flex-1 space-y-2">
        <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-3/4')} />
        <div className={classNames(skeletonClasses, animationClasses, 'h-3 w-1/2')} />
      </div>
    </div>
  );

  const renderSkeletonProfile = () => (
    <div className="text-center p-6">
      <div className={classNames(skeletonClasses, animationClasses, 'h-24 w-24 rounded-full mx-auto mb-4')} />
      <div className={classNames(skeletonClasses, animationClasses, 'h-6 w-32 mx-auto mb-2')} />
      <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-24 mx-auto mb-4')} />
      <div className="flex justify-center space-x-4">
        <div className={classNames(skeletonClasses, animationClasses, 'h-8 w-20')} />
        <div className={classNames(skeletonClasses, animationClasses, 'h-8 w-20')} />
      </div>
    </div>
  );

  const renderSkeletonArticle = () => (
    <div className="space-y-4 p-4">
      <div className={classNames(skeletonClasses, animationClasses, 'h-6 w-3/4')} />
      <div className={classNames(skeletonClasses, animationClasses, 'h-40 w-full')} />
      <div className="space-y-2">
        <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-full')} />
        <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-full')} />
        <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-2/3')} />
      </div>
    </div>
  );

  const renderSkeletonDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className={classNames(skeletonClasses, animationClasses, 'h-4 w-20')} />
            <div className={classNames(skeletonClasses, animationClasses, 'h-6 w-6 rounded')} />
          </div>
          <div className={classNames(skeletonClasses, animationClasses, 'h-8 w-16')} />
          <div className={classNames(skeletonClasses, animationClasses, 'h-2 w-full')} />
        </div>
      ))}
    </div>
  );

  const renderSkeletonType = () => {
    switch (type) {
      case 'card': return renderSkeletonCard();
      case 'list': return renderSkeletonList();
      case 'profile': return renderSkeletonProfile();
      case 'article': return renderSkeletonArticle();
      case 'dashboard': return renderSkeletonDashboard();
      default: return renderSkeletonCard();
    }
  };

  return (
    <div
      ref={ref}
      className={classNames('space-y-4', className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {renderSkeletonType()}
        </div>
      ))}
    </div>
  );
});
SkeletonLoader.displayName = 'SkeletonLoader';

// Spinner Component
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(({
  className,
  size = 'md',
  variant = 'circle',
  color = 'primary',
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    white: 'text-white',
  };

  if (variant === 'dots') {
    return (
      <div
        ref={ref}
        className={classNames('flex space-x-1', className)}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={classNames(
              'rounded-full',
              sizeClasses[size],
              `bg-current`,
              colorClasses[color]
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div
        ref={ref}
        className={classNames('flex space-x-1 items-end', className)}
        {...props}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={classNames(
              'bg-current rounded-sm',
              size === 'sm' ? 'w-1' : size === 'md' ? 'w-1.5' : size === 'lg' ? 'w-2' : 'w-3',
              colorClasses[color]
            )}
            style={{ height: size === 'sm' ? '16px' : size === 'md' ? '24px' : size === 'lg' ? '32px' : '48px' }}
            animate={{
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <motion.div
        ref={ref}
        className={classNames(
          'rounded-full bg-current',
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        {...props}
      />
    );
  }

  if (variant === 'bounce') {
    return (
      <div
        ref={ref}
        className={classNames('flex space-x-1', className)}
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={classNames(
              'rounded-full bg-current',
              sizeClasses[size],
              colorClasses[color]
            )}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'ripple') {
    return (
      <div
        ref={ref}
        className={classNames('relative', sizeClasses[size], className)}
        {...props}
      >
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            className={classNames(
              'absolute inset-0 rounded-full border-2 border-current opacity-60',
              colorClasses[color]
            )}
            animate={{
              scale: [0, 1],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 1,
            }}
          />
        ))}
      </div>
    );
  }

  // Default circle spinner
  return (
    <div
      ref={ref}
      className={classNames(
        'animate-spin rounded-full border-2 border-transparent',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={{
        borderTopColor: 'currentColor',
        borderRightColor: 'currentColor',
      }}
      {...props}
    />
  );
});
Spinner.displayName = 'Spinner';

// Usage Examples
export const LoadingScreenExamples = {
  splash: {
    variant: 'splash' as const,
    logo: {
      icon: 'i-ph:rocket-launch',
      text: 'MyApp',
    },
    message: 'Welcome back!',
    showProgress: true,
    background: 'gradient' as const,
  },

  minimal: {
    variant: 'minimal' as const,
    message: 'Loading...',
    background: 'light' as const,
  },

  gradient: {
    variant: 'gradient' as const,
    logo: {
      icon: 'i-ph:star',
      text: 'Premium App',
    },
    message: 'Preparing your experience',
    animated: true,
  },
};