import React, { FunctionComponent } from 'react'

import styles from './styles.module.scss'


import { Utils } from 'shared/utils'
import { IToken } from "interfaces/soroban/token"
import { MintButton } from 'components/atoms';



interface IBalance {
    account: string;
    token: IToken;
    balance: bigint;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    tokenA?: boolean;
    mint: boolean;
    onUpdate: () => void;
}

const Balance: FunctionComponent<IBalance> = ({ account, tokenA, balance, mint, icon, token, onUpdate }:IBalance) => {
    const Icon = icon;

    return (
        <div className={styles.balance}>
            {Icon && <Icon />}
            <div className={styles.value}>
                <div>{Utils.formatAmount(balance, token.decimals)}</div>
                <div className={styles.code}>{token.symbol}</div>
            </div>
            {mint &&
                <div>
                    <MintButton
                        account={account}
                        decimals={token.decimals}
                        tokenA={tokenA}
                        onUpdate={onUpdate}
                    />
                </div>
            }
        </div>
    )
}


export { Balance }