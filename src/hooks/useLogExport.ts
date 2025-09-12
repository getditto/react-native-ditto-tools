import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { Ditto, Logger } from '@dittolive/ditto';
import { unlink, exists, mkdir, TemporaryDirectoryPath } from '@dr.pogodin/react-native-fs';

interface UseLogExportResult {
  exportLogs: () => Promise<void>;
  isExporting: boolean;
  error: string | null;
}

export const useLogExport = (ditto: Ditto): UseLogExportResult => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Use the system's temporary directory for creating log files
   * This ensures we have a writable location that exists
   */
  const getAppWritableDirectory = useCallback((): string => {
    return TemporaryDirectoryPath;
  }, []);

  const exportLogs = useCallback(async (): Promise<void> => {
    try {
      setIsExporting(true);
      setError(null);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `ditto-logs-${timestamp}.json`;
      
      // Use Ditto's persistence directory to derive a writable path
      const appDirectory = getAppWritableDirectory();
      const tempFilePath = `${appDirectory}${appDirectory.endsWith('/') ? '' : '/'}${fileName}`;
      
      // Ensure the target directory exists
      const directoryExists = await exists(appDirectory);
      if (!directoryExists) {
        try {
          await mkdir(appDirectory);
        } catch (mkdirError) {
          throw new Error(`Failed to create directory ${appDirectory}: ${mkdirError instanceof Error ? mkdirError.message : 'Unknown error'}`);
        }
      }
      
      let tempFileCreated = false;
      
      try {
        const bytesWritten = await Logger.exportToFile(tempFilePath);
        if (bytesWritten === 0) {
          throw new Error('No logs were exported');
        }
        tempFileCreated = true;

        // Share the file using React Native's built-in Share API
        await Share.share({
          url: `file://${tempFilePath}`,
          message: 'Ditto logs export',
          title: fileName,
        });
        
      } catch (exportError) {
        throw new Error(`Failed to export logs: ${exportError instanceof Error ? exportError.message : 'Unknown error'}`);
      } finally {
        // Always clean up the temp file
        if (tempFileCreated) {
          try {
            await unlink(tempFilePath);
          } catch (cleanupError) {
            // Re-throw cleanup errors to ensure they're not silently swallowed
            throw new Error(`Failed to clean up temp file: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown error'}`);
          }
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export logs';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, [ditto]);

  return {
    exportLogs,
    isExporting,
    error,
  };
};