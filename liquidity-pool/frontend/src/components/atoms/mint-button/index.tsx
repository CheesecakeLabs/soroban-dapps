import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import { LoadingButton } from '@mui/lab';
import { IMintFunction } from 'interfaces/soroban/token';
import { contractTokenA, contractTokenB } from 'shared/contracts';
import { Address } from 'token-a-contract';


interface IMintButton {
  account: Address;
  decimals: number;
  tokenA?: boolean;
  onUpdate: () => void;
}

const MintButton: FunctionComponent<IMintButton> = ({ account, decimals, tokenA, onUpdate }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const amount = BigInt(100 * 10 ** decimals)

  return (
    <LoadingButton
      onClick={async () => {
        setSubmitting(true)
        if (tokenA) {
          await contractTokenA.mint({ to: account, amount: amount })
        } else {
          await contractTokenB.mint({ to: account, amount: amount })
        }
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
