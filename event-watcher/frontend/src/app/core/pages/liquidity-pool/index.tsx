import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';

import classNames from 'classnames'

import { useSorobanReact } from "@soroban-react/core";

import styles from './styles.module.scss'

import { NetworkData } from 'components/molecules'
import { LiquidityActions, AccountData } from 'components/organisms'

import { Utils } from 'shared/utils'
// import { TokenAIcon, TokenBIcon } from "components/icons"
import * as tokenContract from 'token-contract'
import * as shareTokenContract from 'lp-token-contract'
import * as liquidityPoolContract from 'liquidity-pool-contract'

import { IToken } from 'interfaces/soroban/token';
import { ILiquidityPool, IReserves } from 'interfaces/soroban/liquidityPool';
import { http } from 'interfaces/http';


const LiquidityPool = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const [pool, setPool] = useState<ILiquidityPool>();

  const sorobanContext = useSorobanReact()
  const account = sorobanContext.address || ""

  const [updatedAt, setUpdatedAt] = React.useState<number>(Date.now())
  const [tokenA, setTokenA] = React.useState<IToken>()
  const [tokenB, setTokenB] = React.useState<IToken>()
  const [shareToken, setShareToken] = React.useState<IToken>()
  const [reserves, setReserves] = React.useState<IReserves>({ reservesA: BigInt(0), reservesB: BigInt(0) })
  const [totalShares, setTotalShares] = React.useState<bigint>(BigInt(0))

  useEffect(() => {
    async function fetchPool() {
      try {
        const response = await http.get(`/pools/${id}`);
        const data: ILiquidityPool = {
          id: response.data.id,
          contractId: response.data.contract_id,
          name: response.data.name,
          liquidity: response.data.liquidity,
          volume: response.data.volume,
          fees: response.data.fees,
          tokenA: {
            id: response.data.token_a.id,
            contractId: response.data.token_a.contract_id,
            symbol: response.data.token_a.symbol,
            decimals: response.data.token_a.decimals,
            xlmValue: response.data.token_a.xlm_value
          },
          tokenB: {
            id: response.data.token_b.id,
            contractId: response.data.token_b.contract_id,
            symbol: response.data.token_b.symbol,
            decimals: response.data.token_b.decimals,
            xlmValue: response.data.token_b.xlm_value
          },
          tokenShare: {
            id: response.data.token_share.id,
            contractId: response.data.token_share.contract_id,
            symbol: response.data.token_share.symbol,
            decimals: response.data.token_share.decimals,
            xlmValue: response.data.token_share.xlm_value
          },
          tokenAReserves: response.data.token_a_reserves,
          tokenBReserves: response.data.token_b_reserves,
        };

        setPool(data);
      } catch (error) {
        console.error('Error fetching pools:', error);
      }
    }

    fetchPool();
  }, []);

  React.useEffect(() => {
    if (pool) {
      Promise.all([
        liquidityPoolContract.getRsrvs({ contractId: pool.contractId }),
        liquidityPoolContract.getShares({ contractId: pool.contractId })
      ]).then(fetched => {
        setReserves({
          reservesA: fetched[0][0],
          reservesB: fetched[0][1],
        });
        setTotalShares(fetched[1]);
      });
      if (account) {
        Promise.all([
          tokenContract.balance({ contractId: pool.tokenA.contractId, id: account }),
          tokenContract.balance({ contractId: pool.tokenB.contractId, id: account }),
          shareTokenContract.balance({ contractId: pool.tokenShare.contractId, id: account })
        ]).then(fetched => {
          setPool((prevPool) => ({
            ...prevPool!,
            tokenA: {
              ...prevPool!.tokenA,
              balance: fetched[0],
            },
            tokenB: {
              ...prevPool!.tokenB,
              balance: fetched[1],
            },
            tokenShare: {
              ...prevPool!.tokenShare,
              balance: fetched[2],
            },
          }));
        });
      }
    }
  }, [updatedAt, account, pool]);

  const history = useHistory();

  const handleClickBack = () => {
    history.push(`/`);
  };

  return (
    <main>
      <header className={styles.header}>
        <button onClick={handleClickBack}>Back</button>
        <h3>Liquidity Pool DApp</h3>
        <NetworkData sorobanContext={sorobanContext} />
      </header>
      {pool &&
        <div className={styles.content}>
          <AccountData
            sorobanContext={sorobanContext}
            tokenA={pool.tokenA}
            tokenB={pool.tokenB}
            shareToken={pool.tokenShare}
            onUpdate={() => setUpdatedAt(Date.now())}
          />
          <div className={styles.poolContent}>
            {sorobanContext.activeChain &&
              (<>
                <div className={styles.poolName}>
                  <div>
                    {/* <TokenAIcon className={styles.tokenIcon} />
                <TokenBIcon className={classNames(styles.tokenIcon, styles.tokenIconB)} /> */}
                  </div>
                  <h1>
                    {pool.tokenA.symbol} · {pool.tokenB.symbol}
                  </h1>
                </div>
                <div className={styles.poolDescription}>
                  <div className={styles.item}>
                    <div className={styles.label}>Reserves</div>
                    <div className={styles.values}>
                      <div>{Utils.formatAmount(reserves.reservesA, pool.tokenA.decimals)} {pool.tokenA.symbol}</div>
                      <div>{Utils.formatAmount(reserves.reservesB, pool.tokenB.decimals)} {pool.tokenB.symbol}</div>
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
                  id={pool.contractId}
                  account={sorobanContext.address}
                  tokenA={pool.tokenA}
                  tokenB={pool.tokenB}
                  shareToken={pool?.tokenShare}
                  reserves={reserves}
                  totalShares={totalShares}
                  onUpdate={() => setUpdatedAt(Date.now())}
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
      }

    </main >
  )
}

export default LiquidityPool
