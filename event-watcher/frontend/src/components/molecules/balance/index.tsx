import React, { FunctionComponent } from 'react'

import styles from './styles.module.scss'


import { Utils } from 'shared/utils'
import { IMintFunction, IToken } from "interfaces/soroban/token"
import { MintButton } from 'components/atoms';


interface IBalance {
    account: string;
    token: IToken;
    balance: bigint;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    mint?: IMintFunction;
    onUpdate: () => void;
}

const Balance: FunctionComponent<IBalance> = ({ account, token, balance, icon, mint, onUpdate }) => {
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
                        id={token.contractId}
                        mint={mint}
                        onUpdate={onUpdate}
                    />
                </div>
            }
        </div>
    )
}


export { Balance }