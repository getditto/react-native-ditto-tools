import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useDittoSync } from '../hooks/useDittoSync';

interface SyncControlsProps {
  style?: any;
  showTransportOptions?: boolean;
}

const SyncControls: React.FC<SyncControlsProps> = ({ 
  style, 
  showTransportOptions = false 
}) => {
  const {
    isSyncing,
    transportOptions,
    toggleSync,
    updateTransportOptions,
    enableBatterySavingMode,
    enableHighPerformanceMode,
  } = useDittoSync();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.mainControl}>
        <View style={styles.syncRow}>
          <View>
            <Text style={styles.label}>Sync Status</Text>
            <Text style={styles.status}>
              {isSyncing ? '🟢 Active' : '⚪ Paused'}
            </Text>
          </View>
          <Switch
            value={isSyncing}
            onValueChange={toggleSync}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isSyncing ? '#ffffff' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={enableBatterySavingMode}
        >
          <Text style={styles.actionButtonText}>🔋 Battery Mode</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={enableHighPerformanceMode}
        >
          <Text style={styles.actionButtonText}>⚡ Performance Mode</Text>
        </TouchableOpacity>
      </View>

      {showTransportOptions && (
        <View style={styles.transportOptions}>
          <Text style={styles.sectionTitle}>Transport Options</Text>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Bluetooth LE</Text>
            <Switch
              value={transportOptions.bluetoothLE || false}
              onValueChange={(value) => updateTransportOptions({ bluetoothLE: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              disabled={!isSyncing}
            />
          </View>

          <View style={styles.option}>
            <Text style={styles.optionLabel}>Local Network (LAN)</Text>
            <Switch
              value={transportOptions.lan || false}
              onValueChange={(value) => updateTransportOptions({ lan: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              disabled={!isSyncing}
            />
          </View>

          <View style={styles.option}>
            <Text style={styles.optionLabel}>mDNS Discovery</Text>
            <Switch
              value={transportOptions.mdns || false}
              onValueChange={(value) => updateTransportOptions({ mdns: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              disabled={!isSyncing || !transportOptions.lan}
            />
          </View>

          <View style={styles.option}>
            <Text style={styles.optionLabel}>Multicast</Text>
            <Switch
              value={transportOptions.multicast || false}
              onValueChange={(value) => updateTransportOptions({ multicast: value })}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              disabled={!isSyncing || !transportOptions.lan}
            />
          </View>

          {Platform.OS === 'ios' && (
            <View style={styles.option}>
              <Text style={styles.optionLabel}>AWDL (Apple Wireless)</Text>
              <Switch
                value={transportOptions.awdl || false}
                onValueChange={(value) => updateTransportOptions({ awdl: value })}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                disabled={!isSyncing}
              />
            </View>
          )}

          <Text style={styles.batteryWarning}>
            ⚠️ Enabling multiple transports increases battery usage
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainControl: {
    marginBottom: 16,
  },
  syncRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  actionButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  transportOptions: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 14,
    color: '#555',
  },
  batteryWarning: {
    fontSize: 12,
    color: '#ff9800',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default SyncControls;