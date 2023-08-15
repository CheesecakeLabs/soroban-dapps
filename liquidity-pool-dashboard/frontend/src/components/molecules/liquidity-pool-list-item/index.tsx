import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom';

import styles from './styles.module.scss'
import { IToken } from 'interfaces/soroban/token'
import * as tokenContract from 'token-contract'
import * as liquidityPoolContract from 'liquidity-pool-contract'
import { formatAmount } from 'shared/utils'

export interface ILiquidityPoolListItemProps {
  id: string
  tokenAId: string
  tokenBId: string
  tokenAValue: bigint
  tokenBValue: bigint
}

const LiquidityPoolListItem: FunctionComponent<ILiquidityPoolListItemProps> = ({
  id, tokenAId, tokenBId, tokenAValue, tokenBValue
}) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/liquidity-pool/${id}`);
  };

  const [tokenA, setTokenA] = React.useState<IToken>({ id: tokenAId, symbol: "", decimals: 7 })
  const [tokenB, setTokenB] = React.useState<IToken>({ id: tokenBId, symbol: "", decimals: 7 })
  const [reserves, setReserves] = React.useState<bigint>(BigInt(0))

  React.useEffect(() => {
    Promise.all([
      tokenContract.symbol({ contractId: tokenAId }),
      tokenContract.decimals({ contractId: tokenAId }),
      tokenContract.symbol({ contractId: tokenBId }),
      tokenContract.decimals({ contractId: tokenBId }),
      liquidityPoolContract.getRsrvs({ contractId: id }),
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
      console.log(fetched[4][0] * tokenAValue + fetched[4][1] * tokenBValue)
      setReserves(fetched[4][0] * tokenAValue + fetched[4][1] * tokenBValue)
    });
  }, []);

  return (
    <div className={styles.poolItem} onClick={handleClick}>
      <div>
        <div className={styles.label}>icon</div>
        <div>{tokenA.symbol}-{tokenB.symbol}</div>
      </div>
      <div>
        <div className={styles.label}>Liquidity</div>
        <div>{formatAmount(reserves, 7)} XLM</div>
      </div>
      <div>
        <div className={styles.label}>Volume(24H)</div>
        <div>158,182 XLM</div>
      </div>
      <div>
        <div className={styles.label}>Fees(24H)</div>
        <div>3,321 XLM</div>
      </div>
      <div>
        <div className={styles.label}>APR(24H)</div>
        <div>3,51%</div>
      </div>
      <div>
        <div className={styles.label}>User accounts</div>
        <div>7</div>
      </div>
    </div>
  )
}

export { LiquidityPoolListItem }
