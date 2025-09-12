import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { Ditto } from '@dittolive/ditto';
import { zip } from 'react-native-zip-archive';
import { unlink, exists, mkdir, TemporaryDirectoryPath, DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';

interface UseDataDirectoryExportResult {
  exportDataDirectory: () => Promise<void>;
  isExporting: boolean;
  error: string | null;
}

export const useDataDirectoryExport = (ditto: Ditto): UseDataDirectoryExportResult => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Use the system's temporary directory for creating zip files
   * This ensures we have a writable location that exists
   */
  const getTempDirectory = useCallback((): string => {
    return TemporaryDirectoryPath;
  }, []);

  const exportDataDirectory = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const zipFileName = `ditto-data-${timestamp}.zip`;
      
      // Get paths - resolve relative Ditto path to absolute path
      const relativePersistenceDir = ditto.persistenceDirectory;
      const sourceDirectory = relativePersistenceDir.startsWith('/') 
        ? relativePersistenceDir 
        : `${DocumentDirectoryPath}/${relativePersistenceDir}`;
      const tempDirectory = getTempDirectory();
      const zipFilePath = `${tempDirectory}${tempDirectory.endsWith('/') ? '' : '/'}${zipFileName}`;
      
      // Note: Skip source directory validation since disk usage data proves Ditto DB exists
      // The react-native-zip-archive library will handle source path validation internally
      
      // Ensure the target directory exists
      const directoryExists = await exists(tempDirectory);
      if (!directoryExists) {
        try {
          await mkdir(tempDirectory);
        } catch (mkdirError) {
          throw new Error(`Failed to create directory ${tempDirectory}: ${mkdirError instanceof Error ? mkdirError.message : 'Unknown error'}`);
        }
      }
      
      let zipCreated = false;
      
      try {
        // Zip the data directory - this could take several seconds for large databases
        await zip(sourceDirectory, zipFilePath);
        zipCreated = true;
        
        // Share the zip file using React Native's built-in Share API
        await Share.share({
          url: `file://${zipFilePath}`,
          message: 'Ditto data directory export',
          title: zipFileName,
        });
        
      } catch (zipError) {
        throw new Error(`Failed to export data directory: ${zipError instanceof Error ? zipError.message : 'Unknown error'}`);
      } finally {
        // Always attempt to clean up the zip file
        if (zipCreated) {
          try {
            await unlink(zipFilePath);
          } catch (cleanupError) {
            // Throw cleanup errors so developers know about manual cleanup needed
            throw new Error(`Failed to delete temporary zip file at ${zipFilePath}. You may need to manually delete this file to free disk space. Original cleanup error: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown error'}`);
          }
        }
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export data directory';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, [ditto, getTempDirectory]);

  return {
    exportDataDirectory,
    isExporting,
    error,
  };
};