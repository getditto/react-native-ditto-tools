import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import type { 
  ViewStyle, 
  TextStyle, 
  ListRenderItem 
} from 'react-native';
import type { QueryExecutionResult } from '../hooks/useQueryExecution';

export interface QueryResultsViewStyles {
  container?: ViewStyle;
  countText?: TextStyle;
  emptyText?: TextStyle;
  item?: ViewStyle;
  itemHeader?: ViewStyle;
  itemTitle?: TextStyle;
  itemPreview?: TextStyle;
  itemExpanded?: ViewStyle;
  itemJson?: TextStyle;
  expandIcon?: TextStyle;
}

interface QueryResultsViewProps {
  results: QueryExecutionResult | null;
  isLoading: boolean;
  error: string | null;
  style?: QueryResultsViewStyles;
}

interface ResultItem {
  id: string;
  data: any;
  jsonString: string;
  isExpanded: boolean;
  preview: string;
}

const QueryResultsView: React.FC<QueryResultsViewProps> = ({
  results,
  isLoading,
  error,
  style,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  const mergedStyles = {
    container: { ...styles.container, ...style?.container },
    countText: { ...styles.countText, ...style?.countText },
    emptyText: { ...styles.emptyText, ...style?.emptyText },
    item: { ...styles.item, ...style?.item },
    itemHeader: { ...styles.itemHeader, ...style?.itemHeader },
    itemTitle: { ...styles.itemTitle, ...style?.itemTitle },
    itemPreview: { ...styles.itemPreview, ...style?.itemPreview },
    itemExpanded: { ...styles.itemExpanded, ...style?.itemExpanded },
    itemJson: { ...styles.itemJson, ...style?.itemJson },
    expandIcon: { ...styles.expandIcon, ...style?.expandIcon },
  };

  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);

  // Generate optimized result items for FlatList
  const resultItems: ResultItem[] = React.useMemo(() => {
    if (!results || !results.items) return [];
    
    return results.items.map((item, index) => {
      const jsonString = JSON.stringify(item, null, 2);
      const preview = jsonString.length > 100 ? 
        jsonString.substring(0, 100) + '...' : 
        jsonString;
      
      // Generate a unique ID for each item
      const itemId = item._id || `item_${index}`;
      
      return {
        id: itemId,
        data: item,
        jsonString,
        isExpanded: expandedItems.has(itemId),
        preview,
      };
    });
  }, [results?.items, expandedItems]);

  // Optimized renderItem with getItemLayout for performance
  const renderItem: ListRenderItem<ResultItem> = useCallback(({ item }) => {
    const isExpanded = expandedItems.has(item.id);
    
    return (
      <View style={mergedStyles.item}>
        <Pressable 
          style={mergedStyles.itemHeader}
          onPress={() => toggleExpanded(item.id)}
        >
          <Text style={mergedStyles.itemTitle}>
            {item.id}
          </Text>
          <Text style={mergedStyles.expandIcon}>
            {isExpanded ? '▲' : '▼'}
          </Text>
        </Pressable>
        
        {!isExpanded && (
          <Text style={mergedStyles.itemPreview} numberOfLines={2}>
            {item.preview}
          </Text>
        )}
        
        {isExpanded && (
          <View style={mergedStyles.itemExpanded}>
            <Text style={mergedStyles.itemJson}>
              {item.jsonString}
            </Text>
          </View>
        )}
      </View>
    );
  }, [expandedItems, mergedStyles, toggleExpanded]);

  // Performance optimization: provide getItemLayout for FlatList
  const getItemLayout = useCallback((data: any, index: number) => {
    const isExpanded = data && expandedItems.has(data[index]?.id);
    const itemHeight = isExpanded ? 200 : 80; // Estimated heights
    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }, [expandedItems]);

  const keyExtractor = useCallback((item: ResultItem) => item.id, []);

  // Handle loading state
  if (isLoading) {
    return (
      <View style={mergedStyles.container}>
        <Text style={mergedStyles.emptyText}>⏳ Executing query...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={mergedStyles.container}>
        <Text style={[mergedStyles.emptyText, { color: '#ff3b30' }]}>
          ⚠️ {error}
        </Text>
      </View>
    );
  }

  // Handle no results yet
  if (!results) {
    return (
      <View style={mergedStyles.container}>
        <Text style={mergedStyles.emptyText}>
          No results yet. Enter a query and press the play button.
        </Text>
      </View>
    );
  }

  // Handle mutating queries
  if (results.isMutatingQuery) {
    return (
      <View style={mergedStyles.container}>
        <Text style={mergedStyles.countText}>
          Mutation completed: {results.totalCount} documents affected
        </Text>
        {results.mutatedDocumentIDs && results.mutatedDocumentIDs.length > 0 && (
          <View style={mergedStyles.item}>
            <Text style={mergedStyles.itemTitle}>Mutated Document IDs:</Text>
            <Text style={mergedStyles.itemJson}>
              {JSON.stringify(results.mutatedDocumentIDs, null, 2)}
            </Text>
          </View>
        )}
        {results.commitID && (
          <View style={mergedStyles.item}>
            <Text style={mergedStyles.itemTitle}>Commit ID:</Text>
            <Text style={mergedStyles.itemJson}>{results.commitID}</Text>
          </View>
        )}
      </View>
    );
  }

  // Handle empty SELECT results
  if (results.totalCount === 0) {
    return (
      <View style={mergedStyles.container}>
        <Text style={mergedStyles.emptyText}>No results found.</Text>
      </View>
    );
  }

  // Render SELECT results with performance optimizations
  return (
    <View style={mergedStyles.container}>
      <Text style={mergedStyles.countText}>
        Results: {results.totalCount} total items
      </Text>
      <FlatList
        data={resultItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={true}
        style={styles.resultsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
    fontStyle: 'italic',
  },
  resultsList: {
    flex: 1,
  },
  item: {
    backgroundColor: '#ffffff',
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    fontFamily: 'monospace',
  },
  itemPreview: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  itemExpanded: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
  },
  itemJson: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 14,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export { QueryResultsView };