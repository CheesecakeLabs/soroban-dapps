import React from 'react'

import classNames from 'classnames'

import { useSorobanReact } from "@soroban-react/core";

import styles from './styles.module.scss'

import { NetworkData } from 'components/molecules'
import { LiquidityActions, AccountData } from 'components/organisms'

import { Utils } from 'shared/utils'
import { TokenAIcon, TokenBIcon } from "components/icons"

import { IToken } from 'interfaces/soroban/token';
import { IReserves } from 'interfaces/soroban/liquidityPool';
import { contractLiquidityPool, contractShareToken, contractTokenA, contractTokenB } from 'shared/contracts';
import { AssembledTransaction, i128, u32 } from 'liquidity-pool-contract';


const Home = (): JSX.Element => {
  const sorobanContext = useSorobanReact()
  const account = sorobanContext.address ? sorobanContext.address : ""

  const [updatedAt, setUpdatedAt] = React.useState<number>(Date.now())
  const [tokenA, setTokenA] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [tokenB, setTokenB] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [shareToken, setShareToken] = React.useState<IToken>({ symbol: "", decimals: 7 })
  const [reserves, setReserves] = React.useState<IReserves>({ reservesA: BigInt(0), reservesB: BigInt(0) })
  const [totalShares, setTotalShares] = React.useState<bigint>(BigInt(0))

  React.useEffect(() => {
    Promise.all([
      contractTokenA.symbol(),
      contractTokenA.decimals(),
      contractTokenB.symbol(),
      contractTokenB.decimals(),
      contractShareToken.symbol(),
      contractShareToken.decimals()
    ]).then(fetched => {

      const tokenASymbol = fetched[0].result;
      const tokenADecimals = fetched[1].result;
      const tokenBSymbol = fetched[2].result;
      const tokenBDecimals = fetched[3].result;
      const shareTokenSymbol = fetched[4].result;
      const shareTokenDecimals = fetched[5].result;

      setTokenA(prevTokenA => ({
        ...prevTokenA,
        symbol: tokenASymbol,
        decimals: tokenADecimals,
      }));
      setTokenB(prevTokenB => ({
        ...prevTokenB,
        symbol: tokenBSymbol,
        decimals: tokenBDecimals,
      }));
      setShareToken(prevShareToken => ({
        ...prevShareToken,
        symbol: shareTokenSymbol,
        decimals: shareTokenDecimals,
      }));
    });
  }, []);

  React.useEffect(() => {
    Promise.all([
      contractLiquidityPool.getRsrvs(),
      contractLiquidityPool.getShares()
    ]).then((fetched: [AssembledTransaction<readonly [bigint, bigint]>, AssembledTransaction<bigint>]) => { 
      const reserves = fetched[0].result;
      const shares = fetched[1].result;
      setReserves({
        reservesA: reserves[0],
        reservesB: reserves[1],
      });
      setTotalShares(shares);
    });
    if (account) {
      Promise.all([
        contractTokenA.balance({ id: account }),
        contractTokenB.balance({ id: account }),
        contractShareToken.balance({ id: account })
      ]).then(fetched => {

        const balanceA = fetched[0].result as i128;
        const balanceB = fetched[1].result  as i128;
        const balanceShare = fetched[2].result  as i128;

        setTokenA(prevTokenA => ({
          ...prevTokenA,
          balance: balanceA,
        }));
        setTokenB(prevTokenB => ({
          ...prevTokenB,
          balance: balanceB
        }));
        setShareToken(prevShareToken => ({
          ...prevShareToken,
          balance: balanceShare
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
          onUpdate={() => {
            setUpdatedAt(Date.now())
            console.log("AccountData onUpdate")
          }}
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

          {account ?
            (
              <LiquidityActions
                account={account}
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
