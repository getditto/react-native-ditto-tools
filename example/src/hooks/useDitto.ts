import { useContext } from 'react';
import DittoContext, { DittoContextType } from '../providers/DittoContext';

export const useDitto = (): DittoContextType => {
  const context = useContext(DittoContext);

  if (!context) {
    throw new Error('useDitto must be used within a DittoProvider');
  }

  return context;
};
