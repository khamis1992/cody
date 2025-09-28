import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogDescription, DialogRoot } from '~/components/ui/Dialog';
import { useStore } from '@nanostores/react';
import { projectSnapshotStore } from '~/lib/stores/projectSnapshot';
import { SnapshotService } from '~/lib/services/snapshotService';
import { formatDistanceToNow } from 'date-fns';

interface RestorePromptProps {
  open: boolean;
  onClose: () => void;
  db?: IDBDatabase;
}

export const RestorePrompt: React.FC<RestorePromptProps> = ({ open, onClose, db }) => {
  const pendingSnapshot = useStore(projectSnapshotStore.pendingRestoreSnapshot);
  const isRestoring = useStore(projectSnapshotStore.isRestoring);
  const [showDetails, setShowDetails] = useState(false);

  const handleRestore = async () => {
    if (!pendingSnapshot) return;

    try {
      await SnapshotService.restoreProjectFromSnapshot(pendingSnapshot.id, db);
      projectSnapshotStore.dismissPendingRestore();
      onClose();
    } catch (error) {
      console.error('Error restoring snapshot:', error);
      // TODO: Show error toast/notification
    }
  };

  const handleDismiss = () => {
    projectSnapshotStore.dismissPendingRestore();
    onClose();
  };

  if (!pendingSnapshot) {
    return null;
  }

  return (
    <DialogRoot open={open} onOpenChange={(v) => !v && handleDismiss()}>
      <Dialog
        className="text-center !flex-col !mx-auto !text-center !max-w-lg"
        showCloseButton={true}
        onClose={handleDismiss}
      >
        <div className="border !border-bolt-elements-borderColor flex flex-col gap-5 justify-center items-center p-6 bg-bolt-elements-background-depth-2 rounded-md">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 bg-bolt-elements-prompt-background rounded-full">
            <div className="i-ph:clock-clockwise text-2xl text-bolt-elements-textPrimary"></div>
          </div>

          {/* Title */}
          <DialogTitle className="text-bolt-elements-textPrimary text-xl font-semibold leading-6">
            Project Recovery Available
          </DialogTitle>

          {/* Description */}
          <DialogDescription className="text-bolt-elements-textSecondary text-sm max-w-md text-center">
            We detected that your session ended unexpectedly. Would you like to restore your project
            from the most recent auto-save?
          </DialogDescription>

          {/* Snapshot Details */}
          <div className="w-full bg-bolt-elements-background-depth-3 rounded-lg p-4 border border-bolt-elements-borderColor">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-bolt-elements-textPrimary">
                {pendingSnapshot.name}
              </span>
              <span className="text-xs text-bolt-elements-textTertiary">
                {formatDistanceToNow(new Date(pendingSnapshot.timestamp), { addSuffix: true })}
              </span>
            </div>

            {pendingSnapshot.description && (
              <p className="text-xs text-bolt-elements-textSecondary mb-2">
                {pendingSnapshot.description}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-bolt-elements-textTertiary">
              <span>
                {pendingSnapshot.data.metadata?.filesCount || 0} files
              </span>
              <span>
                {pendingSnapshot.data.metadata?.chatCount || 0} chats
              </span>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-bolt-elements-button-primary-text hover:underline"
              >
                {showDetails ? 'Hide' : 'Show'} details
              </button>
            </div>

            {/* Additional Details */}
            {showDetails && (
              <div className="mt-3 pt-3 border-t border-bolt-elements-borderColor">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-bolt-elements-textTertiary">Version:</span>
                    <span className="ml-1 text-bolt-elements-textSecondary">{pendingSnapshot.version}</span>
                  </div>
                  <div>
                    <span className="text-bolt-elements-textTertiary">Size:</span>
                    <span className="ml-1 text-bolt-elements-textSecondary">
                      {pendingSnapshot.data.metadata?.totalSize
                        ? `${(pendingSnapshot.data.metadata.totalSize / 1024).toFixed(1)} KB`
                        : 'Unknown'
                      }
                    </span>
                  </div>
                  <div>
                    <span className="text-bolt-elements-textTertiary">Compressed:</span>
                    <span className="ml-1 text-bolt-elements-textSecondary">
                      {pendingSnapshot.compressed ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-bolt-elements-textTertiary">ID:</span>
                    <span className="ml-1 text-bolt-elements-textSecondary font-mono">
                      {pendingSnapshot.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={handleDismiss}
              disabled={isRestoring}
              className="flex-1 px-4 py-2 text-sm font-medium text-bolt-elements-textSecondary bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md hover:bg-bolt-elements-background-depth-3 transition-colors disabled:opacity-50"
            >
              Continue without restoring
            </button>
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-bolt-elements-button-primary-background hover:bg-bolt-elements-button-primary-backgroundHover rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isRestoring ? (
                <>
                  <div className="i-ph:spinner animate-spin"></div>
                  Restoring...
                </>
              ) : (
                <>
                  <div className="i-ph:download-simple"></div>
                  Restore Project
                </>
              )}
            </button>
          </div>

          {/* Warning */}
          <div className="w-full max-w-md">
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <div className="i-ph:warning text-yellow-600 dark:text-yellow-400 text-sm mt-0.5 flex-shrink-0"></div>
              <div className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Restoring will replace your current project state.
                Any unsaved changes will be lost.
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </DialogRoot>
  );
};