import { forwardRef, type ReactNode, type HTMLAttributes, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { AnimatePresence, motion } from 'framer-motion';

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  navigation?: ReactNode;
  statusBar?: ReactNode;
  background?: 'default' | 'gradient' | 'dark' | 'image';
  hasBottomNav?: boolean;
  hasSafeArea?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

interface StatusBarProps {
  variant?: 'light' | 'dark';
  showTime?: boolean;
  showBattery?: boolean;
  showSignal?: boolean;
}

interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  leftAction?: {
    icon: string;
    onClick: () => void;
    label?: string;
  };
  rightAction?: {
    icon: string;
    onClick: () => void;
    label?: string;
  };
  variant?: 'default' | 'transparent' | 'blur';
  showBackButton?: boolean;
  onBack?: () => void;
}

// Modern Status Bar Component
export const StatusBar = forwardRef<HTMLDivElement, StatusBarProps>(({
  variant = 'dark',
  showTime = true,
  showBattery = true,
  showSignal = true,
}, ref) => {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center justify-between px-6 py-2 text-sm font-medium',
        variant === 'light' ? 'text-gray-900' : 'text-white'
      )}
    >
      {/* Left side - Time */}
      <div className="flex items-center">
        {showTime && (
          <span className="font-mono">{timeString}</span>
        )}
      </div>

      {/* Right side - Status indicators */}
      <div className="flex items-center gap-1">
        {showSignal && (
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-2 bg-current rounded-full opacity-100" />
            <div className="w-1 h-3 bg-current rounded-full opacity-100" />
            <div className="w-1 h-4 bg-current rounded-full opacity-75" />
            <div className="w-1 h-5 bg-current rounded-full opacity-50" />
          </div>
        )}

        <div className="i-ph:wifi w-4 h-4 ml-1" />

        {showBattery && (
          <div className="flex items-center ml-1">
            <div className="relative w-6 h-3">
              <div className="absolute inset-0 border border-current rounded-sm" />
              <div className="absolute right-0 top-1 w-0.5 h-1 bg-current rounded-r" />
              <div className="absolute inset-0.5 bg-current rounded-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
StatusBar.displayName = 'StatusBar';

// Modern App Header Component
export const AppHeader = forwardRef<HTMLDivElement, HeaderProps>(({
  className,
  title,
  leftAction,
  rightAction,
  variant = 'default',
  showBackButton = false,
  onBack,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800',
    transparent: 'bg-transparent',
    blur: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50',
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center justify-between px-4 py-3 relative z-10',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {/* Left Action */}
      <div className="flex items-center min-w-[44px]">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Go back"
          >
            <div className="i-ph:arrow-left w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}
        {leftAction && (
          <button
            onClick={leftAction.onClick}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={leftAction.label}
          >
            <div className={classNames(leftAction.icon, 'w-6 h-6 text-gray-700 dark:text-gray-300')} />
          </button>
        )}
      </div>

      {/* Title */}
      {title && (
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center flex-1 truncate">
          {title}
        </h1>
      )}

      {/* Right Action */}
      <div className="flex items-center min-w-[44px] justify-end">
        {rightAction && (
          <button
            onClick={rightAction.onClick}
            className="flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={rightAction.label}
          >
            <div className={classNames(rightAction.icon, 'w-6 h-6 text-gray-700 dark:text-gray-300')} />
          </button>
        )}
      </div>
    </div>
  );
});
AppHeader.displayName = 'AppHeader';

// Main App Shell Component
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(({
  className,
  children,
  header,
  footer,
  navigation,
  statusBar,
  background = 'default',
  hasBottomNav = false,
  hasSafeArea = true,
  theme = 'auto',
  ...props
}, ref) => {
  const backgroundClasses = {
    default: 'bg-gray-50 dark:bg-gray-900',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900',
    dark: 'bg-gray-900',
    image: 'bg-cover bg-center bg-no-repeat',
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'flex flex-col min-h-screen overflow-hidden',
        backgroundClasses[background],
        hasSafeArea ? 'safe-area-inset' : '',
        className
      )}
      data-theme={theme}
      {...props}
    >
      {/* Status Bar */}
      {statusBar || (
        <StatusBar variant={background === 'dark' ? 'dark' : 'light'} />
      )}

      {/* Header */}
      {header && (
        <div className="flex-shrink-0">
          {header}
        </div>
      )}

      {/* Main Content */}
      <main className={classNames(
        'flex-1 overflow-auto',
        hasBottomNav ? 'mb-16' : ''
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {navigation && hasBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-20">
          {navigation}
        </div>
      )}

      {/* Footer */}
      {footer && !hasBottomNav && (
        <div className="flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  );
});
AppShell.displayName = 'AppShell';

// Usage Examples
export const AppShellExamples = {
  basic: {
    header: (
      <AppHeader
        title="My App"
        leftAction={{ icon: 'i-ph:list', onClick: () => {}, label: 'Menu' }}
        rightAction={{ icon: 'i-ph:bell', onClick: () => {}, label: 'Notifications' }}
      />
    ),
    hasBottomNav: true,
    hasSafeArea: true,
  },

  withBackButton: {
    header: (
      <AppHeader
        title="Profile"
        showBackButton
        onBack={() => window.history.back()}
        rightAction={{ icon: 'i-ph:dots-three', onClick: () => {}, label: 'More' }}
      />
    ),
    background: 'gradient' as const,
  },

  transparent: {
    header: (
      <AppHeader
        variant="transparent"
        leftAction={{ icon: 'i-ph:x', onClick: () => {}, label: 'Close' }}
        rightAction={{ icon: 'i-ph:check', onClick: () => {}, label: 'Save' }}
      />
    ),
    background: 'image' as const,
  },
};