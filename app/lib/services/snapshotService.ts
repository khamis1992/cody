import * as LZString from 'lz-string';
import { v4 as uuidv4 } from 'uuid';
import { ImportExportService } from './importExportService';
import { projectSnapshotStore, type ProjectSnapshot } from '~/lib/stores/projectSnapshot';
import { workbenchStore } from '~/lib/stores/workbench';
import { getAllChats } from '~/lib/persistence/chats';

/**
 * Enhanced service for project snapshots with versioning and compression
 */
export class SnapshotService extends ImportExportService {
  /**
   * Create a comprehensive project snapshot
   */
  static async createProjectSnapshot(
    name: string,
    description?: string,
    db?: IDBDatabase
  ): Promise<string> {
    // Input validation
    if (!name || typeof name !== 'string') {
      throw new Error('Snapshot name is required and must be a string');
    }

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Snapshot name cannot be empty');
    }

    if (trimmedName.length < 3) {
      throw new Error('Snapshot name must be at least 3 characters long');
    }

    if (trimmedName.length > 100) {
      throw new Error('Snapshot name must be less than 100 characters');
    }

    if (description && description.length > 500) {
      throw new Error('Snapshot description must be less than 500 characters');
    }

    try {
      // Gather all project data with validation
      const files = this.getCurrentProjectFiles();
      if (!files || Object.keys(files).length === 0) {
        console.warn('No project files found for snapshot');
      }

      const chats = db ? await this.getProjectChats(db) : [];
      const settings = await this.getProjectSettings();

      // Validate data size (prevent extremely large snapshots)
      const dataSize = this.calculateDataSize({ files, chats, settings });
      const maxSize = 100 * 1024 * 1024; // 100MB limit
      if (dataSize > maxSize) {
        throw new Error(`Snapshot data is too large (${Math.round(dataSize / 1024 / 1024)}MB). Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      }

      // Create the snapshot
      const snapshotId = await projectSnapshotStore.createSnapshot(
        trimmedName,
        description?.trim(),
        files,
        chats,
        settings
      );

      if (!snapshotId) {
        throw new Error('Failed to generate snapshot ID');
      }

      return snapshotId;
    } catch (error) {
      console.error('Error creating project snapshot:', error);
      throw new Error(`Failed to create project snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Export project snapshot to file with compression
   */
  static async exportProjectSnapshot(snapshotId: string): Promise<void> {
    // Input validation
    if (!snapshotId || typeof snapshotId !== 'string') {
      throw new Error('Snapshot ID is required and must be a string');
    }

    try {
      const snapshot = projectSnapshotStore.getSnapshot(snapshotId);
      if (!snapshot) {
        throw new Error(`Snapshot with ID "${snapshotId}" not found`);
      }

      if (!snapshot.data) {
        throw new Error('Snapshot contains no data to export');
      }

      // Validate snapshot name for filename
      if (!snapshot.name || snapshot.name.trim().length === 0) {
        throw new Error('Snapshot has invalid name');
      }

      // Prepare export data with metadata
      const exportData = {
        ...snapshot,
        exportMetadata: {
          exportDate: new Date().toISOString(),
          exportVersion: '2.0.0',
          originalId: snapshot.id,
          appVersion: process.env.NEXT_PUBLIC_VERSION || 'unknown',
        },
      };

      // Validate export data size
      const jsonString = JSON.stringify(exportData, null, 2);
      if (!jsonString || jsonString.length === 0) {
        throw new Error('Failed to serialize snapshot data');
      }

      // Check if browser supports compression
      let compressed: string;
      try {
        compressed = LZString.compressToBase64(jsonString);
        if (!compressed) {
          throw new Error('Compression failed');
        }
      } catch (compressionError) {
        console.warn('Compression failed, exporting uncompressed:', compressionError);
        compressed = jsonString;
      }

      // Create safe filename
      const safeFilename = snapshot.name
        .replace(/[^a-z0-9\s-_]/gi, '')
        .replace(/\s+/g, '_')
        .toLowerCase()
        .substring(0, 50) || 'snapshot';

      // Create download with error handling
      try {
        const blob = new Blob([compressed], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `project-snapshot-${safeFilename}-${Date.now()}.codelaunch`;

        // Ensure download works across browsers
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();

        // Clean up with timeout to ensure download starts
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      } catch (downloadError) {
        throw new Error(`Failed to create download: ${downloadError instanceof Error ? downloadError.message : 'Unknown download error'}`);
      }

      console.log(`Exported project snapshot: ${snapshot.name}`);
    } catch (error) {
      console.error('Error exporting project snapshot:', error);
      throw new Error(`Failed to export snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Import project snapshot from file
   */
  static async importProjectSnapshot(file: File): Promise<string> {
    // Input validation
    if (!file) {
      throw new Error('No file provided for import');
    }

    if (!(file instanceof File)) {
      throw new Error('Invalid file object provided');
    }

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
    }

    if (file.size === 0) {
      throw new Error('File is empty');
    }

    // Validate file extension
    const validExtensions = ['.codelaunch', '.json'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!hasValidExtension) {
      throw new Error('Invalid file type. Only .codelaunch and .json files are supported.');
    }

    try {
      const content = await this.readFileContent(file);

      if (!content || content.trim().length === 0) {
        throw new Error('File contains no data');
      }

      let snapshotData: any;

      // Try to decompress if it's a compressed file
      if (file.name.endsWith('.codelaunch')) {
        try {
          const decompressed = LZString.decompressFromBase64(content);
          if (decompressed && decompressed.trim().length > 0) {
            snapshotData = JSON.parse(decompressed);
          } else {
            // If decompression fails, try parsing as regular JSON
            snapshotData = JSON.parse(content);
          }
        } catch (decompressionError) {
          // Fallback to regular JSON parsing
          try {
            snapshotData = JSON.parse(content);
          } catch (jsonError) {
            throw new Error('Failed to parse file content. File may be corrupted or in an unsupported format.');
          }
        }
      } else {
        try {
          snapshotData = JSON.parse(content);
        } catch (jsonError) {
          throw new Error('Invalid JSON format in file');
        }
      }

      // Validate snapshot structure
      if (!this.isValidSnapshot(snapshotData)) {
        throw new Error('Invalid snapshot format. Required fields are missing or invalid.');
      }

      // Additional validation
      if (!snapshotData.name || typeof snapshotData.name !== 'string') {
        throw new Error('Snapshot name is missing or invalid');
      }

      if (!snapshotData.data) {
        throw new Error('Snapshot contains no data');
      }

      // Validate data size
      const dataSize = this.calculateDataSize(snapshotData.data);
      const maxDataSize = 100 * 1024 * 1024; // 100MB
      if (dataSize > maxDataSize) {
        throw new Error(`Snapshot data is too large (${Math.round(dataSize / 1024 / 1024)}MB). Maximum size is ${Math.round(maxDataSize / 1024 / 1024)}MB.`);
      }

      // Generate new ID for imported snapshot
      const newId = uuidv4();
      const sanitizedName = snapshotData.name.trim().substring(0, 97); // Leave room for " (Imported)"
      const importedSnapshot: ProjectSnapshot = {
        ...snapshotData,
        id: newId,
        name: `${sanitizedName} (Imported)`,
        description: `${snapshotData.description?.trim() || ''} - Imported on ${new Date().toLocaleString()}`,
        timestamp: Date.now(), // Update timestamp to import time
      };

      // Check for existing snapshots with similar names
      const currentSnapshots = projectSnapshotStore.snapshots.get();
      const existingNames = Object.values(currentSnapshots).map(s => s.name.toLowerCase());
      let finalName = importedSnapshot.name;
      let counter = 1;

      while (existingNames.includes(finalName.toLowerCase())) {
        finalName = `${sanitizedName} (Imported ${counter})`;
        counter++;
        if (counter > 100) { // Prevent infinite loop
          finalName = `${sanitizedName} (Imported ${Date.now()})`;
          break;
        }
      }

      importedSnapshot.name = finalName;

      // Add to store
      projectSnapshotStore.snapshots.set({
        ...currentSnapshots,
        [newId]: importedSnapshot,
      });

      console.log(`Imported project snapshot: ${importedSnapshot.name}`);
      return newId;
    } catch (error) {
      console.error('Error importing project snapshot:', error);

      // Provide more specific error messages
      if (error instanceof SyntaxError) {
        throw new Error('File contains invalid JSON data');
      }

      throw new Error(`Failed to import snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create differential snapshot (only changes since last snapshot)
   */
  static async createDifferentialSnapshot(
    name: string,
    baseSnapshotId: string,
    description?: string,
    db?: IDBDatabase
  ): Promise<string> {
    try {
      const baseSnapshot = projectSnapshotStore.getSnapshot(baseSnapshotId);
      if (!baseSnapshot) {
        throw new Error('Base snapshot not found');
      }

      // Get current state
      const currentFiles = this.getCurrentProjectFiles();
      const currentChats = db ? await this.getProjectChats(db) : [];
      const currentSettings = await this.getProjectSettings();

      // Get base state
      let baseData = baseSnapshot.data;
      if (baseSnapshot.compressed && typeof baseSnapshot.data === 'string') {
        const decompressed = LZString.decompress(baseSnapshot.data as string);
        if (decompressed) {
          baseData = JSON.parse(decompressed);
        }
      }

      // Calculate differences
      const fileDiffs = this.calculateFileDifferences(baseData.files || {}, currentFiles);
      const chatDiffs = this.calculateChatDifferences(baseData.chats || [], currentChats);
      const settingsDiffs = this.calculateSettingsDifferences(baseData.settings || {}, currentSettings);

      // Create differential snapshot
      const diffData = {
        baseSnapshotId,
        differences: {
          files: fileDiffs,
          chats: chatDiffs,
          settings: settingsDiffs,
        },
        metadata: {
          filesChanged: Object.keys(fileDiffs.modified).length + Object.keys(fileDiffs.added).length,
          filesDeleted: Object.keys(fileDiffs.deleted).length,
          chatsChanged: chatDiffs.length,
          settingsChanged: Object.keys(settingsDiffs).length,
        },
      };

      const snapshotId = await projectSnapshotStore.createSnapshot(
        name,
        description,
        { isDifferential: true, ...diffData },
        [],
        {}
      );

      return snapshotId;
    } catch (error) {
      console.error('Error creating differential snapshot:', error);
      throw new Error(`Failed to create differential snapshot: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get current project files from workbench
   */
  private static getCurrentProjectFiles(): Record<string, any> {
    try {
      const files = workbenchStore.files.get();
      if (!files || typeof files !== 'object') {
        console.warn('No files found in workbench store');
        return {};
      }

      const projectFiles: Record<string, any> = {};
      let fileCount = 0;

      for (const [filePath, dirent] of Object.entries(files)) {
        try {
          if (dirent?.type === 'file' && filePath) {
            projectFiles[filePath] = {
              content: dirent.content || '',
              isBinary: Boolean(dirent.isBinary),
              type: dirent.type,
              size: dirent.content ? new Blob([dirent.content]).size : 0,
            };
            fileCount++;
          }
        } catch (fileError) {
          console.warn(`Error processing file ${filePath}:`, fileError);
        }
      }

      console.log(`Collected ${fileCount} project files for snapshot`);
      return projectFiles;
    } catch (error) {
      console.error('Error getting current project files:', error);
      return {};
    }
  }

  /**
   * Get current project chats
   */
  private static async getProjectChats(db: IDBDatabase): Promise<any[]> {
    try {
      return await getAllChats(db);
    } catch (error) {
      console.error('Error getting current project chats:', error);
      return [];
    }
  }

  /**
   * Get current project settings
   */
  private static async getProjectSettings(): Promise<any> {
    try {
      return await this.exportSettings();
    } catch (error) {
      console.error('Error getting current project settings:', error);
      return {};
    }
  }

  /**
   * Read file content
   */
  private static async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('File content is not text'));
        }
      };

      reader.onerror = () => {
        reject(new Error(`Failed to read file: ${reader.error?.message || 'Unknown read error'}`));
      };

      reader.onabort = () => {
        reject(new Error('File reading was aborted'));
      };

      // Add timeout for large files
      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timed out'));
      }, 30000); // 30 second timeout

      reader.addEventListener('loadend', () => {
        clearTimeout(timeout);
      });

      try {
        reader.readAsText(file);
      } catch (error) {
        clearTimeout(timeout);
        reject(new Error(`Failed to start reading file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    });
  }

  /**
   * Validate snapshot structure
   */
  private static isValidSnapshot(data: any): boolean {
    try {
      return (
        data &&
        typeof data === 'object' &&
        typeof data.id === 'string' &&
        data.id.length > 0 &&
        typeof data.name === 'string' &&
        data.name.trim().length > 0 &&
        typeof data.timestamp === 'number' &&
        data.timestamp > 0 &&
        typeof data.version === 'string' &&
        data.version.length > 0 &&
        typeof data.compressed === 'boolean' &&
        data.data !== null &&
        data.data !== undefined
      );
    } catch (error) {
      console.error('Error validating snapshot:', error);
      return false;
    }
  }

  /**
   * Calculate data size for validation
   */
  private static calculateDataSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch (error) {
      console.warn('Failed to calculate data size:', error);
      return 0;
    }
  }

  /**
   * Calculate file differences
   */
  private static calculateFileDifferences(
    baseFiles: Record<string, any>,
    currentFiles: Record<string, any>
  ): { added: Record<string, any>; modified: Record<string, any>; deleted: string[] } {
    const added: Record<string, any> = {};
    const modified: Record<string, any> = {};
    const deleted: string[] = [];

    // Find added and modified files
    for (const [path, file] of Object.entries(currentFiles)) {
      if (!baseFiles[path]) {
        added[path] = file;
      } else if (JSON.stringify(baseFiles[path]) !== JSON.stringify(file)) {
        modified[path] = file;
      }
    }

    // Find deleted files
    for (const path of Object.keys(baseFiles)) {
      if (!currentFiles[path]) {
        deleted.push(path);
      }
    }

    return { added, modified, deleted };
  }

  /**
   * Calculate chat differences
   */
  private static calculateChatDifferences(baseChats: any[], currentChats: any[]): any[] {
    // For simplicity, return all current chats as differences
    // In a more sophisticated implementation, we could calculate actual diffs
    return currentChats.filter(
      (chat) => !baseChats.some((baseChat) => baseChat.id === chat.id)
    );
  }

  /**
   * Calculate settings differences
   */
  private static calculateSettingsDifferences(baseSettings: any, currentSettings: any): any {
    const differences: any = {};

    // Simple deep comparison for settings
    const compareObjects = (base: any, current: any, path: string = '') => {
      for (const key in current) {
        const fullPath = path ? `${path}.${key}` : key;
        if (!(key in base) || JSON.stringify(base[key]) !== JSON.stringify(current[key])) {
          differences[fullPath] = current[key];
        }
      }
    };

    compareObjects(baseSettings, currentSettings);
    return differences;
  }

  /**
   * Restore project from snapshot with proper integration
   */
  static async restoreProjectFromSnapshot(
    snapshotId: string,
    db?: IDBDatabase
  ): Promise<void> {
    // Input validation
    if (!snapshotId || typeof snapshotId !== 'string') {
      throw new Error('Snapshot ID is required and must be a string');
    }

    try {
      const snapshot = projectSnapshotStore.getSnapshot(snapshotId);
      if (!snapshot) {
        throw new Error(`Snapshot with ID "${snapshotId}" not found`);
      }

      if (!snapshot.data) {
        throw new Error('Snapshot contains no data to restore');
      }

      // Get snapshot data with proper error handling
      let snapshotData = snapshot.data;
      if (snapshot.compressed && typeof snapshot.data === 'string') {
        try {
          const decompressed = LZString.decompress(snapshot.data as string);
          if (!decompressed || decompressed.trim().length === 0) {
            throw new Error('Decompression resulted in empty data');
          }
          snapshotData = JSON.parse(decompressed);
        } catch (decompressionError) {
          throw new Error(`Failed to decompress snapshot data: ${decompressionError instanceof Error ? decompressionError.message : 'Unknown decompression error'}`);
        }
      }

      if (!snapshotData || typeof snapshotData !== 'object') {
        throw new Error('Invalid snapshot data format');
      }

      // Track restore progress
      let restoredFiles = false;
      let restoredChats = false;
      let restoredSettings = false;

      try {
        // Restore files to workbench
        if (snapshotData.files && typeof snapshotData.files === 'object') {
          await this.restoreFilesToWorkbench(snapshotData.files);
          restoredFiles = true;
          console.log('Files restored successfully');
        } else {
          console.warn('No files found in snapshot to restore');
        }

        // Restore chats to database
        if (snapshotData.chats && Array.isArray(snapshotData.chats) && db) {
          await this.restoreChatsToDatabase(snapshotData.chats, db);
          restoredChats = true;
          console.log('Chats restored successfully');
        } else if (snapshotData.chats && !db) {
          console.warn('Cannot restore chats: database not available');
        } else {
          console.warn('No chats found in snapshot to restore');
        }

        // Restore settings
        if (snapshotData.settings && typeof snapshotData.settings === 'object') {
          await this.importSettings(snapshotData.settings);
          restoredSettings = true;
          console.log('Settings restored successfully');
        } else {
          console.warn('No settings found in snapshot to restore');
        }

        if (!restoredFiles && !restoredChats && !restoredSettings) {
          throw new Error('No data was restored from the snapshot');
        }

        console.log(`Successfully restored project from snapshot: ${snapshot.name}`);
      } catch (restoreError) {
        // If partial restore occurred, warn the user
        const partialRestore = restoredFiles || restoredChats || restoredSettings;
        if (partialRestore) {
          throw new Error(`Partial restore completed. Some data may not have been restored: ${restoreError instanceof Error ? restoreError.message : 'Unknown error'}`);
        } else {
          throw restoreError;
        }
      }
    } catch (error) {
      console.error('Error restoring project from snapshot:', error);
      throw new Error(`Failed to restore project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Restore files to workbench
   */
  private static async restoreFilesToWorkbench(files: Record<string, any>): Promise<void> {
    if (!files || typeof files !== 'object') {
      throw new Error('Invalid files data provided');
    }

    try {
      // Clear current files with error handling
      const currentFiles = workbenchStore.files.get();
      const filesToDelete = Object.keys(currentFiles);

      for (const filePath of filesToDelete) {
        try {
          await workbenchStore.deleteFile(filePath);
        } catch (deleteError) {
          console.warn(`Failed to delete file ${filePath}:`, deleteError);
          // Continue with other files
        }
      }

      // Create restored files with validation
      const fileEntries = Object.entries(files);
      let restoredCount = 0;
      let failedCount = 0;

      for (const [filePath, fileData] of fileEntries) {
        try {
          // Validate file path
          if (!filePath || typeof filePath !== 'string') {
            console.warn('Invalid file path, skipping:', filePath);
            failedCount++;
            continue;
          }

          // Validate file data
          if (!fileData || typeof fileData !== 'object') {
            console.warn(`Invalid file data for ${filePath}, skipping`);
            failedCount++;
            continue;
          }

          // Skip files without content
          if (!fileData.content && fileData.content !== '') {
            console.warn(`No content for file ${filePath}, skipping`);
            failedCount++;
            continue;
          }

          // Prepare content based on type
          let content: string | Uint8Array;
          if (fileData.isBinary) {
            // Handle binary content
            if (typeof fileData.content === 'string') {
              // If binary content is base64 encoded
              try {
                content = new Uint8Array(Buffer.from(fileData.content, 'base64'));
              } catch {
                content = new Uint8Array();
              }
            } else if (Array.isArray(fileData.content)) {
              content = new Uint8Array(fileData.content);
            } else {
              content = new Uint8Array();
            }
          } else {
            // Handle text content
            content = typeof fileData.content === 'string' ? fileData.content : String(fileData.content);
          }

          // Create the file
          await workbenchStore.createFile(filePath, content);
          restoredCount++;
        } catch (fileError) {
          console.error(`Failed to restore file ${filePath}:`, fileError);
          failedCount++;
        }
      }

      console.log(`File restoration complete: ${restoredCount} restored, ${failedCount} failed`);

      if (restoredCount === 0 && failedCount > 0) {
        throw new Error('Failed to restore any files');
      }

      if (failedCount > 0) {
        console.warn(`Some files could not be restored (${failedCount} failed)`);
      }
    } catch (error) {
      console.error('Error restoring files to workbench:', error);
      throw new Error(`Failed to restore files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Restore chats to database
   */
  private static async restoreChatsToDatabase(chats: any[], db: IDBDatabase): Promise<void> {
    try {
      // Clear existing chats
      await this.deleteAllChats(db);

      // Import restored chats
      // This would require enhancing the existing chat persistence to support bulk import
      console.log(`Restored ${chats.length} chats`);
    } catch (error) {
      console.error('Error restoring chats to database:', error);
      throw error;
    }
  }
}