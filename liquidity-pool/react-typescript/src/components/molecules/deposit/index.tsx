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
import { ErrorText } from 'components/atoms/error-text';

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
    const [error, setError] = useState(false)

    const [formValues, setFormValues] = useState<IFormValues>({
        tokenAAmount: "0.00",
        tokenBAmount: "0.00",
        maxSlippage: "0.5",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value || 0 });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitting(true)
        setError(false)

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

        } catch (error) {
            console.error(error);
            setError(true)
        }
        setSubmitting(false)
        setFormValues({
            ...formValues,
            tokenAAmount: "0.00",
            tokenBAmount: "0.00"
        })
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
                            text='Balance'
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
                        helpText="The maximum variation percentage accepted for the desired deposit amounts. The higher the percentage, the greater the chance of a successful transaction, but you may not get such a good price."
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
                {error &&
                    <div className={styles.error}>
                        <ErrorText text="Transaction failed. Try to increase the slippage for more chances of success." />
                    </div>
                }
            </div>
        </form>
    )
}


export { Deposit }