import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ElementInfo } from './Inspector';

interface ElementContextMenuProps {
  elementInfo: ElementInfo | null;
  position: { x: number; y: number } | null;
  isVisible: boolean;
  onClose: () => void;
  onEditElement: (elementInfo: ElementInfo) => void;
  onDuplicateElement: (elementInfo: ElementInfo) => void;
  onDeleteElement: (elementInfo: ElementInfo) => void;
  onInspectStyles: (elementInfo: ElementInfo) => void;
  onCopySelector: (elementInfo: ElementInfo) => void;
}

export const ElementContextMenu = ({
  elementInfo,
  position,
  isVisible,
  onClose,
  onEditElement,
  onDuplicateElement,
  onDeleteElement,
  onInspectStyles,
  onCopySelector,
}: ElementContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (!position || !isVisible) return;

    const adjustMenuPosition = () => {
      if (!menuRef.current) return;

      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = position.x;
      let adjustedY = position.y;

      // Adjust horizontal position if menu would overflow
      if (position.x + menuRect.width > viewportWidth) {
        adjustedX = position.x - menuRect.width;
      }

      // Adjust vertical position if menu would overflow
      if (position.y + menuRect.height > viewportHeight) {
        adjustedY = position.y - menuRect.height;
      }

      // Ensure menu doesn't go off-screen
      adjustedX = Math.max(0, adjustedX);
      adjustedY = Math.max(0, adjustedY);

      setAdjustedPosition({ x: adjustedX, y: adjustedY });
    };

    // Use setTimeout to ensure the menu is rendered before calculating position
    setTimeout(adjustMenuPosition, 0);
  }, [position, isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!elementInfo || !adjustedPosition) return null;

  const menuItems = [
    {
      icon: 'i-ph:pencil',
      label: 'Edit Element',
      action: () => onEditElement(elementInfo),
      description: 'Modify element properties',
    },
    {
      icon: 'i-ph:copy',
      label: 'Duplicate Element',
      action: () => onDuplicateElement(elementInfo),
      description: 'Create a copy of this element',
    },
    {
      icon: 'i-ph:eye',
      label: 'Inspect Styles',
      action: () => onInspectStyles(elementInfo),
      description: 'View CSS properties',
    },
    {
      icon: 'i-ph:clipboard-text',
      label: 'Copy Selector',
      action: () => onCopySelector(elementInfo),
      description: 'Copy CSS selector to clipboard',
    },
    {
      icon: 'i-ph:trash',
      label: 'Delete Element',
      action: () => onDeleteElement(elementInfo),
      description: 'Remove this element',
      danger: true,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={onClose}
          />

          {/* Context Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 min-w-[240px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{
              left: adjustedPosition.x,
              top: adjustedPosition.y,
            }}
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {elementInfo.displayText}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {elementInfo.rect.width.toFixed(0)}px × {elementInfo.rect.height.toFixed(0)}px
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                    item.danger
                      ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className={`${item.icon} w-4 h-4 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Info */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div className="truncate">
                  <span className="font-medium">ID:</span> {elementInfo.id || 'None'}
                </div>
                <div className="truncate mt-1">
                  <span className="font-medium">Classes:</span> {elementInfo.className || 'None'}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};