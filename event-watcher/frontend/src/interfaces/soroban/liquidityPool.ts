import { IToken } from "./token";

interface ILiquidityPool {
    id: number;
    contractId: string;
    name: string;
    liquidity: number;
    volume: number;
    fees: number;
    tokenA: IToken;
    tokenB: IToken;
    tokenShare: IToken;
    tokenAReserves: number;
    tokenBReserves: number;
}
interface IReserves {
    reservesA: bigint;
    reservesB: bigint;
}

export type { IReserves, ILiquidityPool }