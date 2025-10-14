import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import type { Ditto, QueryResult, QueryResultItem } from '@dittolive/ditto';
import { unlink, exists, mkdir, writeFile, TemporaryDirectoryPath } from '@dr.pogodin/react-native-fs';

export interface QueryExecutionResult {
  items?: Array<any>;
  mutatedDocumentIDs?: Array<any>;
  commitID?: string;
  totalCount: number;
  isMutatingQuery: boolean;
}

export interface UseQueryExecutionResult {
  executeQuery: (query: string) => Promise<void>;
  results: QueryExecutionResult | null;
  isLoading: boolean;
  error: string | null;
  exportResults: () => Promise<void>;
  isExporting: boolean;
  clearResults: () => void;
}

export const useQueryExecution = (ditto: Ditto): UseQueryExecutionResult => {
  const [results, setResults] = useState<QueryExecutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [_cachedJsonStrings, setCachedJsonStrings] = useState<Map<number, string>>(new Map());

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setCachedJsonStrings(new Map());
  }, []);

  const executeQuery = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a valid DQL statement');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setCachedJsonStrings(new Map());

      // Execute the query without arguments
      const queryResult: QueryResult = await ditto.store.execute(query);

      // Check if this is a mutating query
      let mutatedIDs: Array<any> | undefined;
      try {
        // Try to get mutated document IDs (will be undefined for SELECT queries)
        mutatedIDs = queryResult.mutatedDocumentIDs();
      } catch {
        // Not a mutating query
      }

      const isMutatingQuery = mutatedIDs !== undefined;

      if (isMutatingQuery) {
        // For mutating queries, show the mutated IDs and commit ID
        setResults({
          mutatedDocumentIDs: mutatedIDs,
          commitID: undefined, // commitID not available in current Ditto version
          totalCount: mutatedIDs?.length || 0,
          isMutatingQuery: true,
        });
      } else {
        // For SELECT queries, process the items
        const items = queryResult.items || [];
        const processedItems: Array<any> = [];
        const jsonCache = new Map<number, string>();

        // Process items efficiently
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as QueryResultItem;
          
          // Get the JSON string for caching
          const jsonString = item.jsonString();
          jsonCache.set(i, jsonString);
          
          // Parse the JSON for the processed item
          try {
            const parsed = JSON.parse(jsonString);
            processedItems.push(parsed);
          } catch {
            // If JSON parsing fails, use the raw value
            processedItems.push(item.value);
          }

          // Dematerialize to free memory
          try {
            item.dematerialize();
          } catch (error) {
            console.warn('Failed to dematerialize item:', error);
          }
        }

        setCachedJsonStrings(jsonCache);
        setResults({
          items: processedItems,
          totalCount: processedItems.length,
          isMutatingQuery: false,
        });
      }

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
      setResults(null);
    }
  }, [ditto]);

  const getAppWritableDirectory = useCallback((): string => {
    return TemporaryDirectoryPath;
  }, []);

  const exportResults = useCallback(async (): Promise<void> => {
    if (!results) {
      setError('No results to export');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `query-results-${timestamp}.json`;
      
      const appDirectory = getAppWritableDirectory();
      const tempFilePath = `${appDirectory}${appDirectory.endsWith('/') ? '' : '/'}${fileName}`;
      
      // Ensure the target directory exists
      const directoryExists = await exists(appDirectory);
      if (!directoryExists) {
        try {
          await mkdir(appDirectory);
        } catch (mkdirError) {
          throw new Error(`Failed to create directory: ${mkdirError instanceof Error ? mkdirError.message : 'Unknown error'}`);
        }
      }

      // Prepare the export data
      let exportData: any;
      if (results.isMutatingQuery) {
        exportData = {
          type: 'mutation',
          mutatedDocumentIDs: results.mutatedDocumentIDs,
          commitID: results.commitID,
          totalMutated: results.totalCount,
        };
      } else {
        // Use cached JSON strings for better performance
        const items = results.items || [];
        exportData = {
          type: 'query',
          totalCount: results.totalCount,
          items: items,
        };
      }

      // Write the JSON to a temporary file
      await writeFile(tempFilePath, JSON.stringify(exportData, null, 2), 'utf8');

      // Share the file using React Native's built-in Share API
      await Share.share({
        url: `file://${tempFilePath}`,
        message: 'Query results export',
        title: fileName,
      });

      // Clean up the temp file
      try {
        await unlink(tempFilePath);
      } catch {
        // Ignore cleanup errors
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export results';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, [results, getAppWritableDirectory]);

  return {
    executeQuery,
    results,
    isLoading,
    error,
    exportResults,
    isExporting,
    clearResults,
  };
};