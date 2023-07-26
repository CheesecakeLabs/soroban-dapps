import { WalletChain } from '@soroban-react/types'
import BigNumber from 'bignumber.js'
import { bigNumberToI128 } from './convert'
import { xdr } from 'soroban-client'

export function formatAmount(undivided: BigInt, decimals: number): string {
    const n = undivided.valueOf() < BigInt(Number.MAX_SAFE_INTEGER)
        ? Number(undivided) / (10 ** decimals)
        : (undivided.valueOf() / (10n ** BigInt(decimals)));
    return String(n);
}

const getNetworkPassphrase = (activeChain: WalletChain | undefined): string => {
    return activeChain?.networkPassphrase || ""
}

const convertToShiftedI128 = (value: number, decimals = 7): xdr.ScVal => {
    return bigNumberToI128(BigNumber(value).shiftedBy(decimals))
}


const Utils = {
    formatAmount,
    getNetworkPassphrase,
    convertToShiftedI128,
}

export { Utils }
