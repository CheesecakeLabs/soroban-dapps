
import { useContractValue } from '@soroban-react/contracts'
import { SorobanContextType } from "@soroban-react/core";


import BigNumber from 'bignumber.js';

import { IReserves } from "interfaces/soroban/liquidityPool"
import { scvalToBigNumber } from 'shared/convert';

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

