import React, { FunctionComponent, useState } from 'react'

import { LoadingButton } from '@mui/lab';

import styles from './styles.module.scss'
import { IToken } from "interfaces/soroban/token"
import { InputCurrency, InputPercentage } from "components/atoms"
import { TokenAIcon, TokenBIcon } from 'components/icons';
import { ErrorText } from 'components/atoms/error-text';
import { deposit } from 'liquidity-pool-contract'


interface IFormValues {
    tokenAAmount: string;
    tokenBAmount: string;
    maxSlippage: string;
}

interface IDeposit {
    account: string;
    tokenA: IToken;
    tokenB: IToken;
}

const Deposit: FunctionComponent<IDeposit> = ({ account, tokenA, tokenB }) => {
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
            const { tokenAAmount, tokenBAmount, maxSlippage } = formValues;
            const minA = (parseFloat(tokenAAmount) - parseFloat(maxSlippage) * parseFloat(tokenAAmount) / 100);
            const minB = (parseFloat(tokenBAmount) - parseFloat(maxSlippage) * parseFloat(tokenBAmount) / 100);

            await deposit({
                to: account,
                desired_a: BigInt(parseFloat(tokenAAmount) * 10 ** tokenA.decimals),
                desired_b: BigInt(parseFloat(tokenBAmount) * 10 ** tokenB.decimals),
                min_a: BigInt(minA * 10 ** tokenA.decimals),
                min_b: BigInt(minB * 10 ** tokenB.decimals),
            }, { fee: 100000 })
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
