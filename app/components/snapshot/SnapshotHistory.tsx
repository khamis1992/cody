import React, { useState, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { projectSnapshotStore, type ProjectSnapshot } from '~/lib/stores/projectSnapshot';
import { SnapshotService } from '~/lib/services/snapshotService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/Card';
import { Button } from '~/components/ui/Button';
import { ConfirmationDialog } from '~/components/ui/Dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'react-toastify';

interface SnapshotHistoryProps {
  db?: IDBDatabase;
}

export const SnapshotHistory: React.FC<SnapshotHistoryProps> = ({ db }) => {
  const snapshots = useStore(projectSnapshotStore.snapshots);
  const isRestoring = useStore(projectSnapshotStore.isRestoring);
  const autoSaveEnabled = useStore(projectSnapshotStore.autoSaveEnabled);
  const autoSaveInterval = useStore(projectSnapshotStore.autoSaveInterval);

  const [selectedSnapshot, setSelectedSnapshot] = useState<ProjectSnapshot | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [newSnapshotDescription, setNewSnapshotDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const snapshotList = Object.values(snapshots).sort((a, b) => b.timestamp - a.timestamp);

  const handleCreateSnapshot = async () => {
    // Validation
    const trimmedName = newSnapshotName.trim();
    if (!trimmedName) {
      toast.error('Please enter a snapshot name');
      return;
    }

    if (trimmedName.length < 3) {
      toast.error('Snapshot name must be at least 3 characters long');
      return;
    }

    if (trimmedName.length > 100) {
      toast.error('Snapshot name must be less than 100 characters');
      return;
    }

    // Check for duplicate names
    const existingNames = Object.values(snapshots).map(s => s.name.toLowerCase());
    if (existingNames.includes(trimmedName.toLowerCase())) {
      toast.error('A snapshot with this name already exists');
      return;
    }

    try {
      setIsCreating(true);
      const snapshotId = await SnapshotService.createProjectSnapshot(
        trimmedName,
        newSnapshotDescription.trim() || undefined,
        db
      );

      if (!snapshotId) {
        throw new Error('Failed to create snapshot - no ID returned');
      }

      setShowCreateDialog(false);
      setNewSnapshotName('');
      setNewSnapshotDescription('');
      toast.success(`Snapshot "${trimmedName}" created successfully`);
    } catch (error) {
      console.error('Error creating snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to create snapshot: ${errorMessage}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleRestoreSnapshot = async (snapshot: ProjectSnapshot) => {
    if (!snapshot?.id) {
      toast.error('Invalid snapshot selected');
      return;
    }

    try {
      // Validate snapshot exists and has data
      const currentSnapshot = projectSnapshotStore.getSnapshot(snapshot.id);
      if (!currentSnapshot) {
        toast.error('Snapshot no longer exists');
        return;
      }

      if (!currentSnapshot.data) {
        toast.error('Snapshot contains no data to restore');
        return;
      }

      await SnapshotService.restoreProjectFromSnapshot(snapshot.id, db);
      setShowRestoreConfirm(false);
      setSelectedSnapshot(null);
      toast.success(`Successfully restored project from "${snapshot.name}"`);

      // Refresh page after successful restore to ensure clean state
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error restoring snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to restore snapshot: ${errorMessage}`);
    }
  };

  const handleExportSnapshot = async (snapshot: ProjectSnapshot) => {
    if (!snapshot?.id) {
      toast.error('Invalid snapshot selected');
      return;
    }

    try {
      // Validate snapshot exists
      const currentSnapshot = projectSnapshotStore.getSnapshot(snapshot.id);
      if (!currentSnapshot) {
        toast.error('Snapshot no longer exists');
        return;
      }

      if (!currentSnapshot.data) {
        toast.error('Snapshot contains no data to export');
        return;
      }

      setIsExporting(snapshot.id);
      await SnapshotService.exportProjectSnapshot(snapshot.id);
      toast.success(`Successfully exported "${snapshot.name}"`);
    } catch (error) {
      console.error('Error exporting snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to export snapshot: ${errorMessage}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleImportSnapshot = async (file: File) => {
    // Validation
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Check file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 50MB.');
      return;
    }

    // Check file type
    const validExtensions = ['.codelaunch', '.json'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExtension) {
      toast.error('Invalid file type. Please select a .codelaunch or .json file.');
      return;
    }

    try {
      const snapshotId = await SnapshotService.importProjectSnapshot(file);

      if (!snapshotId) {
        throw new Error('Import failed - no snapshot ID returned');
      }

      toast.success(`Snapshot imported successfully from "${file.name}"`);
    } catch (error) {
      console.error('Error importing snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      if (errorMessage.includes('Invalid snapshot format')) {
        toast.error('Invalid snapshot file format. Please check the file and try again.');
      } else if (errorMessage.includes('Failed to read file')) {
        toast.error('Unable to read the selected file. Please try again.');
      } else {
        toast.error(`Failed to import snapshot: ${errorMessage}`);
      }
    }
  };

  const handleDeleteSnapshot = (snapshot: ProjectSnapshot) => {
    if (!snapshot?.id) {
      toast.error('Invalid snapshot selected');
      return;
    }

    try {
      // Validate snapshot exists before deletion
      const currentSnapshot = projectSnapshotStore.getSnapshot(snapshot.id);
      if (!currentSnapshot) {
        toast.error('Snapshot no longer exists');
        setShowDeleteConfirm(false);
        setSelectedSnapshot(null);
        return;
      }

      projectSnapshotStore.deleteSnapshot(snapshot.id);
      setShowDeleteConfirm(false);
      setSelectedSnapshot(null);
      toast.success(`Successfully deleted "${snapshot.name}"`);
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to delete snapshot: ${errorMessage}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">Project Snapshots</h3>
          <p className="text-sm text-bolt-elements-textSecondary">
            Manage project snapshots for backup and recovery
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="i-ph:upload-simple mr-2"></div>
            Import
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateDialog(true)}
          >
            <div className="i-ph:camera mr-2"></div>
            Create Snapshot
          </Button>
        </div>
      </div>

      {/* Auto-save Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="i-ph:clock-clockwise"></div>
            Auto-save Settings
          </CardTitle>
          <CardDescription>
            Automatically create snapshots to prevent data loss
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => projectSnapshotStore.autoSaveEnabled.set(e.target.checked)}
                  className="rounded border-bolt-elements-borderColor"
                />
                <span className="text-sm text-bolt-elements-textPrimary">Enable auto-save</span>
              </label>
            </div>
            {autoSaveEnabled && (
              <div className="flex items-center gap-2">
                <label htmlFor="interval" className="text-sm text-bolt-elements-textSecondary">
                  Every
                </label>
                <select
                  id="interval"
                  value={autoSaveInterval}
                  onChange={(e) => projectSnapshotStore.autoSaveInterval.set(Number(e.target.value))}
                  className="px-2 py-1 text-sm bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Snapshots List */}
      <div className="space-y-4">
        <AnimatePresence>
          {snapshotList.map((snapshot) => (
            <motion.div
              key={snapshot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <div className={`i-ph:${snapshot.name.startsWith('Auto-save') ? 'clock' : 'camera'}`}></div>
                        {snapshot.name}
                        {snapshot.compressed && (
                          <span className="text-xs bg-bolt-elements-button-primary-background text-white px-2 py-1 rounded">
                            Compressed
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {snapshot.description || 'No description'}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-xs text-bolt-elements-textTertiary">
                        <span>{format(new Date(snapshot.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(snapshot.timestamp), { addSuffix: true })}</span>
                        <span>•</span>
                        <span>v{snapshot.version}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExportSnapshot(snapshot)}
                        disabled={isExporting === snapshot.id}
                      >
                        {isExporting === snapshot.id ? (
                          <div className="i-ph:spinner animate-spin"></div>
                        ) : (
                          <div className="i-ph:download-simple"></div>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSnapshot(snapshot);
                          setShowRestoreConfirm(true);
                        }}
                        disabled={isRestoring}
                      >
                        <div className="i-ph:arrow-counter-clockwise"></div>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSnapshot(snapshot);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <div className="i-ph:trash"></div>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-bolt-elements-textTertiary">Files:</span>
                      <span className="ml-2 text-bolt-elements-textPrimary">
                        {snapshot.data.metadata?.filesCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-bolt-elements-textTertiary">Chats:</span>
                      <span className="ml-2 text-bolt-elements-textPrimary">
                        {snapshot.data.metadata?.chatCount || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-bolt-elements-textTertiary">Size:</span>
                      <span className="ml-2 text-bolt-elements-textPrimary">
                        {snapshot.data.metadata?.totalSize
                          ? formatFileSize(snapshot.data.metadata.totalSize)
                          : 'Unknown'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-bolt-elements-textTertiary">ID:</span>
                      <span className="ml-2 text-bolt-elements-textPrimary font-mono text-xs">
                        {snapshot.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {snapshotList.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="i-ph:camera text-4xl text-bolt-elements-textTertiary mb-4"></div>
              <h3 className="text-lg font-medium text-bolt-elements-textPrimary mb-2">
                No snapshots yet
              </h3>
              <p className="text-bolt-elements-textSecondary mb-4">
                Create your first snapshot to backup your project state
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                Create First Snapshot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".codelaunch,.json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleImportSnapshot(file);
            // Reset the input to allow importing the same file again if needed
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Create Snapshot Dialog */}
      <ConfirmationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        title="Create Project Snapshot"
        description="Create a snapshot of your current project state"
        confirmText={isCreating ? "Creating..." : "Create Snapshot"}
        onConfirm={handleCreateSnapshot}
        variant="default"
        isLoading={isCreating}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
              Snapshot Name *
            </label>
            <input
              type="text"
              value={newSnapshotName}
              onChange={(e) => setNewSnapshotName(e.target.value)}
              placeholder="e.g., Feature complete, Before refactor..."
              className="w-full px-3 py-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md focus:ring-2 focus:ring-bolt-elements-button-primary-background focus:border-transparent"
              maxLength={100}
              disabled={isCreating}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-bolt-elements-textPrimary mb-2">
              Description (optional)
            </label>
            <textarea
              value={newSnapshotDescription}
              onChange={(e) => setNewSnapshotDescription(e.target.value)}
              placeholder="Describe what this snapshot contains..."
              rows={3}
              className="w-full px-3 py-2 bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor rounded-md focus:ring-2 focus:ring-bolt-elements-button-primary-background focus:border-transparent resize-none"
              maxLength={500}
              disabled={isCreating}
            />
          </div>
        </div>
      </ConfirmationDialog>

      {/* Restore Confirmation Dialog */}
      <ConfirmationDialog
        open={showRestoreConfirm}
        onOpenChange={setShowRestoreConfirm}
        title="Restore Project Snapshot"
        description={
          selectedSnapshot
            ? `Are you sure you want to restore "${selectedSnapshot.name}"? This will replace your current project state.`
            : ''
        }
        confirmText="Restore"
        onConfirm={() => selectedSnapshot && handleRestoreSnapshot(selectedSnapshot)}
        variant="warning"
        isLoading={isRestoring}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Snapshot"
        description={
          selectedSnapshot
            ? `Are you sure you want to delete "${selectedSnapshot.name}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        onConfirm={() => selectedSnapshot && handleDeleteSnapshot(selectedSnapshot)}
        variant="destructive"
      />
    </div>
  );
};