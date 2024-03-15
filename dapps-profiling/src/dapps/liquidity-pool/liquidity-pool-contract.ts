import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { TransactionInvocation, Network } from "../../utils/simulation/types";
import { hexStringToBytes32 } from "../../utils/converters";
import { Address } from "@stellar/stellar-base";
import { ContractEngine } from "stellar-plus/lib/stellar-plus/core/contract-engine";

export enum liquidityPoolTransactions {
    initialize = "initialize",
    deposit = "deposit",
    get_rsrvs = "get_rsrvs",
    swap = "swap",
    withdraw = "withdraw",
    get_shares = "get_shares"
}

type initializeArgs = {
    tokenWasmHash: string,
    tokenA: string,
    tokenB: string,
    txInvocation: TransactionInvocation,
}

export type depositArgs = {
    to: string,
    desiredA: BigInt,
    minA: BigInt,
    desiredB: BigInt,
    minB: BigInt,
    txInvocation: TransactionInvocation
}

export type swapArgs = {
    to: string,
    buyA: boolean,
    out: BigInt,
    inMax: BigInt,
    txInvocation: TransactionInvocation
}

export type withdrawArgs = {
    to: string,
    shareAmount: BigInt,
    minA: BigInt,
    minB: BigInt,
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
            token_a: tokenA,
            token_b: tokenB,
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
        try {
            await this.invokeContract({
                method: liquidityPoolTransactions.swap,
                methodArgs: methodArgs,
                ...txInvocation,
            });
        } catch (error) {
            console.log("Swap Fail")
        }

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
        try {
            await this.invokeContract({
                method: liquidityPoolTransactions.withdraw,
                methodArgs: methodArgs,
                ...txInvocation,
            });
        } catch (error) {
            console.log("Withdraw Fail")
        }

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
        try {
            await this.invokeContract({
                method: liquidityPoolTransactions.deposit,
                methodArgs: methodArgs,
                ...txInvocation,
            });
        } catch (error) {
            console.log("Deposit Fail")
        }

    }

    async getReserves(txInvocation: TransactionInvocation): Promise<any> {
        const methodArgs = {}
        try {
            return await this.invokeContract({
                method: liquidityPoolTransactions.get_rsrvs,
                methodArgs: methodArgs,
                ...txInvocation,
            });
        } catch (error) {
            console.log("Fail to get reserves")
        }
    }

    async getShares(txInvocation: TransactionInvocation): Promise<any> {
        const methodArgs = {}
        try {
            return await this.invokeContract({
                method: liquidityPoolTransactions.get_shares,
                methodArgs: methodArgs,
                ...txInvocation,
            });
        } catch (error) {
            console.log("Fail to get shares")
        }
    }
}