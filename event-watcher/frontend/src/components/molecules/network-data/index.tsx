import React, { FunctionComponent } from 'react'

import styles from './styles.module.scss'

import { SorobanContextType } from "@soroban-react/core";
import { ConnectButton } from 'components/atoms';

interface INetworkDataProps {
    sorobanContext: SorobanContextType;
}

const NetworkData: FunctionComponent<INetworkDataProps> = ({ sorobanContext }) => {
    const { activeChain } = sorobanContext

    return (
        <>
            {activeChain ? (
                <div className={styles.card}>{activeChain.name}</div>
            ) : (
                <ConnectButton label='Connect Wallet' sorobanContext={sorobanContext} />
            )}
        </>
    )
}
export { NetworkData }