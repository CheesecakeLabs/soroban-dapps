import { FunctionComponent } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";
import { ConnectButton } from "components/atoms"

import { Balance } from "components/molecules"
import { IToken } from "interfaces/soroban/token"
import { TokenAIcon, TokenBIcon, TokenLPIcon } from 'components/icons';


interface IAccountData {
    sorobanContext: SorobanContextType;
    tokenA: IToken;
    tokenB: IToken;
    shareToken: IToken;
    onUpdate: () => void;
}

const AccountData: FunctionComponent<IAccountData> = ({ sorobanContext, tokenA, tokenB, shareToken, onUpdate }) => {
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
                    onUpdate={onUpdate}
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
    onUpdate: () => void;
}

const BalanceData: FunctionComponent<IBalanceData> = ({ tokenA, tokenB, shareToken, account, onUpdate }) => {
    return (
        <>
            <div className={styles.address}>
                {`${account.toString().substring(0, 10)}...${account.toString().substring(account.toString().length - 10)}`}
            </div>
            <div className={styles.balances}>
                <Balance
                    account={account}
                    token={tokenA}
                    balance={tokenA.balance || BigInt(0)}
                    tokenA={true}
                    mint={true}
                    icon={TokenAIcon}
                    onUpdate={onUpdate}
                />
                <Balance
                    account={account}
                    token={tokenB}
                    balance={tokenB.balance || BigInt(0)}
                    tokenA={false}
                    mint={true}
                    icon={TokenBIcon}
                    onUpdate={onUpdate}
                />
                <Balance
                    account={account}
                    token={shareToken}
                    balance={shareToken.balance || BigInt(0)}
                    mint={false}
                    icon={TokenLPIcon}
                    onUpdate={onUpdate}
                />
            </div>
        </>
    )
}

export { AccountData }