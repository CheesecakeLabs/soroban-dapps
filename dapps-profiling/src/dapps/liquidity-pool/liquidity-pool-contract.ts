import { ContractEngine } from "stellar-plus/lib/stellar-plus";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { TransactionInvocation, Network } from "../../utils/simulation/types";
import { hexStringToBytes32 } from "../../utils/converters";
import { Address } from "@stellar/stellar-base";

export enum liquidityPoolTransactions {
    initialize = "initialize",
    deposit = "deposit",
    get_rsrvs = "get_rsrvs",
    swap = "swap",
    withdraw = "withdraw"
}

type initializeArgs = {
    tokenWasmHash: string,
    tokenA: string,
    tokenB: string,
    txInvocation: TransactionInvocation,
}

export type depositArgs = {
    to: string,
    desiredA: number,
    minA: number,
    desiredB: number,
    minB: number,
    txInvocation: TransactionInvocation
}
export class LiquidityPoolContract extends ContractEngine {
    constructor(args: ContractEngineConstructorArgs) {
        super(args);
    }

    async initialize({
        tokenWasmHash,
        tokenA,
        tokenB,
        txInvocation
    }: initializeArgs): Promise<void> {
        const methodArgs = {
            token_wasm_hash: hexStringToBytes32(tokenWasmHash),
            token_a: new Address(tokenA),
            token_b: new Address(tokenB),
        };

        await this.invokeContract({
            method: liquidityPoolTransactions.initialize,
            methodArgs: methodArgs,
            ...txInvocation,
        });
    }

    async deposit({
        to, desiredA, minA, desiredB, minB, txInvocation
    }: depositArgs): Promise<void> {
        const methodArgs = {
            to: to,
            desired_a: desiredA,
            min_a: minA,
            desired_b: desiredB,
            min_b: minB
        }
        await this.invokeContract({
            method: liquidityPoolTransactions.deposit,
            methodArgs: methodArgs,
            ...txInvocation,
        });
    }

    async getReserves(txInvocation: TransactionInvocation): Promise<any> {
        const methodArgs = {}
        return await this.invokeContract({
            method: liquidityPoolTransactions.get_rsrvs,
            methodArgs: methodArgs,
            ...txInvocation,
        });
    }
}