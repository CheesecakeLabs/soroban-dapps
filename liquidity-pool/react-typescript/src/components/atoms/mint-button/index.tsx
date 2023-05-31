import React, { FunctionComponent, useState } from 'react'

import styles from './styles.module.scss'

import BigNumber from 'bignumber.js';
import { SorobanContextType } from "@soroban-react/core";
import { useSendTransaction } from '@soroban-react/contracts'
import * as SorobanClient from 'soroban-client'
import { LoadingButton } from '@mui/lab';

interface IMintButton {
  sorobanContext: SorobanContextType;
  symbol: string;
  adminAddress: string;
  adminSecret: string
}

const MintButton: FunctionComponent<IMintButton> = ({ sorobanContext, symbol, adminAddress, adminSecret }) => {
  const [isSubmitting, setSubmitting] = useState(false)
  const account = sorobanContext.address || ""
  const networkPassphrase = sorobanContext.activeChain?.networkPassphrase
  const amount = BigNumber(100);

  const { sendTransaction } = useSendTransaction()

  const handleOnClick = async (): Promise<void> => {
    setSubmitting(true)
    if (!sorobanContext.server) throw new Error("Not connected to server")

    let adminSource, walletSource
    try {
      adminSource = await sorobanContext.server.getAccount(adminAddress)
      walletSource = await sorobanContext.server.getAccount(account)
    }
    catch (error) {
      alert("Your wallet or the token admin wallet might not be funded")
      setSubmitting(false)
      return
    }

    //
    // 1. Establish a trustline to the admin (if necessary)
    // 2. The admin sends us money (mint)
    //
    // We have to do this in two separate transactions because one
    // requires approval from Freighter while the other can be done with
    // the stored token issuer's secret key.
    //
    // FIXME: The `getAccount()` RPC endpoint doesn't return `balances`,
    //        so we never know whether or not the user needs a trustline
    //        to receive the minted asset.
    //
    // Today, we establish the trustline unconditionally.
    try {
      console.log("Establishing the trustline...")
      console.log("sorobanContext: ", sorobanContext)
      const trustlineResult = await sendTransaction(
        new SorobanClient.TransactionBuilder(walletSource, {
          networkPassphrase: networkPassphrase,
          fee: "1000", // arbitrary
        })
          .setTimeout(60)
          .addOperation(
            SorobanClient.Operation.changeTrust({
              asset: new SorobanClient.Asset(symbol, adminAddress),
            })
          )
          .build(), {
        timeout: 60 * 1000, // should be enough time to approve the tx
        skipAddingFootprint: true, // classic = no footprint
        // omit `secretKey` to have Freighter prompt for signing
        // hence, we need to explicit the sorobanContext
        sorobanContext
      },
      )
      console.debug(trustlineResult)
    } catch (err) {
      console.log("Error while establishing the trustline: ", err)
      console.error(err)
    }
    try {
      console.log("Minting the token...")
      const paymentResult = await sendTransaction(
        new SorobanClient.TransactionBuilder(adminSource, {
          networkPassphrase: networkPassphrase,
          fee: "1000",
        })
          .setTimeout(100)
          .addOperation(
            SorobanClient.Operation.payment({
              destination: walletSource.accountId(),
              asset: new SorobanClient.Asset(symbol, adminAddress),
              amount: amount.toString(),
            })
          )
          .build(), {
        timeout: 10 * 1000,
        skipAddingFootprint: true,
        secretKey: adminSecret,
        sorobanContext
      }
      )
      console.debug(paymentResult)
      sorobanContext.connect()
    } catch (err) {
      console.log("Error while minting the token: ", err)
      console.error(err)
    }
    setSubmitting(false)
  }

  return (
    <LoadingButton
      onClick={handleOnClick}
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
