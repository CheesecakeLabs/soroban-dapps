import { useState, FunctionComponent, Dispatch, SetStateAction } from 'react'

import styles from './styles.module.scss'

import { Deposit, Swap, Withdraw } from "components/molecules"
import { IToken } from "interfaces/soroban/token"
import { IReserves } from "interfaces/soroban/liquidityPool"
import { Address } from 'token-a-contract';

interface ILiquidityActions {
  account: Address;
  tokenA: IToken;
  tokenB: IToken;
  shareToken: IToken;
  reserves: IReserves;
  totalShares: bigint;
  onUpdate: () => void;
}

const LiquidityActions: FunctionComponent<ILiquidityActions> = ({ account, tokenA, tokenB, shareToken, reserves, totalShares, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("Deposit");

  const handleChangeActiveTab = (tab: string): void => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <HeaderItem activeTab={activeTab} setActiveTab={setActiveTab} label={"Deposit"} />
        <HeaderItem activeTab={activeTab} setActiveTab={setActiveTab} label={"Swap"} />
        <HeaderItem activeTab={activeTab} setActiveTab={setActiveTab} label={"Withdraw"} />
      </div>
      <div className={styles.content}>
        {activeTab == 'Deposit' && (
          <Deposit
            tokenA={tokenA}
            tokenB={tokenB}
            account={account}
            onUpdate={onUpdate}
          />
        )}
        {activeTab == 'Swap' && (
          <Swap
            tokenA={tokenA}
            tokenB={tokenB}
            account={account}
            reserves={reserves}
            onUpdate={onUpdate}
          />
        )}
        {activeTab == 'Withdraw' && (
          <Withdraw
            tokenA={tokenA}
            tokenB={tokenB}
            shareToken={shareToken}
            account={account}
            reserves={reserves}
            poolTotalShares={totalShares}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  )
}

interface IHeaderItem {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  label: string;
}

const HeaderItem: FunctionComponent<IHeaderItem> = ({ activeTab, setActiveTab, label }) => {
  const handleChangeActiveTab = (tab: string): void => {
    setActiveTab(tab);
  };
  return (
    <div className={styles.headerItem}>
      <div
        className={`${styles.title} ${activeTab == label ? styles.active : ''}`}
        onClick={(): void => handleChangeActiveTab(label)}
      >
        {label}
      </div>
    </div>
  )
}



export { LiquidityActions }