import BigNumber from 'bignumber.js';

interface IToken {
    symbol: string;
    decimals: number;
    balance?: BigNumber;
}

export type { IToken }