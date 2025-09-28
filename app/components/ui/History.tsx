import { AnimatePresence, motion } from 'framer-motion';
import { useSearchFilter } from '~/lib/hooks/useSearchFilter';
import { db, getAll, useChatHistory, type ChatHistoryItem } from '~/lib/persistence';
import { classNames } from '~/utils/classNames';
import { HistoryItem } from '../sidebar/HistoryItem';
import { binDates } from '../sidebar/date-binning';
import { Button } from './Button';
import { Dialog, DialogButton, DialogDescription, DialogRoot, DialogTitle } from './Dialog';
import Popover from './Popover';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type DialogContent =
  | { type: 'delete'; item: ChatHistoryItem }
  | { type: 'bulkDelete'; items: ChatHistoryItem[] }
  | null;

export function History() {
  const { duplicateCurrentChat, exportChat, deleteChat, deleteSelectedItems } = useChatHistory();
  const [list, setList] = useState<ChatHistoryItem[]>([]);
  const [dialogContent, setDialogContent] = useState<DialogContent>(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { filteredItems: filteredList, handleSearchChange } = useSearchFilter({
    items: list,
    searchFields: ['description'],
  });

  const loadEntries = useCallback(() => {
    if (db) {
      getAll(db)
        .then((list) => list.filter((item) => item.urlId && item.description))
        .then(setList)
        .catch((error) => toast.error(error.message));
    }
  }, []);

  const closeDialog = () => {
    setDialogContent(null);
  };

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode);
    if (selectionMode) {
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = useCallback((id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  }, []);

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedItems.length === 0) {
      toast.info('Select at least one chat to delete');
      return;
    }
    const selectedChats = list.filter((item) => selectedItems.includes(item.id));
    if (selectedChats.length === 0) {
      toast.error('Could not find selected chats');
      return;
    }
    setDialogContent({ type: 'bulkDelete', items: selectedChats });
  }, [selectedItems, list]);

  const selectAll = useCallback(() => {
    const allFilteredIds = filteredList.map((item) => item.id);
    setSelectedItems((prev) => {
      const allFilteredAreSelected =
        allFilteredIds.length > 0 && allFilteredIds.every((id) => prev.includes(id));
      if (allFilteredAreSelected) {
        return prev.filter((id) => !allFilteredIds.includes(id));
      } else {
        return [...new Set([...prev, ...allFilteredIds])];
      }
    });
  }, [filteredList]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleDuplicate = async (id: string) => {
    await duplicateCurrentChat(id);
    loadEntries();
  };

  const setDialogContentWithLogging = useCallback((content: DialogContent) => {
    setDialogContent(content);
  }, []);

  return (
    <Popover
      side="bottom"
      align="end"
      trigger={
        <Button variant="ghost">
          <div className="i-ph:clock-counter-clockwise-bold" />
          History
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-[400px] h-[500px] flex flex-col bg-bolt-elements-bg-depth-1 border border-bolt-elements-borderColor rounded-lg shadow-lg"
      >
        <div className="p-4 space-y-3 border-b border-bolt-elements-borderColor">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-bolt-elements-textPrimary">Chat History</h2>
            <Button
              variant={selectionMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={toggleSelectionMode}
            >
              {selectionMode ? 'Cancel' : 'Select'}
            </Button>
          </div>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <span className="i-ph:magnifying-glass h-4 w-4 text-bolt-elements-textTertiary" />
            </div>
            <input
              className="w-full bg-bolt-elements-bg-depth-2 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-500/50 text-sm text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary border border-bolt-elements-borderColor"
              type="search"
              placeholder="Search chats..."
              onChange={handleSearchChange}
              aria-label="Search chats"
            />
          </div>
        </div>
        <AnimatePresence>
          {selectionMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center justify-between text-sm px-4 py-2 border-b border-bolt-elements-borderColor"
            >
              <Button variant="ghost" size="sm" onClick={selectAll}>
                {selectedItems.length === filteredList.length && filteredList.length > 0
                  ? 'Deselect all'
                  : 'Select all'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDeleteClick}
                disabled={selectedItems.length === 0}
              >
                Delete ({selectedItems.length})
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-1 overflow-auto px-3 pb-3">
          {filteredList.length === 0 ? (
            <div className="p-4 text-bolt-elements-textSecondary text-sm">
              {list.length === 0 ? 'No previous conversations' : 'No matches found'}
            </div>
          ) : (
            <DialogRoot open={dialogContent !== null}>
              {binDates(filteredList).map(({ category, items }) => (
                <div key={category} className="mt-2 first:mt-0 space-y-1">
                  <div className="text-xs font-medium text-bolt-elements-textSecondary sticky top-0 z-1 bg-bolt-elements-bg-depth-1 px-4 py-1">
                    {category}
                  </div>
                  <div className="space-y-0.5 pr-1">
                    {items.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        exportChat={() => exportChat(item.id)}
                        onDelete={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setDialogContentWithLogging({ type: 'delete', item });
                        }}
                        onDuplicate={() => handleDuplicate(item.id)}
                        selectionMode={selectionMode}
                        isSelected={selectedItems.includes(item.id)}
                        onToggleSelection={toggleItemSelection}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <Dialog onBackdrop={closeDialog} onClose={closeDialog}>
                {dialogContent?.type === 'delete' && (
                  <>
                    <div className="p-6 bg-bolt-elements-bg-depth-1">
                      <DialogTitle className="text-bolt-elements-textPrimary">
                        Delete Chat?
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-bolt-elements-textSecondary">
                        <p>
                          You are about to delete{' '}
                          <span className="font-medium text-bolt-elements-textPrimary">
                            {dialogContent.item.description}
                          </span>
                        </p>
                        <p className="mt-2">Are you sure you want to delete this chat?</p>
                      </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-3 px-6 py-4 bg-bolt-elements-bg-depth-2 border-t border-bolt-elements-borderColor">
                      <DialogButton type="secondary" onClick={closeDialog}>
                        Cancel
                      </DialogButton>
                      <DialogButton
                        type="danger"
                        onClick={(event) => {
                          deleteChat(dialogContent.item.id);
                          closeDialog();
                        }}
                      >
                        Delete
                      </DialogButton>
                    </div>
                  </>
                )}
                {dialogContent?.type === 'bulkDelete' && (
                  <>
                    <div className="p-6 bg-bolt-elements-bg-depth-1">
                      <DialogTitle className="text-bolt-elements-textPrimary">
                        Delete Selected Chats?
                      </DialogTitle>
                      <DialogDescription className="mt-2 text-bolt-elements-textSecondary">
                        <p>
                          You are about to delete {dialogContent.items.length}{' '}
                          {dialogContent.items.length === 1 ? 'chat' : 'chats'}.
                        </p>
                        <p className="mt-3">Are you sure you want to delete these chats?</p>
                      </DialogDescription>
                    </div>
                    <div className="flex justify-end gap-3 px-6 py-4 bg-bolt-elements-bg-depth-2 border-t border-bolt-elements-borderColor">
                      <DialogButton type="secondary" onClick={closeDialog}>
                        Cancel
                      </DialogButton>
                      <DialogButton
                        type="danger"
                        onClick={() => {
                          const itemsToDeleteNow = [...selectedItems];
                          deleteSelectedItems(itemsToDeleteNow);
                          closeDialog();
                        }}
                      >
                        Delete
                      </DialogButton>
                    </div>
                  </>
                )}
              </Dialog>
            </DialogRoot>
          )}
        </div>
      </motion.div>
    </Popover>
  );
}
