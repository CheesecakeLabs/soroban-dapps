import type { WalletChain } from '@soroban-react/types';
import { futurenet, sandbox, standalone } from '@soroban-react/chains';

export const allowedChains: WalletChain[] = [futurenet, sandbox, standalone];