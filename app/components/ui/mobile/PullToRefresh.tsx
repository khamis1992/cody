import { forwardRef, type HTMLAttributes, type ReactNode, useState, useRef, useEffect } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, PanInfo, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

interface PullToRefreshProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  refreshThreshold?: number;
  disabled?: boolean;
  refreshingText?: string;
  pullText?: string;
  releaseText?: string;
  icon?: string;
  showIndicator?: boolean;
  loadingVariant?: 'spinner' | 'dots' | 'pulse';
}

interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onLoadMore: () => Promise<void> | void;
  hasMore?: boolean;
  loading?: boolean;
  threshold?: number;
  loadingComponent?: ReactNode;
  endMessage?: ReactNode;
}

interface RefreshIndicatorProps {
  progress: number;
  isRefreshing: boolean;
  variant?: 'spinner' | 'dots' | 'pulse';
  icon?: string;
}

// Pull to Refresh Component
export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(({
  className,
  children,
  onRefresh,
  refreshThreshold = 80,
  disabled = false,
  refreshingText = 'Refreshing...',
  pullText = 'Pull to refresh',
  releaseText = 'Release to refresh',
  icon = 'i-ph:arrow-down',
  showIndicator = true,
  loadingVariant = 'spinner',
  ...props
}, ref) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullState, setPullState] = useState<'idle' | 'pulling' | 'release' | 'refreshing'>('idle');

  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const scrollY = useMotionValue(0);

  // Transform values for animations
  const pullProgress = useTransform(y, [0, refreshThreshold], [0, 1]);
  const indicatorRotation = useTransform(y, [0, refreshThreshold], [0, 180]);
  const indicatorScale = useTransform(y, [0, refreshThreshold / 2, refreshThreshold], [0, 0.8, 1]);

  const handleDragStart = () => {
    if (disabled || isRefreshing) return;

    // Only allow pull-to-refresh when at the top of the scroll
    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;

    setPullState('pulling');
  };

  const handleDrag = (event: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;

    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;

    const dragY = Math.max(0, info.offset.y);
    y.set(dragY);

    if (dragY >= refreshThreshold) {
      setPullState('release');
    } else if (dragY > 0) {
      setPullState('pulling');
    } else {
      setPullState('idle');
    }
  };

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (disabled || isRefreshing) return;

    const dragY = Math.max(0, info.offset.y);

    if (dragY >= refreshThreshold) {
      setIsRefreshing(true);
      setPullState('refreshing');
      y.set(refreshThreshold);

      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setPullState('idle');
        y.set(0);
      }
    } else {
      setPullState('idle');
      y.set(0);
    }
  };

  const getStatusText = () => {
    switch (pullState) {
      case 'pulling':
        return pullText;
      case 'release':
        return releaseText;
      case 'refreshing':
        return refreshingText;
      default:
        return '';
    }
  };

  return (
    <div
      ref={ref}
      className={classNames('relative overflow-hidden', className)}
      {...props}
    >
      {/* Refresh Indicator */}
      <AnimatePresence>
        {showIndicator && (pullState !== 'idle' || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <RefreshIndicator
              progress={pullProgress.get()}
              isRefreshing={isRefreshing}
              variant={loadingVariant}
              icon={icon}
            />
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 mt-2"
              animate={{ opacity: pullState !== 'idle' ? 1 : 0 }}
            >
              {getStatusText()}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable Content */}
      <motion.div
        ref={containerRef}
        className="h-full overflow-auto"
        style={{ y }}
        drag={disabled ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.3, bottom: 0 }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        dragDirectionLock
      >
        {/* Spacer for indicator */}
        {showIndicator && (pullState !== 'idle' || isRefreshing) && (
          <div className="h-16" />
        )}

        {children}
      </motion.div>
    </div>
  );
});
PullToRefresh.displayName = 'PullToRefresh';

// Refresh Indicator Component
const RefreshIndicator = ({ progress, isRefreshing, variant = 'spinner', icon }: RefreshIndicatorProps) => {
  if (isRefreshing) {
    if (variant === 'dots') {
      return (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
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

    if (variant === 'pulse') {
      return (
        <motion.div
          className="w-8 h-8 bg-blue-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      );
    }

    // Default spinner
    return (
      <motion.div
        className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    );
  }

  // Pull indicator
  return (
    <motion.div
      className={classNames(
        icon,
        'w-6 h-6 text-blue-600',
        progress >= 1 ? 'text-green-600' : 'text-blue-600'
      )}
      style={{
        rotate: useTransform(() => progress * 180),
        scale: useTransform(() => 0.5 + progress * 0.5),
      }}
    />
  );
};

// Infinite Scroll Component
export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(({
  className,
  children,
  onLoadMore,
  hasMore = true,
  loading = false,
  threshold = 100,
  loadingComponent,
  endMessage,
  ...props
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        setIsLoading(true);
        try {
          await onLoadMore();
        } catch (error) {
          console.error('Load more failed:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [onLoadMore, hasMore, isLoading, threshold]);

  const defaultLoadingComponent = (
    <div className="flex items-center justify-center py-8">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full"
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
    </div>
  );

  const defaultEndMessage = (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      <div className="i-ph:check-circle w-8 h-8 mx-auto mb-2" />
      <p className="text-sm">You've reached the end!</p>
    </div>
  );

  return (
    <div
      ref={ref}
      className={classNames('h-full overflow-auto', className)}
      {...props}
    >
      <div ref={containerRef} className="h-full overflow-auto">
        {children}

        {/* Loading indicator */}
        <AnimatePresence>
          {(isLoading || loading) && hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {loadingComponent || defaultLoadingComponent}
            </motion.div>
          )}
        </AnimatePresence>

        {/* End message */}
        <AnimatePresence>
          {!hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {endMessage || defaultEndMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
InfiniteScroll.displayName = 'InfiniteScroll';

// Combined Pull-to-Refresh with Infinite Scroll
export const RefreshableList = forwardRef<HTMLDivElement, PullToRefreshProps & InfiniteScrollProps>(({
  className,
  children,
  onRefresh,
  onLoadMore,
  hasMore = true,
  loading = false,
  ...props
}, ref) => {
  return (
    <PullToRefresh
      ref={ref}
      className={className}
      onRefresh={onRefresh}
      {...props}
    >
      <InfiniteScroll
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        loading={loading}
      >
        {children}
      </InfiniteScroll>
    </PullToRefresh>
  );
});
RefreshableList.displayName = 'RefreshableList';

// Usage Examples
export const PullToRefreshExamples = {
  basicList: {
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Refreshed!');
    },
    pullText: 'Pull down to refresh',
    releaseText: 'Release to refresh',
    refreshingText: 'Updating...',
    icon: 'i-ph:arrow-clockwise',
    content: (
      <div className="space-y-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Item {i + 1}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Description for item {i + 1}
            </p>
          </div>
        ))}
      </div>
    ),
  },

  newsFeeds: {
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
    },
    onLoadMore: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
    hasMore: true,
    content: (
      <div className="space-y-6 p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <article key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <div className="i-ph:image w-12 h-12 text-gray-400" />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                News Article {i + 1}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>2 hours ago</span>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <div className="i-ph:heart w-4 h-4" />
                    <span>12</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <div className="i-ph:chat-circle w-4 h-4" />
                    <span>3</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-600">
                    <div className="i-ph:share w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    ),
  },

  socialFeed: {
    loadingVariant: 'dots' as const,
    refreshingText: 'Fetching latest posts...',
    icon: 'i-ph:refresh',
    onRefresh: async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    content: (
      <div className="space-y-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                U{i + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  User {i + 1}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @user{i + 1}
                </p>
              </div>
            </div>
            <p className="text-gray-900 dark:text-gray-100 mb-3">
              This is a sample post from user {i + 1}. It contains some interesting content that users might want to engage with.
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>1 hour ago</span>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 hover:text-red-500">
                  <div className="i-ph:heart w-4 h-4" />
                  <span>24</span>
                </button>
                <button className="flex items-center gap-1 hover:text-blue-500">
                  <div className="i-ph:chat-circle w-4 h-4" />
                  <span>8</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-500">
                  <div className="i-ph:share w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
};