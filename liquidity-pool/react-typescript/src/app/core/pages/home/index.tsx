import React, { useEffect, useState } from 'react';
import classNames from 'classnames'

import { useSorobanReact } from "@soroban-react/core";


import logo from 'app/core/resources/logo.svg'

import styles from './styles.module.scss'

import { NetworkData } from 'components/molecules'
import { LiquidityActions, AccountData } from 'components/organisms'

import { useLoadToken } from "services/token"
import { useLoadReserves } from "services/liquidityPool"
import { Constants } from 'shared/constants'
import { Utils } from 'shared/utils'
import { TokenAIcon, TokenBIcon } from "components/icons"



const Home = (): JSX.Element => {
  const sorobanContext = useSorobanReact()

  const tokenA = useLoadToken(sorobanContext, Constants.TOKEN_A_ID);
  const tokenB = useLoadToken(sorobanContext, Constants.TOKEN_B_ID);
  const shareToken = useLoadToken(sorobanContext, Constants.SHARE_ID);

  const reserves = useLoadReserves(sorobanContext, Constants.LIQUIDITY_POOL_ID)

  return (
    <main>
      <header className={styles.header}>
        <h3>Liquidity Pool DApp</h3>
        <NetworkData sorobanContext={sorobanContext} />
      </header>

      <div className={styles.content}>
        <AccountData
          sorobanContext={sorobanContext}
          tokenA={tokenA}
          tokenB={tokenB}
          shareToken={shareToken}
        />

        <div className={styles.poolContent}>
          {sorobanContext.activeChain &&
            (<>
              <div className={styles.poolName}>
                <div>
                  <TokenAIcon className={styles.tokenIcon} />
                  <TokenBIcon className={classNames(styles.tokenIcon, styles.tokenIconB)} />
                </div>
                <h1>
                  {tokenA.symbol} · {tokenB.symbol}
                </h1>
              </div>
              <div className={styles.poolDescription}>
                <div className={styles.item}>
                  <div className={styles.label}>Reserves</div>
                  <div className={styles.values}>
                    <div>{Utils.formatAmount(reserves.reservesA, tokenA.decimals)} {tokenA.symbol}</div>
                    <div>{Utils.formatAmount(reserves.reservesB, tokenB.decimals)} {tokenB.symbol}</div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.label}>Pool fees</div>
                  <div className={styles.values}>
                    <div>0.3%</div>
                  </div>
                </div>
              </div>
            </>)
          }

          {sorobanContext.address ?
            (
              <LiquidityActions
                sorobanContext={sorobanContext}
                account={sorobanContext.address}
                tokenA={tokenA}
                tokenB={tokenB}
                reserves={reserves}
              />
            ) : (
              <div className={styles.card}>
                <p>Please connect your wallet to start
                  using the liquidity pool.</p>
              </div>
            )
          }
        </div>
      </div>

    </main >
  )
}

export default Home
