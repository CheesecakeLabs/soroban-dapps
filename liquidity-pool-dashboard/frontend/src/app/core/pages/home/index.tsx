import React from 'react'

import logo from 'app/core/resources/logo.svg'

import styles from './styles.module.scss'
import { Button } from 'components/atoms'
import { LiquidityPoolListItem } from 'components/molecules'

const Home = (): JSX.Element => {
  const createPool = (): void => {
  }


  const liquidityPools = [
    {
      id: import.meta.env.VITE_LP_ID_1,
      tokenShare: import.meta.env.VITE_LP_SHARE_ID_1,
      tokenA: import.meta.env.VITE_LP_TOKEN_A_1,
      tokenAValue: BigInt(2),
      tokenB: import.meta.env.VITE_LP_TOKEN_B_1,
      tokenBValue: BigInt(4),
    },
    {
      id: import.meta.env.VITE_LP_ID_2,
      tokenShare: import.meta.env.VITE_LP_SHARE_ID_2,
      tokenA: import.meta.env.VITE_LP_TOKEN_A_2,
      tokenAValue: BigInt(1),
      tokenB: import.meta.env.VITE_LP_TOKEN_B_2,
      tokenBValue: BigInt(1),
    },
    {
      id: import.meta.env.VITE_LP_ID_3,
      tokenShare: import.meta.env.VITE_LP_SHARE_ID_3,
      tokenA: import.meta.env.VITE_LP_TOKEN_A_3,
      tokenAValue: BigInt(3),
      tokenB: import.meta.env.VITE_LP_TOKEN_B_3,
      tokenBValue: BigInt(2),
    },
  ];

  return (
    <main>
      <header className={styles.header}>
        <h1>Liquidity Pool Dashboard</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div><h2>Pools</h2></div>
          <div>TVL: 40,496,315.36 XLM</div>
          <div>Volume24h: 5,593,092 XLM</div>
          <Button label="Create Pool" onClick={createPool}></Button>
        </div>
        <div className={styles.poolList}>
          {liquidityPools.map(item => (
            <LiquidityPoolListItem
              id={item.id}
              tokenAId={item.tokenA}
              tokenAValue={item.tokenAValue}
              tokenBId={item.tokenB}
              tokenBValue={item.tokenBValue}

            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home
