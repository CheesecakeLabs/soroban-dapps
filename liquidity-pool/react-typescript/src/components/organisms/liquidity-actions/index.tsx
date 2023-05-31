import { useState, FunctionComponent, Dispatch, SetStateAction } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";

import { Deposit, Swap, Withdraw } from "components/molecules"
import { IToken } from "interfaces/soroban/token"
import { IReserves } from "interfaces/soroban/liquidityPool"

interface ILiquidityActions {
  sorobanContext: SorobanContextType;
  account: string;
  tokenA: IToken;
  tokenB: IToken;
  reserves: IReserves;
}

const LiquidityActions: FunctionComponent<ILiquidityActions> = ({ sorobanContext, account, tokenA, tokenB, reserves }) => {
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
            sorobanContext={sorobanContext}
            tokenA={tokenA}
            tokenB={tokenB}
            account={account}
          />
        )}
        {activeTab == 'Swap' && (
          <Swap
            sorobanContext={sorobanContext}
            tokenA={tokenA}
            tokenB={tokenB}
            account={account}
            reserves={reserves}
          />
        )}
        {activeTab == 'Withdraw' && (
          <Withdraw
            sorobanContext={sorobanContext}
            tokenA={tokenA}
            tokenB={tokenB}
            account={account}
            reserves={reserves}
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