import { projectSnapshotStore } from './projectSnapshot';
import { workbenchStore } from './workbench';
import { getAllChats } from '~/lib/persistence/chats';
import { ImportExportService } from '~/lib/services/importExportService';
import { SnapshotService } from '~/lib/services/snapshotService';
import { logStore } from './logs';

/**
 * Integration service that connects project snapshots with WebContainer and workbench changes
 */
export class SnapshotIntegration {
  private static fileChangeThreshold = 5; // Number of file changes before auto-save
  private static timeThreshold = 2 * 60 * 1000; // 2 minutes in milliseconds
  private static fileChangeCount = 0;
  private static lastSignificantChange = 0;
  private static initialized = false;
  private static db: IDBDatabase | null = null;

  /**
   * Initialize the integration with the database
   */
  static initialize(database?: IDBDatabase) {
    if (this.initialized) return;

    this.db = database || null;
    this.setupFileChangeTracking();
    this.setupPeriodicAutoSave();
    this.setupPageUnloadHandler();
    this.initialized = true;

    logStore.logSystem('Project snapshot integration initialized');
  }

  /**
   * Setup file change tracking to trigger auto-saves
   */
  private static setupFileChangeTracking() {
    // Subscribe to file changes in the workbench
    workbenchStore.files.subscribe((files) => {
      const now = Date.now();

      // Only count as significant change if enough time has passed
      if (now - this.lastSignificantChange > this.timeThreshold) {
        this.fileChangeCount++;
        this.lastSignificantChange = now;

        // Trigger auto-save if threshold is reached and auto-save is enabled
        if (
          this.fileChangeCount >= this.fileChangeThreshold &&
          projectSnapshotStore.autoSaveEnabled.get()
        ) {
          this.triggerAutoSave();
          this.fileChangeCount = 0; // Reset counter
        }
      }
    });

    // Subscribe to file modifications (actual content changes)
    const originalSaveFile = workbenchStore.saveFile.bind(workbenchStore);
    workbenchStore.saveFile = async (filePath: string) => {
      const result = await originalSaveFile(filePath);

      // Track this as a significant change
      this.fileChangeCount++;

      // Check if we should auto-save
      if (
        this.fileChangeCount >= this.fileChangeThreshold &&
        projectSnapshotStore.autoSaveEnabled.get()
      ) {
        this.triggerAutoSave();
        this.fileChangeCount = 0;
      }

      return result;
    };
  }

  /**
   * Setup periodic auto-save functionality
   */
  private static setupPeriodicAutoSave() {
    // The periodic auto-save is handled by the ProjectSnapshotStore itself
    // This method exists for future enhancements if needed
  }

  /**
   * Setup page unload handler to create emergency snapshot
   */
  private static setupPageUnloadHandler() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', (event) => {
        // Only create emergency snapshot if auto-save is enabled and there are unsaved changes
        const unsavedFiles = workbenchStore.unsavedFiles.get();

        if (projectSnapshotStore.autoSaveEnabled.get() && unsavedFiles.size > 0) {
          try {
            // Create an emergency snapshot (synchronous)
            this.createEmergencySnapshot();
          } catch (error) {
            console.error('Failed to create emergency snapshot:', error);
          }
        }
      });

      // Also listen for visibility change (tab switching, etc.)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // Tab is being hidden, create a snapshot if there are changes
          const unsavedFiles = workbenchStore.unsavedFiles.get();

          if (projectSnapshotStore.autoSaveEnabled.get() && unsavedFiles.size > 0) {
            this.triggerAutoSave();
          }
        }
      });
    }
  }

  /**
   * Trigger an auto-save operation
   */
  private static async triggerAutoSave() {
    try {
      // Check if we're already restoring to avoid conflicts
      if (projectSnapshotStore.isRestoring.get()) {
        return;
      }

      await projectSnapshotStore.autoSaveCurrentState();
      logStore.logSystem('Auto-save completed successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      logStore.logError('Auto-save operation failed');
    }
  }

  /**
   * Create an emergency snapshot (synchronous for page unload)
   */
  private static createEmergencySnapshot() {
    try {
      const files = this.getCurrentProjectFiles();
      const settings = this.getCurrentProjectSettings();

      // Create a compressed snapshot data
      const emergencyData = {
        files,
        settings,
        timestamp: Date.now(),
        type: 'emergency',
      };

      // Store in localStorage as emergency backup
      localStorage.setItem('emergency_snapshot', JSON.stringify(emergencyData));
      localStorage.setItem('emergency_snapshot_timestamp', Date.now().toString());

    } catch (error) {
      console.error('Failed to create emergency snapshot:', error);
    }
  }

  /**
   * Check for and recover from emergency snapshot
   */
  static checkForEmergencyRecovery(): boolean {
    try {
      const emergencyData = localStorage.getItem('emergency_snapshot');
      const emergencyTimestamp = localStorage.getItem('emergency_snapshot_timestamp');

      if (emergencyData && emergencyTimestamp) {
        const timestamp = parseInt(emergencyTimestamp, 10);
        const age = Date.now() - timestamp;

        // Only offer recovery if emergency snapshot is less than 1 hour old
        if (age < 60 * 60 * 1000) {
          const data = JSON.parse(emergencyData);

          // Create a proper snapshot from emergency data
          const emergencySnapshot = {
            id: `emergency-${timestamp}`,
            name: `Emergency Recovery ${new Date(timestamp).toLocaleString()}`,
            description: 'Emergency snapshot created during unexpected page reload',
            timestamp,
            version: '1.0.0',
            compressed: false,
            data: {
              files: data.files,
              chats: [],
              settings: data.settings,
              metadata: {
                filesCount: Object.keys(data.files).length,
                totalSize: JSON.stringify(data).length,
                chatCount: 0,
              },
            },
          };

          // Set as pending restore
          projectSnapshotStore.pendingRestoreSnapshot.set(emergencySnapshot);

          // Clean up emergency data
          localStorage.removeItem('emergency_snapshot');
          localStorage.removeItem('emergency_snapshot_timestamp');

          return true;
        } else {
          // Clean up old emergency data
          localStorage.removeItem('emergency_snapshot');
          localStorage.removeItem('emergency_snapshot_timestamp');
        }
      }
    } catch (error) {
      console.error('Error checking for emergency recovery:', error);
    }

    return false;
  }

  /**
   * Get current project files
   */
  private static getCurrentProjectFiles(): Record<string, any> {
    try {
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
    } catch (error) {
      console.error('Error getting current project files:', error);
      return {};
    }
  }

  /**
   * Get current project chats
   */
  private static async getCurrentProjectChats(): Promise<any[]> {
    try {
      if (!this.db) return [];
      return await getAllChats(this.db);
    } catch (error) {
      console.error('Error getting current project chats:', error);
      return [];
    }
  }

  /**
   * Get current project settings (synchronous version for emergency saves)
   */
  private static getCurrentProjectSettings(): any {
    try {
      // Get essential settings synchronously from localStorage and cookies
      const settings = {
        core: {
          theme: localStorage.getItem('codelaunch_theme'),
          profile: localStorage.getItem('codelaunch_user_profile'),
        },
        ui: {
          tabConfiguration: localStorage.getItem('bolt_tab_configuration'),
        },
        timestamp: Date.now(),
      };

      return settings;
    } catch (error) {
      console.error('Error getting current project settings:', error);
      return {};
    }
  }

  /**
   * Enhanced project snapshot creation with current workbench state
   */
  static async createSnapshotWithCurrentState(name: string, description?: string): Promise<string> {
    try {
      const files = this.getCurrentProjectFiles();
      const chats = await this.getCurrentProjectChats();
      const settings = await ImportExportService.exportSettings();

      return await projectSnapshotStore.createSnapshot(name, description, files, chats, settings);
    } catch (error) {
      console.error('Error creating snapshot with current state:', error);
      throw error;
    }
  }

  /**
   * Reset file change tracking
   */
  static resetChangeTracking() {
    this.fileChangeCount = 0;
    this.lastSignificantChange = Date.now();
  }

  /**
   * Get current change tracking stats
   */
  static getChangeTrackingStats() {
    return {
      fileChangeCount: this.fileChangeCount,
      lastSignificantChange: this.lastSignificantChange,
      timeThreshold: this.timeThreshold,
      fileChangeThreshold: this.fileChangeThreshold,
    };
  }

  /**
   * Update the database reference
   */
  static updateDatabase(database: IDBDatabase) {
    this.db = database;
  }
}

// Auto-initialize when imported (but only in browser)
if (typeof window !== 'undefined') {
  // Check for emergency recovery on page load
  SnapshotIntegration.checkForEmergencyRecovery();
}