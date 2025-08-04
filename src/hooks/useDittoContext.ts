import { useContext } from 'react';
import { DittoContext } from '../components/DittoProvider';

export const useDittoContext = () => {
  console.log('useDittoContext called');
  const context = useContext(DittoContext);
  console.log('useDittoContext context:', context);
  if (!context) {
    throw new Error('useDittoContext must be used within a DittoProvider');
  }
  return context;
};