import { forwardRef, type HTMLAttributes, type ReactNode, useState } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  activeIcon?: string;
  badge?: number | string;
  href?: string;
  onClick?: () => void;
}

interface BottomNavigationProps extends HTMLAttributes<HTMLDivElement> {
  items: NavigationItem[];
  activeItem: string;
  onItemChange: (itemId: string) => void;
  variant?: 'default' | 'glass' | 'floating' | 'minimal';
  showLabels?: boolean;
  hasNotch?: boolean;
}

interface FloatingActionButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'gradient';
  position?: 'center' | 'right';
  children?: ReactNode;
  badge?: number | string;
}

// Modern Floating Action Button
export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(({
  className,
  icon,
  size = 'md',
  variant = 'primary',
  position = 'center',
  children,
  badge,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 shadow-lg hover:shadow-xl border border-gray-200',
    gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl',
  };

  const positionClasses = {
    center: 'fixed bottom-20 left-1/2 transform -translate-x-1/2',
    right: 'fixed bottom-20 right-6',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={classNames(
        'relative rounded-full flex items-center justify-center transition-all duration-200 z-30',
        sizeClasses[size],
        variantClasses[variant],
        positionClasses[position],
        className
      )}
      {...props}
    >
      <div className={classNames(icon, iconSizes[size])} />

      {/* Badge */}
      {badge && (
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
          {badge}
        </div>
      )}

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity" />
    </motion.button>
  );
});
FloatingActionButton.displayName = 'FloatingActionButton';

// Modern Bottom Navigation
export const BottomNavigation = forwardRef<HTMLDivElement, BottomNavigationProps>(({
  className,
  items,
  activeItem,
  onItemChange,
  variant = 'default',
  showLabels = true,
  hasNotch = false,
  ...props
}, ref) => {
  const [ripples, setRipples] = useState<{ [key: string]: boolean }>({});

  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800',
    glass: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-800/50',
    floating: 'bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl',
    minimal: 'bg-transparent',
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      window.location.href = item.href;
    }
    onItemChange(item.id);

    // Ripple effect
    setRipples(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setRipples(prev => ({ ...prev, [item.id]: false }));
    }, 600);
  };

  const NavigationItem = ({ item }: { item: NavigationItem }) => {
    const isActive = activeItem === item.id;
    const hasRipple = ripples[item.id];

    return (
      <button
        onClick={() => handleItemClick(item)}
        className={classNames(
          'relative flex flex-col items-center justify-center min-h-[64px] px-3 py-2 transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        )}
      >
        {/* Icon Container */}
        <div className="relative flex items-center justify-center">
          {/* Active indicator background */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-full w-8 h-8"
              />
            )}
          </AnimatePresence>

          {/* Icon */}
          <div className={classNames(
            (isActive && item.activeIcon) ? item.activeIcon : item.icon,
            'w-6 h-6 relative z-10 transition-transform duration-200',
            isActive ? 'scale-110' : ''
          )} />

          {/* Badge */}
          {item.badge && (
            <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
              {item.badge}
            </div>
          )}
        </div>

        {/* Label */}
        {showLabels && (
          <motion.span
            animate={{
              fontSize: isActive ? '0.75rem' : '0.6875rem',
              fontWeight: isActive ? '600' : '400',
            }}
            className="mt-1 text-center leading-tight"
          >
            {item.label}
          </motion.span>
        )}

        {/* Ripple effect */}
        <AnimatePresence>
          {hasRipple && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-blue-400 rounded-full"
            />
          )}
        </AnimatePresence>
      </button>
    );
  };

  return (
    <div
      ref={ref}
      className={classNames(
        'flex items-center justify-around relative z-20',
        variantClasses[variant],
        hasNotch ? 'px-8' : 'px-2',
        className
      )}
      {...props}
    >
      {/* Notch for FAB */}
      {hasNotch && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-8 bg-white dark:bg-gray-900 rounded-b-full" />
        </div>
      )}

      {items.map((item, index) => (
        <div key={item.id} className="flex-1 max-w-[100px]">
          {/* Create space for FAB in center */}
          {hasNotch && index === Math.floor(items.length / 2) && (
            <div className="w-16" />
          )}
          <NavigationItem item={item} />
        </div>
      ))}
    </div>
  );
});
BottomNavigation.displayName = 'BottomNavigation';

// Usage Examples
export const BottomNavigationExamples = {
  basic: {
    items: [
      { id: 'home', label: 'Home', icon: 'i-ph:house', activeIcon: 'i-ph:house-fill' },
      { id: 'search', label: 'Search', icon: 'i-ph:magnifying-glass', activeIcon: 'i-ph:magnifying-glass-bold' },
      { id: 'favorites', label: 'Favorites', icon: 'i-ph:heart', activeIcon: 'i-ph:heart-fill', badge: 3 },
      { id: 'profile', label: 'Profile', icon: 'i-ph:user', activeIcon: 'i-ph:user-fill' },
    ],
    activeItem: 'home',
    onItemChange: (id: string) => console.log('Active item:', id),
  },

  withFAB: {
    items: [
      { id: 'home', label: 'Home', icon: 'i-ph:house' },
      { id: 'search', label: 'Search', icon: 'i-ph:magnifying-glass' },
      { id: 'notifications', label: 'Alerts', icon: 'i-ph:bell', badge: '5+' },
      { id: 'profile', label: 'Profile', icon: 'i-ph:user' },
    ],
    activeItem: 'home',
    hasNotch: true,
    variant: 'glass' as const,
  },

  minimal: {
    items: [
      { id: 'home', label: 'Home', icon: 'i-ph:house' },
      { id: 'chat', label: 'Chat', icon: 'i-ph:chat' },
      { id: 'calendar', label: 'Calendar', icon: 'i-ph:calendar' },
      { id: 'settings', label: 'Settings', icon: 'i-ph:gear' },
    ],
    activeItem: 'home',
    variant: 'minimal' as const,
    showLabels: false,
  },
};