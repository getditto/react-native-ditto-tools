import React from 'react';
import {DittoService} from '../services/DittoService';

export type DittoContextType = {
    dittoService: DittoService;
    setDittoService: React.Dispatch<React.SetStateAction<DittoService>>;
    isInitialized: boolean;
	error: Error | null;
};
