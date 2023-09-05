interface IToken {
    id?: number;
    contractId: string;
    symbol: string;
    decimals: number;
    xlmValue?: number;
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