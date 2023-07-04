import { WalletChain } from '@soroban-react/types'
import BigNumber from 'bignumber.js'
import { bigNumberToI128 } from './convert'
import { xdr } from 'soroban-client'

const formatAmount = (value: BigNumber, decimals = 7): string => {
    return value.shiftedBy(decimals * -1).toNumber().toLocaleString()
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
