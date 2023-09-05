import { Connector } from '@soroban-react/types';
import { freighter } from '@soroban-react/freighter';

export const allowedConnectors: Connector[] = [
    freighter(),
];