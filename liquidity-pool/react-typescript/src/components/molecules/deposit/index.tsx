import React, { FunctionComponent, useState } from 'react'

import { SorobanContextType } from "@soroban-react/core";
import { useSendTransaction, contractTransaction } from '@soroban-react/contracts'
import { bigNumberToI128 } from "@soroban-react/utils";
import * as SorobanClient from 'soroban-client'

import BigNumber from 'bignumber.js';


import styles from './styles.module.scss'
import { Constants } from 'shared/constants'
import { IToken } from "interfaces/soroban/token"
import { InputCurrency, InputPercentage } from "components/atoms"
import { TokenAIcon, TokenBIcon } from 'components/icons';
import { LoadingButton } from '@mui/lab';

interface IFormValues {
    tokenAAmount: string;
    tokenBAmount: string;
    maxSlippage: string;
}

interface IDeposit {
    sorobanContext: SorobanContextType;
    account: string;
    tokenA: IToken;
    tokenB: IToken;
}

const Deposit: FunctionComponent<IDeposit> = ({ sorobanContext, account, tokenA, tokenB }) => {
    const { sendTransaction } = useSendTransaction()
    const [isSubmitting, setSubmitting] = useState(false)

    const [formValues, setFormValues] = useState<IFormValues>({
        tokenAAmount: "0.00",
        tokenBAmount: "0.00",
        maxSlippage: "0.00",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitting(true)

        try {
            if (!sorobanContext.server) {
                throw new Error("Not connected to server");
            }
            const source = await sorobanContext.server?.getAccount(account);

            const floatAmountA = parseFloat(formValues.tokenAAmount)
            const floatAmountB = parseFloat(formValues.tokenBAmount)
            const floatMaxSlippage = parseFloat(formValues.maxSlippage)
            const minA = BigNumber(floatAmountA - floatMaxSlippage * floatAmountA / 100);
            const minB = BigNumber(floatAmountB - floatMaxSlippage * floatAmountB / 100);
            const tx = contractTransaction({
                source,
                networkPassphrase: sorobanContext.activeChain?.networkPassphrase || "",
                contractId: Constants.LIQUIDITY_POOL_ID,
                method: 'deposit',
                params: [
                    new SorobanClient.Address(account).toScVal(),
                    bigNumberToI128(BigNumber(floatAmountA).shiftedBy(7)),
                    bigNumberToI128(minA.shiftedBy(7)),
                    bigNumberToI128(BigNumber(floatAmountB).shiftedBy(7)),
                    bigNumberToI128(minB.shiftedBy(7))
                ]
            });

            const result = await sendTransaction(tx, { sorobanContext });
            sorobanContext.connect()
            // Process the result or perform any additional actions

        } catch (error) {
            console.error(error);
            // Handle error appropriately
        }
        setSubmitting(false)
    };

    return (
        <form>
            <div className={styles.formContent}>
                <div className={styles.formContentLeft}>
                    <div className={styles.input}>
                        <InputCurrency
                            label={tokenA.symbol}
                            name="tokenAAmount"
                            value={formValues.tokenAAmount}
                            onChange={handleInputChange}
                            decimalScale={tokenA.decimals}
                            icon={TokenAIcon}
                        />
                    </div>
                    <div className={styles.input}>
                        <InputCurrency
                            label={tokenB.symbol}
                            name="tokenBAmount"
                            value={formValues.tokenBAmount}
                            onChange={handleInputChange}
                            decimalScale={tokenB.decimals}
                            icon={TokenBIcon}
                        />
                    </div>
                </div>
                <div className={styles.formContentRight}>
                    <InputPercentage
                        label="Max slippage"
                        name="maxSlippage"
                        value={formValues.maxSlippage}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div>
                <LoadingButton
                    variant="contained"
                    onClick={handleSubmit}
                    color="primary"
                    disableElevation
                    fullWidth
                    loading={isSubmitting}
                >
                    Deposit
                </LoadingButton>
            </div>
        </form>
    )
}


export { Deposit }