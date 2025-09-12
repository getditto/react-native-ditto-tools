import { useEffect, useState, useCallback } from 'react';
import type { Ditto } from '@dittolive/ditto';
import type { SystemSetting, UseSystemSettingsResult } from '../types/systemSettings';

export const useSystemSettings = (ditto: Ditto): UseSystemSettingsResult => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const formatValue = (value: any): string | number | boolean => {
    // Handle null/undefined
    if (value === null || value === undefined) {
      return 'null';
    }
    
    // Handle booleans
    if (typeof value === 'boolean') {
      return value;
    }
    
    // Handle numbers
    if (typeof value === 'number') {
      return value;
    }
    
    // Handle strings
    if (typeof value === 'string') {
      return value;
    }
    
    // Handle objects/arrays by converting to JSON string
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    // Default to string conversion
    return String(value);
  };

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Execute SHOW ALL DQL query
      const results = await ditto.store.execute('SHOW ALL');
      
      if (results.items && results.items.length > 0) {
        // Parse the results into SystemSetting format
        const parsedSettings: SystemSetting[] = results.items.map((item: any) => {
          // The SHOW ALL query returns items with key-value pairs
          // The structure might be { setting_name: value } or { key: name, value: val }
          // We need to handle both cases
          
          if (item.value && typeof item.value === 'object') {
            // If the item has a value property that's an object, extract all settings from it
            return Object.entries(item.value).map(([key, val]) => ({
              key,
              value: formatValue(val)
            }));
          } else if (item.key !== undefined && item.value !== undefined) {
            // If item has explicit key and value properties
            return {
              key: String(item.key),
              value: formatValue(item.value)
            };
          } else {
            // Otherwise, treat the entire item as a collection of settings
            return Object.entries(item).map(([key, val]) => ({
              key,
              value: formatValue(val)
            }));
          }
        }).flat();
        
        // Sort settings alphabetically by key
        parsedSettings.sort((a, b) => a.key.localeCompare(b.key));
        
        setSettings(parsedSettings);
        setLastUpdatedAt(new Date());
      } else {
        setSettings([]);
        setLastUpdatedAt(new Date());
      }
    } catch (err) {
      console.error('Error fetching system settings:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch system settings'));
      setSettings([]);
    } finally {
      setLoading(false);
    }
  }, [ditto]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    lastUpdatedAt
  };
};