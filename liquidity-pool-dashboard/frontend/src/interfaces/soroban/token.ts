interface IToken {
    id: string;
    symbol: string;
    decimals: number;
    balance?: bigint;
}

interface IMintParams {
    contractId: string;
    to: string;
    amount: bigint;
}

interface IMintOptions {
    signAndSend?: boolean;
    fee?: number;
}


interface IMintFunction {
    (params: IMintParams, options?: IMintOptions): Promise<void>;
}


export type { IToken, IMintFunction }