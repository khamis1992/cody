import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { motion } from 'framer-motion';

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glass' | 'outlined' | 'flat';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  image?: {
    src: string;
    alt: string;
    position?: 'top' | 'background';
  };
  badge?: {
    text: string;
    variant?: 'primary' | 'success' | 'warning' | 'error';
    position?: 'top-left' | 'top-right';
  };
  actions?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

interface ProductCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  price?: {
    current: number;
    original?: number;
    currency?: string;
  };
  image: string;
  rating?: {
    value: number;
    count: number;
  };
  badge?: string;
  onAddToCart?: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
}

interface UserCardProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  username?: string;
  avatar: string;
  bio?: string;
  stats?: Array<{ label: string; value: string | number }>;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
}

// Base Mobile Card Component
export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(({
  className,
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  image,
  badge,
  actions,
  header,
  footer,
  ...props
}, ref) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg border-0',
    gradient: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0',
    glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/20',
    outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-700 shadow-none',
    flat: 'bg-gray-50 dark:bg-gray-800 border-0 shadow-none',
  };

  const sizeClasses = {
    sm: 'p-3 rounded-lg',
    md: 'p-4 rounded-xl',
    lg: 'p-6 rounded-2xl',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-lg active:scale-[0.98] transition-all duration-200'
    : 'transition-shadow duration-200';

  return (
    <motion.div
      ref={ref}
      whileHover={interactive ? { y: -2 } : {}}
      className={classNames(
        'relative overflow-hidden',
        variantClasses[variant],
        sizeClasses[size],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {/* Background Image */}
      {image?.position === 'background' && (
        <div className="absolute inset-0 z-0">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className={classNames(
          'absolute z-10 px-2 py-1 rounded-full text-xs font-medium',
          badge.position === 'top-left' ? 'top-3 left-3' : 'top-3 right-3',
          badge.variant === 'primary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          badge.variant === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          badge.variant === 'warning' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
          badge.variant === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
        )}>
          {badge.text}
        </div>
      )}

      <div className="relative z-10">
        {/* Top Image */}
        {image?.position === 'top' && (
          <div className="mb-4 -mx-4 -mt-4">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-48 object-cover rounded-t-xl"
            />
          </div>
        )}

        {/* Header */}
        {header && (
          <div className="mb-4">
            {header}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </motion.div>
  );
});
MobileCard.displayName = 'MobileCard';

// Product Card Component
export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(({
  className,
  title,
  description,
  price,
  image,
  rating,
  badge,
  onAddToCart,
  onFavorite,
  isFavorited = false,
  ...props
}, ref) => {
  return (
    <MobileCard
      ref={ref}
      variant="elevated"
      interactive
      className={classNames('max-w-sm', className)}
      badge={badge ? { text: badge, variant: 'primary', position: 'top-left' } : undefined}
      {...props}
    >
      {/* Product Image */}
      <div className="relative mb-4 -mx-4 -mt-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-xl"
        />

        {/* Favorite Button */}
        <button
          onClick={onFavorite}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white transition-colors"
        >
          <div className={classNames(
            'w-5 h-5',
            isFavorited ? 'i-ph:heart-fill text-red-500' : 'i-ph:heart text-gray-600'
          )} />
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={classNames(
                    'w-4 h-4',
                    i < Math.floor(rating.value)
                      ? 'i-ph:star-fill text-yellow-400'
                      : 'i-ph:star text-gray-300'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        {price && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {price.currency || '$'}{price.current}
            </span>
            {price.original && price.original > price.current && (
              <span className="text-sm text-gray-500 line-through">
                {price.currency || '$'}{price.original}
              </span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </MobileCard>
  );
});
ProductCard.displayName = 'ProductCard';

// User Profile Card Component
export const UserCard = forwardRef<HTMLDivElement, UserCardProps>(({
  className,
  name,
  username,
  avatar,
  bio,
  stats,
  isFollowing = false,
  onFollow,
  onMessage,
  ...props
}, ref) => {
  return (
    <MobileCard
      ref={ref}
      variant="elevated"
      className={classNames('max-w-sm', className)}
      {...props}
    >
      <div className="text-center">
        {/* Avatar */}
        <div className="mb-4">
          <img
            src={avatar}
            alt={name}
            className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-gray-800"
          />
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </h3>
          {username && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{username}
            </p>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {bio}
          </p>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex justify-center gap-6 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {onFollow && (
            <button
              onClick={onFollow}
              className={classNames(
                'flex-1 py-2 rounded-lg font-medium transition-colors',
                isFollowing
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              )}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {onMessage && (
            <button
              onClick={onMessage}
              className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Message
            </button>
          )}
        </div>
      </div>
    </MobileCard>
  );
});
UserCard.displayName = 'UserCard';

// Usage Examples
export const MobileCardExamples = {
  basic: {
    children: (
      <div>
        <h3 className="font-semibold mb-2">Card Title</h3>
        <p className="text-gray-600 dark:text-gray-400">Card content goes here.</p>
      </div>
    ),
    variant: 'elevated' as const,
  },

  product: {
    title: "Wireless Headphones",
    description: "Premium quality wireless headphones with noise cancellation",
    price: { current: 99.99, original: 129.99 },
    image: "/api/placeholder/300/200",
    rating: { value: 4.5, count: 128 },
    badge: "Best Seller",
  },

  user: {
    name: "John Doe",
    username: "johndoe",
    avatar: "/api/placeholder/100/100",
    bio: "Software developer passionate about creating amazing user experiences",
    stats: [
      { label: "Posts", value: "42" },
      { label: "Followers", value: "1.2k" },
      { label: "Following", value: "180" },
    ],
  },
};