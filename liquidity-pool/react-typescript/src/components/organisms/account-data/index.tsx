import { FunctionComponent } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";
import { ConnectButton } from "@soroban-react/connect-button";

import { Constants } from '../../../shared/constants'
import { useLoadTokenBalance } from "services/token"
import { Balance } from "components/molecules"
import { IToken } from "interfaces/soroban/token"
import { TokenAIcon, TokenBIcon, TokenLPIcon } from 'components/icons';

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
                    sorobanContext={sorobanContext}
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
    sorobanContext: SorobanContextType;
    tokenA: IToken;
    tokenB: IToken;
    shareToken: IToken;
    account: string;
}

const BalanceData: FunctionComponent<IBalanceData> = ({ sorobanContext, tokenA, tokenB, shareToken, account }) => {
    const balanceA = useLoadTokenBalance(sorobanContext, Constants.TOKEN_1_ID, account);
    const balanceB = useLoadTokenBalance(sorobanContext, Constants.TOKEN_2_ID, account);
    const balanceShare = useLoadTokenBalance(sorobanContext, Constants.SHARE_ID, account);

    return (
        <>
            <div className={styles.address}>
                {`${account.substring(0, 10)}...${account.substring(account.length - 10)}`}
            </div>
            <div className={styles.balances}>
                <Balance
                    sorobanContext={sorobanContext}
                    token={tokenA}
                    balance={balanceA}
                    allowMint={true}
                    icon={TokenAIcon}
                />
                <Balance
                    sorobanContext={sorobanContext}
                    token={tokenB}
                    balance={balanceB}
                    allowMint={true}
                    icon={TokenBIcon}
                />
                <Balance
                    sorobanContext={sorobanContext}
                    token={shareToken}
                    balance={balanceShare}
                    allowMint={false}
                    icon={TokenLPIcon}
                />
            </div>

        </>


    )
}

export { AccountData }