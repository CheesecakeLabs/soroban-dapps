
import { useContractValue, useSendTransaction, contractTransaction } from '@soroban-react/contracts'
import { SorobanContextType } from "@soroban-react/core";
import * as SorobanClient from 'soroban-client'
import { scvalToBigNumber, scvalToString } from "@soroban-react/utils";

import { bigNumberToI128 } from "@soroban-react/utils";
import BigNumber from 'bignumber.js';

import { IReserves } from "interfaces/soroban/liquidityPool"

export const useLoadReserves = (
    sorobanContext: SorobanContextType,
    liquidityPoolId: string,
): IReserves => {
    const reserves = useContractValue({
        contractId: liquidityPoolId,
        method: 'get_rsrvs',
        sorobanContext
    })
    const reservesVec = reserves.result?.vec()

    if (reservesVec) {
        return {
            reservesA: scvalToBigNumber(reservesVec[0]),
            reservesB: scvalToBigNumber(reservesVec[1]),
        }
    }

    return {
        reservesA: BigNumber(0),
        reservesB: BigNumber(0),
    }
}

export const useLoadTotalShares = (
    sorobanContext: SorobanContextType,
    liquidityPoolId: string,
): BigNumber => {
    const totalShares = useContractValue({
        contractId: liquidityPoolId,
        method: 'get_shares',
        sorobanContext
    })
    if (totalShares.result) {
        return scvalToBigNumber(totalShares.result)
    }

    return BigNumber(0)
}

// export async function deposit(
//     sorobanContext: SorobanContextType,
//     liquidityPoolId: string,
//     account: string,
//     tokenAAmount: BigNumber,
//     tokenBAmount: BigNumber,
//     sendTransaction: (txn?: Transaction | undefined, opts?: SendTransactionOptions | undefined) => Promise<SorobanClient.xdr.ScVal>any,
// ): Promise<SorobanClient.xdr.ScVal> {
//     if (!sorobanContext.server) throw new Error("Not connected to server")
//     const source = await sorobanContext.server?.getAccount(account)
//     const tx = contractTransaction({
//         source,
//         networkPassphrase: sorobanContext.activeChain?.networkPassphrase || "",
//         contractId: liquidityPoolId,
//         method: 'deposit',
//         params: [new SorobanClient.Address(account).toScVal(), bigNumberToI128(tokenAAmount.shiftedBy(7)), bigNumberToI128(tokenAAmount.shiftedBy(7)), bigNumberToI128(tokenBAmount.shiftedBy(7)), bigNumberToI128(tokenBAmount.shiftedBy(7))]
//     })
//     return sendTransaction(tx, { sorobanContext })
// }


//fn deposit(e: Env, to: Address, desired_a: i128, min_a: i128, desired_b: i128, min_b: i128);