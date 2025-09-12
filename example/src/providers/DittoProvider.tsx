import React, { useState, ReactNode, useMemo, useEffect } from 'react';
import { DittoService } from '../services/DittoService';
import DittoContext, { DittoContextType } from './DittoContext';

interface DittoProviderProps {
  children: ReactNode;
}

const DittoProvider: React.FC<DittoProviderProps> = ({ children }) => {
  const [dittoService, setDittoService] = useState(() => DittoService.getInstance());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeDitto = async () => {
      try {
        if (!isMounted) {
          return;
        }

        const success = await dittoService.initialize();

        if (isMounted) {
          if (success) {
            setIsInitialized(true);
            setError(null);
          } else {
            setError(new Error('Failed to initialize Ditto'));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      }
    };

    initializeDitto();

    return () => {
      isMounted = false;
      dittoService.cleanup();
    };
  }, [dittoService]);

  const contextValue: DittoContextType = useMemo(() => ({
    dittoService,
    setDittoService,
    isInitialized,
    error,
  }), [dittoService, setDittoService, isInitialized, error]);

  return (
    <DittoContext.Provider value={contextValue}>
      {children}
    </DittoContext.Provider>
  );
};

export default DittoProvider;
