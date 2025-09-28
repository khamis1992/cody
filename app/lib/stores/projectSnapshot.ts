import { atom, map, type WritableAtom, type MapStore } from 'nanostores';
import { v4 as uuidv4 } from 'uuid';
import * as LZString from 'lz-string';
import { logStore } from './logs';

export interface ProjectSnapshot {
  id: string;
  name: string;
  description?: string;
  timestamp: number;
  version: string;
  compressed: boolean;
  data: {
    files: Record<string, any>;
    chats: any[];
    settings: any;
    metadata: {
      filesCount: number;
      totalSize: number;
      chatCount: number;
    };
  };
}

export interface ProjectSnapshotState {
  snapshots: Record<string, ProjectSnapshot>;
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // in minutes
  lastAutoSave: number | null;
  isRestoring: boolean;
  pendingRestoreSnapshot: ProjectSnapshot | null;
}

export class ProjectSnapshotStore {
  // State atoms
  snapshots: MapStore<Record<string, ProjectSnapshot>> = map({});
  autoSaveEnabled: WritableAtom<boolean> = atom(true);
  autoSaveInterval: WritableAtom<number> = atom(5); // 5 minutes default
  lastAutoSave: WritableAtom<number | null> = atom(null);
  isRestoring: WritableAtom<boolean> = atom(false);
  pendingRestoreSnapshot: WritableAtom<ProjectSnapshot | null> = atom(null);

  private autoSaveTimer: NodeJS.Timeout | null = null;
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined';
    if (this.isBrowser) {
      this.initializeFromStorage();
      this.setupAutoSave();
      this.detectPageReload();
    }
  }

  /**
   * Initialize snapshots from localStorage
   */
  private initializeFromStorage() {
    if (!this.isBrowser) return;
    try {
      const storedSnapshots = localStorage.getItem('project_snapshots');
      if (storedSnapshots) {
        const snapshots = JSON.parse(storedSnapshots);
        this.snapshots.set(snapshots);
      }

      // Load auto-save settings
      const autoSaveEnabled = localStorage.getItem('auto_save_enabled');
      if (autoSaveEnabled !== null) {
        this.autoSaveEnabled.set(JSON.parse(autoSaveEnabled));
      }

      const autoSaveInterval = localStorage.getItem('auto_save_interval');
      if (autoSaveInterval !== null) {
        this.autoSaveInterval.set(JSON.parse(autoSaveInterval));
      }

      const lastAutoSave = localStorage.getItem('last_auto_save');
      if (lastAutoSave !== null) {
        this.lastAutoSave.set(JSON.parse(lastAutoSave));
      }
    } catch (error) {
      console.error('Error initializing project snapshots from storage:', error);
      logStore.logError('Failed to load project snapshots from storage');
    }
  }

  /**
   * Save snapshots to localStorage
   */
  private saveToStorage() {
    if (!this.isBrowser) return;
    try {
      const snapshots = this.snapshots.get();
      localStorage.setItem('project_snapshots', JSON.stringify(snapshots));
    } catch (error) {
      console.error('Error saving project snapshots to storage:', error);
      logStore.logError('Failed to save project snapshots to storage');
    }
  }

  /**
   * Setup auto-save functionality
   */
  private setupAutoSave() {
    if (!this.isBrowser) return;
    // Listen for auto-save settings changes
    this.autoSaveEnabled.subscribe((enabled) => {
      localStorage.setItem('auto_save_enabled', JSON.stringify(enabled));
      if (enabled) {
        this.startAutoSave();
      } else {
        this.stopAutoSave();
      }
    });

    this.autoSaveInterval.subscribe((interval) => {
      localStorage.setItem('auto_save_interval', JSON.stringify(interval));
      if (this.autoSaveEnabled.get()) {
        this.restartAutoSave();
      }
    });

    // Start auto-save if enabled
    if (this.autoSaveEnabled.get()) {
      this.startAutoSave();
    }
  }

  /**
   * Start auto-save timer
   */
  private startAutoSave() {
    this.stopAutoSave(); // Clear existing timer
    const intervalMs = this.autoSaveInterval.get() * 60 * 1000; // Convert to milliseconds

    this.autoSaveTimer = setInterval(() => {
      this.autoSaveCurrentState();
    }, intervalMs);

    logStore.logSystem(`Auto-save enabled with ${this.autoSaveInterval.get()} minute interval`);
  }

  /**
   * Stop auto-save timer
   */
  private stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Restart auto-save timer
   */
  private restartAutoSave() {
    if (this.autoSaveEnabled.get()) {
      this.startAutoSave();
    }
  }

  /**
   * Detect page reload and offer restoration
   */
  private detectPageReload() {
    if (!this.isBrowser) return;
    // Check if we have a recent auto-save that could indicate an unexpected reload
    const lastAutoSave = this.lastAutoSave.get();
    const now = Date.now();
    const fiveMinutesAgo = now - (5 * 60 * 1000);

    if (lastAutoSave && lastAutoSave > fiveMinutesAgo) {
      // Find the most recent auto-save snapshot
      const snapshots = this.snapshots.get();
      const autoSaveSnapshots = Object.values(snapshots)
        .filter(s => s.name.startsWith('Auto-save'))
        .sort((a, b) => b.timestamp - a.timestamp);

      if (autoSaveSnapshots.length > 0) {
        const mostRecent = autoSaveSnapshots[0];
        // Only offer restoration if the snapshot is newer than 30 seconds ago
        if (mostRecent.timestamp > now - 30000) {
          this.pendingRestoreSnapshot.set(mostRecent);
        }
      }
    }
  }

  /**
   * Create a new project snapshot
   */
  async createSnapshot(name: string, description?: string, files?: Record<string, any>, chats?: any[], settings?: any): Promise<string> {
    try {
      const id = uuidv4();
      const timestamp = Date.now();

      // Get current project data if not provided
      const projectFiles = files || this.getCurrentFiles();
      const projectChats = chats || this.getCurrentChats();
      const projectSettings = settings || this.getCurrentSettings();

      // Calculate metadata
      const filesCount = Object.keys(projectFiles).length;
      const totalSize = this.calculateDataSize(projectFiles, projectChats, projectSettings);
      const chatCount = projectChats.length;

      // Create snapshot data
      const snapshotData = {
        files: projectFiles,
        chats: projectChats,
        settings: projectSettings,
        metadata: {
          filesCount,
          totalSize,
          chatCount,
        },
      };

      // Compress data if it's large (>100KB)
      const shouldCompress = totalSize > 100 * 1024;
      let finalData = snapshotData;

      if (shouldCompress) {
        const jsonString = JSON.stringify(snapshotData);
        const compressed = LZString.compress(jsonString);
        finalData = compressed as any;
      }

      const snapshot: ProjectSnapshot = {
        id,
        name,
        description,
        timestamp,
        version: '1.0.0',
        compressed: shouldCompress,
        data: finalData,
      };

      // Add to store
      const currentSnapshots = this.snapshots.get();
      this.snapshots.set({
        ...currentSnapshots,
        [id]: snapshot,
      });

      // Save to storage
      this.saveToStorage();

      logStore.logSystem(`Created project snapshot: ${name}`);
      return id;
    } catch (error) {
      console.error('Error creating project snapshot:', error);
      logStore.logError('Failed to create project snapshot');
      throw error;
    }
  }

  /**
   * Create an auto-save snapshot
   */
  async autoSaveCurrentState(): Promise<void> {
    try {
      const now = new Date();
      const name = `Auto-save ${now.toLocaleString()}`;
      const description = 'Automatically saved project state';

      await this.createSnapshot(name, description);
      this.lastAutoSave.set(Date.now());
      if (this.isBrowser) {
        localStorage.setItem('last_auto_save', JSON.stringify(Date.now()));
      }

      // Clean up old auto-saves (keep only last 5)
      this.cleanupAutoSaves();
    } catch (error) {
      console.error('Error during auto-save:', error);
      logStore.logError('Auto-save failed');
    }
  }

  /**
   * Restore a project snapshot
   */
  async restoreSnapshot(snapshotId: string): Promise<void> {
    try {
      this.isRestoring.set(true);

      const snapshots = this.snapshots.get();
      const snapshot = snapshots[snapshotId];

      if (!snapshot) {
        throw new Error('Snapshot not found');
      }

      // Decompress data if needed
      let snapshotData = snapshot.data;
      if (snapshot.compressed && typeof snapshot.data === 'string') {
        const decompressed = LZString.decompress(snapshot.data as string);
        if (!decompressed) {
          throw new Error('Failed to decompress snapshot data');
        }
        snapshotData = JSON.parse(decompressed);
      }

      // Restore files
      if (snapshotData.files) {
        await this.restoreFiles(snapshotData.files);
      }

      // Restore chats
      if (snapshotData.chats) {
        await this.restoreChats(snapshotData.chats);
      }

      // Restore settings
      if (snapshotData.settings) {
        await this.restoreSettings(snapshotData.settings);
      }

      logStore.logSystem(`Restored project from snapshot: ${snapshot.name}`);
    } catch (error) {
      console.error('Error restoring snapshot:', error);
      logStore.logError('Failed to restore project snapshot');
      throw error;
    } finally {
      this.isRestoring.set(false);
      this.pendingRestoreSnapshot.set(null);
    }
  }

  /**
   * Delete a snapshot
   */
  deleteSnapshot(snapshotId: string): void {
    try {
      const currentSnapshots = this.snapshots.get();
      const { [snapshotId]: _, ...remainingSnapshots } = currentSnapshots;

      this.snapshots.set(remainingSnapshots);
      this.saveToStorage();

      logStore.logSystem(`Deleted project snapshot: ${snapshotId}`);
    } catch (error) {
      console.error('Error deleting snapshot:', error);
      logStore.logError('Failed to delete project snapshot');
    }
  }

  /**
   * Get all snapshots
   */
  getAllSnapshots(): ProjectSnapshot[] {
    const snapshots = this.snapshots.get();
    return Object.values(snapshots).sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get snapshot by ID
   */
  getSnapshot(id: string): ProjectSnapshot | null {
    const snapshots = this.snapshots.get();
    return snapshots[id] || null;
  }

  /**
   * Dismiss pending restore
   */
  dismissPendingRestore(): void {
    this.pendingRestoreSnapshot.set(null);
  }

  /**
   * Clean up old auto-saves (keep only last 5)
   */
  private cleanupAutoSaves(): void {
    try {
      const snapshots = this.snapshots.get();
      const autoSaveSnapshots = Object.values(snapshots)
        .filter(s => s.name.startsWith('Auto-save'))
        .sort((a, b) => b.timestamp - a.timestamp);

      if (autoSaveSnapshots.length > 5) {
        const toDelete = autoSaveSnapshots.slice(5);
        const updatedSnapshots = { ...snapshots };

        toDelete.forEach(snapshot => {
          delete updatedSnapshots[snapshot.id];
        });

        this.snapshots.set(updatedSnapshots);
        this.saveToStorage();
      }
    } catch (error) {
      console.error('Error cleaning up auto-saves:', error);
    }
  }

  /**
   * Calculate total data size
   */
  private calculateDataSize(files: Record<string, any>, chats: any[], settings: any): number {
    try {
      const dataString = JSON.stringify({ files, chats, settings });
      return new Blob([dataString]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Get current files from workbench
   */
  private getCurrentFiles(): Record<string, any> {
    try {
      // Import here to avoid circular dependency
      const { workbenchStore } = require('./workbench');
      const files = workbenchStore.files.get();
      const projectFiles: Record<string, any> = {};

      for (const [filePath, dirent] of Object.entries(files)) {
        if (dirent?.type === 'file') {
          projectFiles[filePath] = {
            content: dirent.content,
            isBinary: dirent.isBinary || false,
            type: dirent.type,
          };
        }
      }

      return projectFiles;
    } catch {
      return {};
    }
  }

  /**
   * Get current chats
   */
  private getCurrentChats(): any[] {
    try {
      // This would require database access, handled by the integration layer
      return [];
    } catch {
      return [];
    }
  }

  /**
   * Get current settings
   */
  private getCurrentSettings(): any {
    try {
      // This would require async settings export, handled by the integration layer
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Restore files to workbench
   */
  private async restoreFiles(files: Record<string, any>): Promise<void> {
    try {
      const { workbenchStore } = await import('./workbench');

      // Clear current files first
      const currentFiles = workbenchStore.files.get();
      for (const filePath of Object.keys(currentFiles)) {
        await workbenchStore.deleteFile(filePath);
      }

      // Create restored files
      for (const [filePath, fileData] of Object.entries(files)) {
        if (fileData.content) {
          const content = fileData.isBinary
            ? new Uint8Array(fileData.content)
            : fileData.content;
          await workbenchStore.createFile(filePath, content);
        }
      }
    } catch (error) {
      console.error('Error restoring files to workbench:', error);
      throw error;
    }
  }

  /**
   * Restore chats
   */
  private async restoreChats(chats: any[]): Promise<void> {
    try {
      // This would integrate with existing chat persistence
      // Implementation handled by the SnapshotService
      console.log('Restoring chats:', chats.length);
    } catch (error) {
      console.error('Error restoring chats:', error);
      throw error;
    }
  }

  /**
   * Restore settings
   */
  private async restoreSettings(settings: any): Promise<void> {
    try {
      // This would integrate with existing settings system
      // Implementation handled by the SnapshotService
      console.log('Restoring settings');
    } catch (error) {
      console.error('Error restoring settings:', error);
      throw error;
    }
  }
}

export const projectSnapshotStore = new ProjectSnapshotStore();