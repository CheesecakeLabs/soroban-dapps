import React, { FunctionComponent } from 'react'
import { useHistory } from 'react-router-dom';

import styles from './styles.module.scss'

import { IToken } from 'interfaces/soroban/token';


export interface ITokenCardProps {
  tokens: IToken[];
}

const TokenCard: FunctionComponent<ITokenCardProps> = ({ tokens }) => {
  return (
    <div>
      <div className={styles.title}>Pool tokens</div>
      <div className={styles.list}>
        <div className={styles.header}>
          <div className={styles.column}>Token</div>
          <div className={styles.column}>Price</div>
        </div>
        {tokens.map((token, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.column}>{token.symbol}</div>
            <div className={styles.column}>{token.xlmValue} XLM</div>
          </div>
        ))}
      </div>
    </div>

  );
};


export { TokenCard }
