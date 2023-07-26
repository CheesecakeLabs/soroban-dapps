import { FunctionComponent } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";
import { ConnectButton } from "components/atoms"

import { Balance } from "components/molecules"
import { IToken } from "interfaces/soroban/token"
import { TokenAIcon, TokenBIcon, TokenLPIcon } from 'components/icons';
import { mint as mintA } from 'token-a-contract'
import { mint as mintB } from 'token-B-contract'

interface IAccountData {
    sorobanContext: SorobanContextType;
    tokenA: IToken;
    tokenB: IToken;
    shareToken: IToken;
}

const AccountData: FunctionComponent<IAccountData> = ({ sorobanContext, tokenA, tokenB, shareToken }) => {
    const account = sorobanContext.address
    return (
        <div className={styles.card}>
            <h3>Account balance</h3>
            {account ? (
                <BalanceData
                    account={account}
                    tokenA={tokenA}
                    tokenB={tokenB}
                    shareToken={shareToken}
                />
            ) : (
                <ConnectButton label='Connect Wallet' sorobanContext={sorobanContext} />
            )}
        </div>
    )
}

interface IBalanceData {
    tokenA: IToken;
    tokenB: IToken;
    shareToken: IToken;
    account: string;
}

const BalanceData: FunctionComponent<IBalanceData> = ({ tokenA, tokenB, shareToken, account }) => {
    return (
        <>
            <div className={styles.address}>
                {`${account.substring(0, 10)}...${account.substring(account.length - 10)}`}
            </div>
            <div className={styles.balances}>
                <Balance
                    account={account}
                    token={tokenA}
                    balance={tokenA.balance || BigInt(0)}
                    mint={mintA}
                    icon={TokenAIcon}
                />
                <Balance
                    account={account}
                    token={tokenB}
                    balance={tokenB.balance || BigInt(0)}
                    mint={mintB}
                    icon={TokenBIcon}
                />
                <Balance
                    account={account}
                    token={shareToken}
                    balance={shareToken.balance || BigInt(0)}
                    icon={TokenLPIcon}
                />
            </div>
        </>
    )
}

export { AccountData }