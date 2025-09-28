import { forwardRef, type HTMLAttributes, type ReactNode, useState, useRef } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';

interface SwipeAction {
  id: string;
  label: string;
  icon: string;
  color: 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'gray';
  onClick: () => void;
}

interface SwipeableCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  variant?: 'default' | 'elevated' | 'minimal' | 'glass';
  swipeThreshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  dismissible?: boolean;
  snapBack?: boolean;
  disabled?: boolean;
}

interface DraggableListItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  index: number;
  dragHandle?: boolean;
}

interface CardStackProps extends HTMLAttributes<HTMLDivElement> {
  cards: Array<{
    id: string;
    content: ReactNode;
  }>;
  onSwipe?: (cardId: string, direction: 'left' | 'right') => void;
  onStackEmpty?: () => void;
  maxVisible?: number;
  stackOffset?: number;
}

// Swipeable Card Component
export const SwipeableCard = forwardRef<HTMLDivElement, SwipeableCardProps>(({
  className,
  children,
  leftActions = [],
  rightActions = [],
  variant = 'default',
  swipeThreshold = 100,
  onSwipeLeft,
  onSwipeRight,
  dismissible = false,
  snapBack = true,
  disabled = false,
  ...props
}, ref) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const x = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // Transform values for animations
  const leftActionOpacity = useTransform(x, [0, swipeThreshold], [0, 1]);
  const rightActionOpacity = useTransform(x, [0, -swipeThreshold], [0, 1]);
  const cardRotation = useTransform(x, [-200, 200], [-5, 5]);
  const cardScale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  const variantClasses = {
    default: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm',
    elevated: 'bg-white dark:bg-gray-900 shadow-lg border-0',
    minimal: 'bg-transparent border border-gray-200 dark:border-gray-700',
    glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-white/20 dark:border-gray-700/20',
  };

  const actionColorClasses = {
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
    blue: 'bg-blue-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
    gray: 'bg-gray-500 text-white',
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
      if (offset > 0) {
        // Swiped right
        if (dismissible) {
          setIsDismissed(true);
        }
        onSwipeRight?.();
      } else {
        // Swiped left
        if (dismissible) {
          setIsDismissed(true);
        }
        onSwipeLeft?.();
      }
    } else if (snapBack) {
      x.set(0);
    }
  };

  const executeAction = (action: SwipeAction) => {
    action.onClick();
    x.set(0);
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div className={classNames('relative overflow-hidden', className)} ref={ref} {...props}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center z-10"
          style={{ opacity: leftActionOpacity }}
        >
          {leftActions.map((action, index) => (
            <motion.button
              key={action.id}
              className={classNames(
                'h-full px-6 flex flex-col items-center justify-center gap-1 transition-transform duration-200',
                actionColorClasses[action.color]
              )}
              style={{
                x: useTransform(x, [0, swipeThreshold * 2], [-100, 0]),
              }}
              onClick={() => executeAction(action)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={classNames(action.icon, 'w-6 h-6')} />
              <span className="text-xs font-medium">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <motion.div
          className="absolute inset-y-0 right-0 flex items-center z-10"
          style={{ opacity: rightActionOpacity }}
        >
          {rightActions.map((action, index) => (
            <motion.button
              key={action.id}
              className={classNames(
                'h-full px-6 flex flex-col items-center justify-center gap-1 transition-transform duration-200',
                actionColorClasses[action.color]
              )}
              style={{
                x: useTransform(x, [0, -swipeThreshold * 2], [100, 0]),
              }}
              onClick={() => executeAction(action)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={classNames(action.icon, 'w-6 h-6')} />
              <span className="text-xs font-medium">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Main Card */}
      <motion.div
        ref={cardRef}
        className={classNames(
          'relative z-20 rounded-xl p-4 cursor-grab active:cursor-grabbing',
          variantClasses[variant]
        )}
        style={{
          x,
          rotate: cardRotation,
          scale: cardScale,
        }}
        drag={disabled ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        whileDrag={{ cursor: 'grabbing' }}
        dragDirectionLock
      >
        {children}

        {/* Swipe Indicators */}
        <motion.div
          className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none"
          style={{ opacity: leftActionOpacity }}
        >
          <div className="text-green-500">
            <div className="i-ph:arrow-right w-8 h-8" />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none"
          style={{ opacity: rightActionOpacity }}
        >
          <div className="text-red-500">
            <div className="i-ph:arrow-left w-8 h-8" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});
SwipeableCard.displayName = 'SwipeableCard';

// Draggable List Item Component
export const DraggableListItem = forwardRef<HTMLDivElement, DraggableListItemProps>(({
  className,
  children,
  onReorder,
  index,
  dragHandle = false,
  ...props
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const y = useMotionValue(0);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    // Simplified reordering logic - in a real app, you'd implement proper drag-to-reorder
    const offset = info.offset.y;
    if (Math.abs(offset) > 50) {
      const direction = offset > 0 ? 1 : -1;
      onReorder?.(index, index + direction);
    }
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={classNames(
        'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl transition-shadow duration-200',
        isDragging ? 'shadow-xl z-10' : 'shadow-sm',
        className
      )}
      style={{ y }}
      drag={dragHandle ? false : 'y'}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
      {...props}
    >
      <div className="flex items-center p-4">
        {dragHandle && (
          <motion.div
            className="mr-3 cursor-grab active:cursor-grabbing text-gray-400"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="i-ph:dots-six w-5 h-5" />
          </motion.div>
        )}

        <div className="flex-1">
          {children}
        </div>
      </div>
    </motion.div>
  );
});
DraggableListItem.displayName = 'DraggableListItem';

// Card Stack Component (like Tinder-style cards)
export const CardStack = forwardRef<HTMLDivElement, CardStackProps>(({
  className,
  cards,
  onSwipe,
  onStackEmpty,
  maxVisible = 3,
  stackOffset = 10,
  ...props
}, ref) => {
  const [visibleCards, setVisibleCards] = useState(cards.slice(0, maxVisible));
  const [removedCards, setRemovedCards] = useState<string[]>([]);

  const handleCardSwipe = (cardId: string, direction: 'left' | 'right') => {
    setRemovedCards(prev => [...prev, cardId]);
    setVisibleCards(prev => {
      const newCards = prev.filter(card => card.id !== cardId);

      // Add next card if available
      const nextIndex = cards.findIndex(card => card.id === cardId) + maxVisible;
      if (nextIndex < cards.length) {
        newCards.push(cards[nextIndex]);
      }

      if (newCards.length === 0) {
        onStackEmpty?.();
      }

      return newCards;
    });

    onSwipe?.(cardId, direction);
  };

  return (
    <div
      ref={ref}
      className={classNames('relative w-full h-96', className)}
      {...props}
    >
      {visibleCards.map((card, index) => {
        const isTop = index === visibleCards.length - 1;
        const zIndex = maxVisible - index;
        const scale = 1 - (visibleCards.length - 1 - index) * 0.05;
        const yOffset = (visibleCards.length - 1 - index) * stackOffset;

        return (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            style={{
              zIndex,
              scale: isTop ? 1 : scale,
              y: isTop ? 0 : yOffset,
            }}
            animate={{
              scale: isTop ? 1 : scale,
              y: isTop ? 0 : yOffset,
            }}
            transition={{ duration: 0.3 }}
          >
            <SwipeableCard
              variant="elevated"
              className="w-full h-full"
              onSwipeLeft={() => handleCardSwipe(card.id, 'left')}
              onSwipeRight={() => handleCardSwipe(card.id, 'right')}
              dismissible
              disabled={!isTop}
            >
              {card.content}
            </SwipeableCard>
          </motion.div>
        );
      })}

      {visibleCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="i-ph:stack w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No more cards</p>
            <p className="text-sm">You've seen all available items</p>
          </div>
        </motion.div>
      )}
    </div>
  );
});
CardStack.displayName = 'CardStack';

// Usage Examples
export const SwipeableCardExamples = {
  email: {
    leftActions: [
      {
        id: 'archive',
        label: 'Archive',
        icon: 'i-ph:archive',
        color: 'blue' as const,
        onClick: () => console.log('Archive'),
      },
    ],
    rightActions: [
      {
        id: 'delete',
        label: 'Delete',
        icon: 'i-ph:trash',
        color: 'red' as const,
        onClick: () => console.log('Delete'),
      },
      {
        id: 'spam',
        label: 'Spam',
        icon: 'i-ph:warning-circle',
        color: 'orange' as const,
        onClick: () => console.log('Spam'),
      },
    ],
    content: (
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                John Doe
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                2 hours ago
              </p>
            </div>
          </div>
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
        </div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          Project Update Meeting
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          Hi team, let's schedule a meeting to discuss the latest project updates and next steps...
        </p>
      </div>
    ),
  },

  product: {
    leftActions: [
      {
        id: 'favorite',
        label: 'Favorite',
        icon: 'i-ph:heart',
        color: 'red' as const,
        onClick: () => console.log('Favorite'),
      },
    ],
    rightActions: [
      {
        id: 'cart',
        label: 'Add to Cart',
        icon: 'i-ph:shopping-cart',
        color: 'green' as const,
        onClick: () => console.log('Add to Cart'),
      },
    ],
    content: (
      <div>
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
          <div className="i-ph:image w-12 h-12 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Wireless Headphones
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Premium quality with noise cancellation
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
            $99.99
          </span>
          <div className="flex items-center gap-1">
            <div className="i-ph:star-fill w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">4.5</span>
          </div>
        </div>
      </div>
    ),
  },

  notification: {
    rightActions: [
      {
        id: 'dismiss',
        label: 'Dismiss',
        icon: 'i-ph:x',
        color: 'gray' as const,
        onClick: () => console.log('Dismiss'),
      },
    ],
    content: (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <div className="i-ph:bell w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            New Message
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You have a new message from Sarah
          </p>
        </div>
      </div>
    ),
  },

  stackCards: [
    {
      id: '1',
      content: (
        <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2">Card 1</h2>
          <p>Swipe left or right</p>
        </div>
      ),
    },
    {
      id: '2',
      content: (
        <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2">Card 2</h2>
          <p>Another swipeable card</p>
        </div>
      ),
    },
    {
      id: '3',
      content: (
        <div className="h-full bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white flex flex-col justify-center items-center">
          <h2 className="text-2xl font-bold mb-2">Card 3</h2>
          <p>Last card in stack</p>
        </div>
      ),
    },
  ],
};