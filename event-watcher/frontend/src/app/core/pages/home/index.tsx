import React, { useState, useEffect } from 'react'

import styles from './styles.module.scss'
import { LiquidityPoolListItem } from 'components/molecules'
import { http } from 'interfaces/http'
import { ILiquidityPool } from 'interfaces/soroban/liquidityPool'

import { Utils } from 'shared/utils'
import { TokenCard } from 'components/molecules/token-list'
import { IToken } from 'interfaces/soroban/token'

const Home = (): JSX.Element => {
  const [pools, setPools] = useState<ILiquidityPool[]>([]);
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [TVL, setTVL] = useState<BigInt>(BigInt(0));
  const [totalVolume, setTotalVolume] = useState<BigInt>(BigInt(0));

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
    async function fetchTotalVolume() {
      try {
        const response = await http.get('/metrics/total-volume-24');
        setTotalVolume(response.data);
      } catch (error) {
        console.error('Error fetching TVL:', error);
      }
    }
    async function fetchTokens() {
      const response = await http.get('/tokens');
      const convertedTokens = response.data
        .filter((item: any) => !item.is_share)
        .map((item: any) => {
          return {
            id: item.id,
            contractId: item.contract_id,
            symbol: item.symbol,
            decimals: item.decimals,
            xlmValue: item.xlm_value
          };
        });
      setTokens(convertedTokens);
    }

    fetchPools();
    fetchTVL();
    fetchTotalVolume();
    fetchTokens();
  }, []);

  return (
    <main>
      <header className={styles.header}>
        <h1>Liquidity Pool Dashboard</h1>
      </header>
      <div className={styles.content}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div><h2>Pools</h2></div>
            <div>TVL: {Utils.formatAmount(TVL, 7)} XLM</div>
            <div>Volume24h: {Utils.formatAmount(totalVolume, 7)} XLM</div>
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
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div><h2>Tokens</h2></div>
          </div>
          <TokenCard tokens={tokens} />
        </div>
      </div>
    </main>
  )
}

export default Home
