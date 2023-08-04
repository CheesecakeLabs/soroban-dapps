import React, { FunctionComponent, useState } from 'react'

import { LoadingButton } from '@mui/lab';

import styles from './styles.module.scss'
import { IToken } from "interfaces/soroban/token"
import { IReserves } from "interfaces/soroban/liquidityPool"
import { Icon, IconNames, InputPercentage, InputSlider, Tooltip } from "components/atoms"
import { Utils } from 'shared/utils';
import { ErrorText } from 'components/atoms/error-text';
import { withdraw } from 'liquidity-pool-contract'


interface IFormValues {
    sharePercent: string;
    maxSlippage: string;
}

interface IWithdraw {
    account: string;
    tokenA: IToken;
    tokenB: IToken;
    shareToken: IToken;
    reserves: IReserves;
    poolTotalShares: bigint;
}

const Withdraw: FunctionComponent<IWithdraw> = ({ account, tokenA, tokenB, shareToken, reserves, poolTotalShares }) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState(false)
    const [formValues, setFormValues] = useState<IFormValues>({
        sharePercent: "0",
        maxSlippage: "0.5",
    });

    // Total shares of the current account
    const accBalanceShares = shareToken.balance || BigInt(0);
    // Selected slipagge
    const slippageFactor = parseFloat(formValues.maxSlippage) / 100;
    // Amount of shares selected
    const shareAmount = accBalanceShares * BigInt(parseInt(formValues.sharePercent)) / BigInt(100);
    // Amount of TokenA regarding the amount of shares and slippage selected
    const tokenATotalWithSlippage = poolTotalShares ? (
        BigInt(Math.floor((Number(shareAmount) / Number(poolTotalShares) * Number(reserves.reservesA)) * (1 - slippageFactor)))
    ) : BigInt(0);
    // Amount of TokenB regarding the amount of shares and slippage selected
    const tokenBTotalWithSlippage = poolTotalShares ? (
        BigInt(Math.floor((Number(shareAmount) / Number(poolTotalShares) * Number(reserves.reservesB)) * (1 - slippageFactor)))
    ) : BigInt(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value || 0 });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitting(true)
        setError(false)
        try {
            await withdraw({
                to: account,
                share_amount: shareAmount,
                min_a: tokenATotalWithSlippage,
                min_b: tokenBTotalWithSlippage,
            }, { fee: 1000000 })
        } catch (error) {
            console.error(error);
            setError(true)
        }
        setSubmitting(false)
        setFormValues({
            ...formValues,
            sharePercent: "0"
        })
    };

    return (
        <form>
            <div className={styles.formContent}>
                <div className={styles.slider}>
                    <InputSlider
                        label="Pool Share amount"
                        name="sharePercent"
                        value={formValues.sharePercent}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.info}>
                    <div className={styles.contentLeft}>
                        <div className={styles.infoItem}>
                            <div className={styles.label}>
                                {tokenA.symbol} amount
                                <Tooltip title={"Estimated price based on the last pool query. If at the time of submission the amount is lower than this, the transaction will be cancelled."} placement="top">
                                    <div> <Icon name={IconNames.info} /></div>
                                </Tooltip>
                            </div>
                            <div>
                                {Utils.formatAmount(tokenATotalWithSlippage, tokenA.decimals)} {tokenA.symbol}
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.label}>
                                {tokenB.symbol} amount
                                <Tooltip title={"Estimated price based on the last pool query. If at the time of submission the amount is lower than this, the transaction will be cancelled."} placement="top">
                                    <div> <Icon name={IconNames.info} /></div>
                                </Tooltip>
                            </div>
                            <div>
                                {Utils.formatAmount(tokenBTotalWithSlippage, tokenB.decimals)} {tokenB.symbol}
                            </div>
                        </div>
                    </div>
                    <div className={styles.contentRight}>
                        <InputPercentage
                            label="Max slippage"
                            name="maxSlippage"
                            value={formValues.maxSlippage}
                            onChange={handleInputChange}
                            helpText="The percentage of variation accepted for the amount of each currency received."
                        />
                    </div>
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
                    Withdraw
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


export { Withdraw }