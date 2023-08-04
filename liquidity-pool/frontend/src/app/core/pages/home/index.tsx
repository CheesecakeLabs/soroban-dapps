import React from 'react'

import classNames from 'classnames'

import { useSorobanReact } from "@soroban-react/core";

import styles from './styles.module.scss'

import { NetworkData } from 'components/molecules'
import { LiquidityActions, AccountData } from 'components/organisms'

import { Utils } from 'shared/utils'
import { TokenAIcon, TokenBIcon } from "components/icons"
import * as tokenAContract from 'token-a-contract'
import * as tokenBContract from 'token-B-contract'
import * as shareTokenContract from 'share-token-contract'
import * as liquidityPoolContract from 'liquidity-pool-contract'

import { IToken } from 'interfaces/soroban/token';
import { IReserves } from 'interfaces/soroban/liquidityPool';


const Home = (): JSX.Element => {
  const sorobanContext = useSorobanReact()
  const account = sorobanContext.address || ""

  const [updatedAt, setUpdatedAt] = React.useState<number>(Date.now())
  const [tokenA, setTokenA] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [tokenB, setTokenB] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [shareToken, setShareToken] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [reserves, setReserves] = React.useState<IReserves>({ reservesA: BigInt(0), reservesB: BigInt(0) })
  const [totalShares, setTotalShares] = React.useState<bigint>(BigInt(0))

  React.useEffect(() => {
    Promise.all([
      tokenAContract.symbol(),
      tokenAContract.decimals(),
      tokenBContract.symbol(),
      tokenBContract.decimals(),
      shareTokenContract.symbol(),
      shareTokenContract.decimals()
    ]).then(fetched => {
      setTokenA(prevTokenA => ({
        ...prevTokenA,
        symbol: fetched[0],
        decimals: fetched[1],
      }));
      setTokenB(prevTokenB => ({
        ...prevTokenB,
        symbol: fetched[2],
        decimals: fetched[3],
      }));
      setShareToken(prevShareToken => ({
        ...prevShareToken,
        symbol: fetched[4],
        decimals: fetched[5],
      }));
    });
  }, []);

  React.useEffect(() => {
    Promise.all([
      liquidityPoolContract.getRsrvs(),
      liquidityPoolContract.getShares()
    ]).then(fetched => {
      setReserves({
        reservesA: fetched[0][0],
        reservesB: fetched[0][1],
      });
      setTotalShares(fetched[1]);
    });
    if (account) {
      Promise.all([
        tokenAContract.balance({ id: account }),
        tokenBContract.balance({ id: account }),
        shareTokenContract.balance({ id: account })
      ]).then(fetched => {
        setTokenA(prevTokenA => ({
          ...prevTokenA,
          balance: fetched[0],
        }));
        setTokenB(prevTokenB => ({
          ...prevTokenB,
          balance: fetched[1]
        }));
        setShareToken(prevShareToken => ({
          ...prevShareToken,
          balance: fetched[2]
        }));
      });
    }
  }, [updatedAt, account]);

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
          onUpdate={() => setUpdatedAt(Date.now())}
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
                account={sorobanContext.address}
                tokenA={tokenA}
                tokenB={tokenB}
                shareToken={shareToken}
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
    </main >
  )
}

export default Home
