import React from 'react'
import { SorobanReactProvider } from '@soroban-react/core';
import { allowedChains } from '../soroban/allowedChains';
import { allowedConnectors } from '../soroban/connectors';

export default function MySorobanReactProvider({ children }: { children: React.ReactNode }) {
    return (
        <SorobanReactProvider
            chains={allowedChains}
            connectors={allowedConnectors}>
            {children}
        </SorobanReactProvider>
    )
} 