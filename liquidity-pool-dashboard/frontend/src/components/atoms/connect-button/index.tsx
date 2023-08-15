import React from 'react'

import { SorobanContextType } from '@soroban-react/core'
import { Button } from '@mui/material'

export interface IConnectButtonProps {
  label: string;
  sorobanContext: SorobanContextType;
}

export const ConnectButton: React.FC<IConnectButtonProps> = ({ label, sorobanContext }) => {
  const { connect } = sorobanContext

  const openConnectModal = async (): Promise<void> => {
    await connect()
  }

  return (
    <Button
      onClick={openConnectModal}
      variant='contained'
    >{label}</Button>
  )
}