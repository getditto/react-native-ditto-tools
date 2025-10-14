import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import type { 
  ViewStyle, 
  TextStyle, 
} from 'react-native';

export interface QueryEditorViewStyles {
  container?: ViewStyle;
  input?: TextStyle;
  placeholder?: TextStyle;
}

interface QueryEditorViewProps {
  query: string;
  onQueryChange: (text: string) => void;
  style?: QueryEditorViewStyles;
}

const QueryEditorView: React.FC<QueryEditorViewProps> = ({
  query,
  onQueryChange,
  style,
}) => {
  const mergedStyles = {
    container: { ...styles.container, ...style?.container },
    input: { ...styles.input, ...style?.input },
  };

  return (
    <View style={mergedStyles.container}>
      <TextInput
        style={mergedStyles.input}
        value={query}
        onChangeText={onQueryChange}
        placeholder="e.g., SELECT * FROM collection"
        placeholderTextColor={style?.placeholder?.color || '#999'}
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="DQL Query Input"
        accessibilityHint="Enter your DQL query here"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    minHeight: 60,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export { QueryEditorView };