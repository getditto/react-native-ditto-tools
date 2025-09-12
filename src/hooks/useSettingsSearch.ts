import { useState, useMemo, useCallback, useEffect } from 'react';
import type { SystemSetting, UseSettingsSearchResult } from '../types/systemSettings';

export const useSettingsSearch = (settings: SystemSetting[]): UseSettingsSearchResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter settings based on the debounced search term
  const filteredSettings = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return settings;
    }

    const lowerSearchTerm = debouncedSearchTerm.toLowerCase().trim();
    
    return settings.filter((setting) => {
      // Search in the key (case-insensitive)
      if (setting.key.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      
      // Also search in the value (converted to string for searching)
      const valueStr = String(setting.value).toLowerCase();
      if (valueStr.includes(lowerSearchTerm)) {
        return true;
      }
      
      return false;
    });
  }, [settings, debouncedSearchTerm]);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return {
    filteredSettings,
    searchTerm,
    setSearchTerm: handleSetSearchTerm
  };
};