import React, { useState, useEffect } from 'react'

import logo from 'app/core/resources/logo.svg'

import styles from './styles.module.scss'
import { Button } from 'components/atoms'
import { LiquidityPoolListItem } from 'components/molecules'
import { http } from 'interfaces/http'
import { ILiquidityPool } from 'interfaces/soroban/liquidityPool'
import { IToken } from 'interfaces/soroban/token'
import { Utils } from 'shared/utils'

const Home = (): JSX.Element => {
  const [pools, setPools] = useState<ILiquidityPool[]>([]);
  const [TVL, setTVL] = useState<BigInt>(BigInt(0));

  useEffect(() => {
    async function fetchPools() {
      try {
        const response = await http.get('/pools');
        const convertedPools = response.data.map((item: any) => {
          return {
            id: item.id,
            contractId: item.contract_id,
            name: item.name,
            liquidity: item.liquidity,
            volume: item.volume,
            fees: item.fees,
            tokenA: {
              id: item.token_a.id,
              contractId: item.token_a.contract_id,
              symbol: item.token_a.symbol,
              decimals: item.token_a.decimals,
              xlmValue: item.token_a.xlm_value
            },
            tokenB: {
              id: item.token_b.id,
              contractId: item.token_b.contract_id,
              symbol: item.token_b.symbol,
              decimals: item.token_b.decimals,
              xlmValue: item.token_b.xlm_value
            },
            tokenAReserves: item.token_a_reserves,
            tokenBReserves: item.token_b_reserves,
          };
        });
        setPools(convertedPools);
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    }
    async function fetchTVL() {
      try {
        const response = await http.get('/metrics/tvl');
        setTVL(response.data);
      } catch (error) {
        console.error('Error fetching TVL:', error);
      }
    }

    fetchPools();
    fetchTVL();
  }, []);

  return (
    <main>
      <header className={styles.header}>
        <h1>Liquidity Pool Dashboard</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.contentHeader}>
          <div><h2>Pools</h2></div>
          <div>TVL: {Utils.formatAmount(TVL, 7)} XLM</div>
          <div>Volume24h: 5,593,092 XLM</div>
          {/* <Button label="Create Pool" onClick={createPool}></Button> */}
        </div>
        <div className={styles.poolList}>
          {pools.map(item => (
            <LiquidityPoolListItem
              pool={item}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default Home
