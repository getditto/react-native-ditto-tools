import React, { createContext, ReactNode } from 'react';
import type { Ditto } from '@dittolive/ditto';

export interface DittoContextValue {
  ditto: Ditto;
}

export const DittoContext = createContext<DittoContextValue | null>(null);

export interface DittoProviderProps {
  children: ReactNode;
  ditto: Ditto; // Accept an already initialized Ditto instance
}

const DittoProvider: React.FC<DittoProviderProps> = ({ children, ditto }) => {
  return (
    <DittoContext.Provider value={{ ditto }}>
      {children}
    </DittoContext.Provider>
  );
};

export default DittoProvider;