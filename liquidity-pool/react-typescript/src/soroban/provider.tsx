import React from 'react'
import { SorobanReactProvider } from '@soroban-react/core';
import { allowedChains } from './allowedChains';
import { allowedConnectors } from './connectors';

const MySorobanReactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SorobanReactProvider
            chains={allowedChains}
            connectors={allowedConnectors}>
            {children}
        </SorobanReactProvider>
    )
}
export default MySorobanReactProvider;