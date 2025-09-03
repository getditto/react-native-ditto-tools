import { createContext } from 'react';
import { DittoService } from '../services/DittoService';

export interface DittoContextType {
  dittoService: DittoService;
  setDittoService: React.Dispatch<React.SetStateAction<DittoService>>;
  isInitialized: boolean;
  error: Error | null;
}

const DittoContext = createContext<DittoContextType | null>(null);

export default DittoContext;
