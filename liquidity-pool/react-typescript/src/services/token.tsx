
import { useContractValue } from '@soroban-react/contracts'
import { SorobanContextType } from "@soroban-react/core";
import * as SorobanClient from 'soroban-client'
import { scvalToBigNumber, scvalToString } from "@soroban-react/utils";

import BigNumber from 'bignumber.js';

import { IToken } from "interfaces/soroban/token"

export const useLoadToken = (
    sorobanContext: SorobanContextType,
    tokenId: string
): IToken => {
    const decimals = useContractValue({
        contractId: tokenId,
        method: 'decimals',
        sorobanContext
    })
    const symbol = useContractValue({
        contractId: tokenId,
        method: 'symbol',
        sorobanContext
    })
    return {
        decimals: decimals.result ? (decimals.result?.u32() ?? 7) : 0,
        symbol: (symbol.result && scvalToString(symbol.result)?.replace("\u0000", "")) || ""
    }
}

export const useLoadTokenBalance = (
    sorobanContext: SorobanContextType,
    tokenId: string,
    account: string
): BigNumber => {
    const balance = useContractValue({
        contractId: tokenId,
        method: 'balance',
        params: [new SorobanClient.Address(account).toScVal()],
        sorobanContext
    })
    return scvalToBigNumber(balance.result)
}



