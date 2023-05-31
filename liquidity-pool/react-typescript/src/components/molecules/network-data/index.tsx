import React, { FunctionComponent, Component } from 'react'

import styles from './styles.module.scss'

import { useSorobanReact } from "@soroban-react/core";
import { Button } from '@mui/material'

const NetworkData: FunctionComponent = () => {
    const {
        activeChain,
    } = useSorobanReact()

    return (
        <>
            {activeChain ? (
                <div className={styles.card}>{activeChain.name}</div>
            ) : (
                <Button>Connect Wallet</Button>
            )}
        </>
    )
}
export { NetworkData }