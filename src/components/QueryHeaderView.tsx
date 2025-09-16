import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { 
  ViewStyle, 
  TextStyle, 
} from 'react-native';

export interface QueryHeaderViewStyles {
  container?: ViewStyle;
  label?: TextStyle;
  button?: ViewStyle;
  buttonText?: TextStyle;
  buttonDisabled?: ViewStyle;
  buttonsContainer?: ViewStyle;
  errorContainer?: ViewStyle;
  errorText?: TextStyle;
}

interface QueryHeaderViewProps {
  onExecute: () => void;
  onShare: () => void;
  isExecuting: boolean;
  isSharing: boolean;
  canExecute: boolean;
  canShare: boolean;
  error?: string | null;
  style?: QueryHeaderViewStyles;
}

const QueryHeaderView: React.FC<QueryHeaderViewProps> = ({
  onExecute,
  onShare,
  isExecuting,
  isSharing,
  canExecute,
  canShare,
  error,
  style,
}) => {
  const mergedStyles = {
    container: { ...styles.container, ...style?.container },
    label: { ...styles.label, ...style?.label },
    buttonsContainer: { ...styles.buttonsContainer, ...style?.buttonsContainer },
    button: { ...styles.button, ...style?.button },
    buttonText: { ...styles.buttonText, ...style?.buttonText },
    buttonDisabled: { ...styles.buttonDisabled, ...style?.buttonDisabled },
    errorContainer: { ...styles.errorContainer, ...style?.errorContainer },
    errorText: { ...styles.errorText, ...style?.errorText },
  };

  return (
    <View style={mergedStyles.container}>
      {/* Header with label and buttons */}
      <View style={mergedStyles.buttonsContainer}>
        <Text style={mergedStyles.label}>Enter DQL Statement:</Text>
        
        <View style={styles.buttonGroup}>
          {/* Share Button */}
          <Pressable 
            style={[
              mergedStyles.button,
              styles.shareButton,
              (!canShare || isSharing) && mergedStyles.buttonDisabled,
            ]}
            onPress={onShare}
            disabled={!canShare || isSharing}
          >
            <Text style={mergedStyles.buttonText}>
              {isSharing ? '📤' : '📤'}
            </Text>
          </Pressable>
          
          {/* Execute Button */}
          <Pressable 
            style={[
              mergedStyles.button,
              styles.executeButton,
              (!canExecute || isExecuting) && mergedStyles.buttonDisabled,
            ]}
            onPress={onExecute}
            disabled={!canExecute || isExecuting}
          >
            <Text style={mergedStyles.buttonText}>
              {isExecuting ? '⏳' : '▶️'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={mergedStyles.errorContainer}>
          <Text style={mergedStyles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  executeButton: {
    backgroundColor: '#34C759',
  },
  shareButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    fontWeight: '500',
  },
});

export { QueryHeaderView };