import React, { FunctionComponent } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";

import BigNumber from 'bignumber.js';

import { Utils } from 'shared/utils'
import { Constants } from 'shared/constants'
import { IToken } from "interfaces/soroban/token"
import { MintButton } from 'components/atoms';


interface IBalance {
    sorobanContext: SorobanContextType;
    token: IToken;
    allowMint: boolean;
    balance: BigNumber;
    icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const Balance: FunctionComponent<IBalance> = ({ sorobanContext, token, balance, allowMint, icon }) => {
    const Icon = icon;

    return (
        <div className={styles.balance}>
            {Icon && <Icon />}
            <div className={styles.value}>
                <div>{Utils.formatAmount(balance, token.decimals)}</div>
                <div className={styles.code}>{token.symbol}</div>
            </div>
            {allowMint &&
                <div>
                    <MintButton
                        sorobanContext={sorobanContext}
                        symbol={token.symbol}
                        adminAddress={Constants.TOKEN_A_ADMIN}
                        adminSecret={Constants.TOKEN_A_ADMIN_SECRET_KEY}
                    />
                </div>
            }
        </div>
    )
}


export { Balance }