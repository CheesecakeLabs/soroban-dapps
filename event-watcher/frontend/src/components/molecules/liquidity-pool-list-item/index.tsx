import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom';

import styles from './styles.module.scss'
import { formatAmount } from 'shared/utils'
import { ILiquidityPool } from 'interfaces/soroban/liquidityPool';

export interface ILiquidityPoolListItemProps {
  pool: ILiquidityPool;
}

const LiquidityPoolListItem: FunctionComponent<ILiquidityPoolListItemProps> = ({
  pool
}) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/liquidity-pool/${pool.id}`);
  };


  return (
    <div className={styles.poolItem} onClick={handleClick}>
      <div>
        <div className={styles.label}>icon</div>
        <div>{pool.tokenA.symbol}-{pool.tokenB.symbol}</div>
      </div>
      <div>
        <div className={styles.label}>Liquidity</div>
        <div>{formatAmount(BigInt(pool.liquidity), 7)} XLM</div>
      </div>
      <div>
        <div className={styles.label}>Volume(24H)</div>
        <div>{formatAmount(BigInt(pool.volume), 7)} XLM</div>
      </div>
      <div>
        <div className={styles.label}>Fees(24H)</div>
        <div>{formatAmount(BigInt(pool.fees), 7)} XLM</div>
      </div>
      <div>
        <div className={styles.label}>User accounts</div>
        <div>{pool.users}</div>
      </div>
    </div>
  )
}

export { LiquidityPoolListItem }
