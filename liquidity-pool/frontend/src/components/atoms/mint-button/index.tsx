import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import { LoadingButton } from '@mui/lab';
import { contractTokenA, contractTokenB } from 'shared/contracts';




interface IMintButton {
  account: string;
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
          const tx = await contractTokenA.mint({ to: account, amount: amount })
          await tx.signAndSend()
          
        } else {
          const tx = await contractTokenB.mint({ to: account, amount: amount })
          await tx.signAndSend()
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
