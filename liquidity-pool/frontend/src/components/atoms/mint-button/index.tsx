import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import { LoadingButton } from '@mui/lab';
import { IMintFunction } from 'interfaces/soroban/token';


interface IMintButton {
  account: string;
  decimals: number;
  mint: IMintFunction;
}

const MintButton: FunctionComponent<IMintButton> = ({ account, decimals, mint }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const amount = BigInt(100 * 10 ** decimals)

  return (
    <LoadingButton
      onClick={async () => {
        setSubmitting(true)
        await mint({ to: account, amount: amount }, { signAndSend: true })
        setSubmitting(false)
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
