import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import type { ViewStyle } from 'react-native';
import type { Ditto } from '@dittolive/ditto';
import { QueryEditorView, type QueryEditorViewStyles } from './QueryEditorView';
import { QueryResultsView, type QueryResultsViewStyles } from './QueryResultsView';
import { QueryHeaderView, type QueryHeaderViewStyles } from './QueryHeaderView';
import { useQueryExecution } from '../hooks/useQueryExecution';

// Main style interface that combines all sub-component styles
export interface QueryEditorStyles {
  container?: ViewStyle;
  header?: QueryHeaderViewStyles;
  editor?: QueryEditorViewStyles;
  results?: QueryResultsViewStyles;
}

interface QueryEditorProps {
  ditto: Ditto;
  style?: QueryEditorStyles;
}

// Main QueryEditor component with full functionality
const QueryEditor: React.FC<QueryEditorProps> = ({
  ditto,
  style,
}) => {
  const [query, setQuery] = useState('');
  
  // Use the query execution hook for all DQL operations
  const {
    executeQuery,
    results,
    isLoading,
    error,
    exportResults,
    isExporting,
    clearResults,
  } = useQueryExecution(ditto);
  
  const mergedStyles = {
    container: { ...styles.container, ...style?.container },
  };

  // Handle query execution
  const handleExecute = async () => {
    if (!query.trim()) return;
    
    try {
      await executeQuery(query.trim());
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle results export
  const handleShare = async () => {
    if (!results) return;
    
    try {
      await exportResults();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Handle query reset
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    // Clear results when query changes significantly
    if (results && newQuery.trim() !== query.trim()) {
      clearResults();
    }
  };

  // Determine button states
  const canExecute = query.trim().length > 0 && !isLoading;
  const canShare = results !== null && !isExporting;

  return (
    <View style={mergedStyles.container}>
      <QueryHeaderView
        onExecute={handleExecute}
        onShare={handleShare}
        isExecuting={isLoading}
        isSharing={isExporting}
        canExecute={canExecute}
        canShare={canShare}
        error={error}
        style={style?.header}
      />
      <QueryEditorView 
        query={query}
        onQueryChange={handleQueryChange}
        style={style?.editor}
      />
      <QueryResultsView
        results={results}
        isLoading={isLoading}
        error={error}
        style={style?.results}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
});

export { QueryEditor };