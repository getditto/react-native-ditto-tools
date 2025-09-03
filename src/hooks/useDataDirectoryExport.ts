import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { Ditto } from '@dittolive/ditto';
import { zip } from 'react-native-zip-archive';
import RNFS from 'react-native-fs';

interface UseDataDirectoryExportResult {
  exportDataDirectory: () => Promise<void>;
  isExporting: boolean;
  error: string | null;
  cleanupWarning: string | null;
}

export const useDataDirectoryExport = (ditto: Ditto): UseDataDirectoryExportResult => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cleanupWarning, setCleanupWarning] = useState<string | null>(null);

  /**
   * Extract the parent directory from Ditto's persistence directory path
   * to create a temp directory for the zip file
   */
  const getTempDirectory = useCallback((): string => {
    const persistenceDir = ditto.persistenceDirectory;
    
    // Handle both forward slash and backslash paths
    const pathSeparator = persistenceDir.includes('\\') ? '\\' : '/';
    const pathParts = persistenceDir.split(pathSeparator);
    
    // Remove the last directory to get to the parent app directory
    pathParts.pop();
    const parentDirectory = pathParts.join(pathSeparator);
    
    return parentDirectory;
  }, [ditto]);

  const exportDataDirectory = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);
      setCleanupWarning(null);
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const zipFileName = `ditto-data-${timestamp}.zip`;
      
      // Get paths
      const sourceDirectory = ditto.persistenceDirectory;
      const tempDirectory = getTempDirectory();
      const zipFilePath = `${tempDirectory}${tempDirectory.endsWith('/') ? '' : '/'}${zipFileName}`;
      
      console.log('Zipping data directory:', sourceDirectory);
      console.log('Output zip file:', zipFilePath);
      
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
            await RNFS.unlink(zipFilePath);
            console.log('Temp zip file cleaned up successfully:', zipFilePath);
          } catch (cleanupError) {
            // Don't throw cleanup errors - just warn the user
            const warningMessage = `Warning: Could not delete temporary file ${zipFileName}. You may need to manually clean it up to free disk space.`;
            setCleanupWarning(warningMessage);
            console.warn('Failed to clean up zip file:', cleanupError);
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
    cleanupWarning,
  };
};