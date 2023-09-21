import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import { LoadingButton } from '@mui/lab';
import { IMintFunction } from 'interfaces/soroban/token';
import { contractTokenA, contractTokenB } from 'shared/contracts';
import { Address } from 'token-a-contract';


interface IMintButton {
  account: Address;
  decimals: number;
  mint: IMintFunction;
  onUpdate: () => void;
}

const MintButton: FunctionComponent<IMintButton> = ({ account, decimals, mint, onUpdate }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const amount = BigInt(100 * 10 ** decimals)

  return (
    <LoadingButton
      onClick={async () => {
        setSubmitting(true)
        console.log("account", account)
        console.log("amount", amount)
        // contractTokenB.mint({ to: account, amount: amount })
        await mint({ to: account, amount: amount })
        // console.log("mint")
        setSubmitting(false)
        onUpdate()
      }}
      color="primary"
      disableElevation
      loading={isSubmitting}
      size='small'
      className={styles.button}
    >
      Mint
    </LoadingButton>
  )
}

export { MintButton }
