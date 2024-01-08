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

export type swapArgs = {
    to: string,
    buyA: boolean,
    out: number,
    inMax: number,
    txInvocation: TransactionInvocation
}

export type withdrawArgs = {
    to: string,
    shareAmount: number,
    minA: number,
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

    async swap({
        to, buyA, out, inMax, txInvocation
    }: swapArgs): Promise<void> {
        const methodArgs = {
            to: to,
            buy_a: buyA,
            out: out,
            in_max: inMax,
        }
        await this.invokeContract({
            method: liquidityPoolTransactions.swap,
            methodArgs: methodArgs,
            ...txInvocation,
        });
    }

    async withdraw({
        to, shareAmount, minA, minB, txInvocation
    }: withdrawArgs): Promise<void> {
        const methodArgs = {
            to: to,
            share_amount: shareAmount,
            min_a: minA,
            min_b: minB
        }
        await this.invokeContract({
            method: liquidityPoolTransactions.withdraw,
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