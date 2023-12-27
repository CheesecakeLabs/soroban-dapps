
import * as TokenA from 'token-a-contract'
import * as TokenB from 'token-b-contract'
import * as LiquidityPool from 'liquidity-pool-contract'
import * as ShareToken from 'share-token-contract'
import { Server } from 'soroban-client'
import config from './config.json'
const { network, rpcUrl } = config


export const contractTokenA = new TokenA.Contract({
    rpcUrl,
    ...TokenA.networks[network as keyof typeof TokenA.networks],
})

export const contractTokenB = new TokenB.Contract({
    rpcUrl,
    ...TokenB.networks[network as keyof typeof TokenB.networks],
})

export const contractLiquidityPool = new LiquidityPool.Contract({
    rpcUrl,
    ...LiquidityPool.networks[network as keyof typeof LiquidityPool.networks],
})

export const contractShareToken = new ShareToken.Contract({
    rpcUrl,
    ...ShareToken.networks[network as keyof typeof ShareToken.networks],
})

export const server = new Server(rpcUrl)