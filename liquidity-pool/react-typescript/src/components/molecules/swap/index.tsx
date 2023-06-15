import React, { FunctionComponent, useState } from 'react'

import { SorobanContextType } from "@soroban-react/core";
import { useSendTransaction, contractTransaction } from '@soroban-react/contracts'

import * as SorobanClient from 'soroban-client'

import BigNumber from 'bignumber.js';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';


import styles from './styles.module.scss'
import { Constants } from 'shared/constants'
import { IToken } from "interfaces/soroban/token"
import { IReserves } from "interfaces/soroban/liquidityPool"
import { Icon, IconNames, InputCurrency, InputPercentage, Tooltip } from "components/atoms"
import { SwapIcon, TokenAIcon, TokenBIcon } from 'components/icons';
import { ErrorText } from 'components/atoms/error-text';
import { bigNumberToI128 } from 'shared/convert';



interface IFormValues {
    buyAmount: string;
    sellAmount: string;
    maxSlippage: string;
}

interface ISwap {
    sorobanContext: SorobanContextType;
    account: string;
    tokenA: IToken;
    tokenB: IToken;
    reserves: IReserves;
}


const Swap: FunctionComponent<ISwap> = ({ sorobanContext, account, tokenA, tokenB, reserves }) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState(false)
    const { sendTransaction } = useSendTransaction()
    const [swapTokens, setSwapTokens] = useState({ buy: tokenA, buyIcon: TokenAIcon, sell: tokenB, sellIcon: TokenBIcon });
    const [formValues, setFormValues] = useState<IFormValues>({
        sellAmount: "0.00",
        buyAmount: "0.00",
        maxSlippage: "0.5",
    });

    const tokenAValue = reserves.reservesB.dividedBy(reserves.reservesA).toNumber()
    const tokenBValue = reserves.reservesA.dividedBy(reserves.reservesB).toNumber()
    const maxSold = parseFloat(formValues.sellAmount) + parseFloat(formValues.sellAmount) * parseFloat(formValues.maxSlippage) / 100

    const handleChangeTokensOrder = (e: React.MouseEvent): void => {
        e.preventDefault();
        setSwapTokens({
            buy: swapTokens.sell,
            buyIcon: swapTokens.sellIcon,
            sell: swapTokens.buy,
            sellIcon: swapTokens.buyIcon,
        })
        setFormValues({ ...formValues, sellAmount: formValues.buyAmount, buyAmount: formValues.sellAmount });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value || 0 });
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setSubmitting(true)
        setError(false)

        const buyA = swapTokens.buy == tokenA

        try {
            if (!sorobanContext.server) {
                throw new Error("Not connected to server");
            }

            const source = await sorobanContext.server?.getAccount(account);
            //  fn swap(e: Env, to: Address, buy_a: bool, out: i128, in_max: i128);
            const buyAmount = parseFloat(formValues.buyAmount)

            const tx = contractTransaction({
                source,
                networkPassphrase: sorobanContext.activeChain?.networkPassphrase || "",
                contractId: Constants.LIQUIDITY_POOL_ID,
                method: 'swap',
                params: [
                    new SorobanClient.Address(account).toScVal(),
                    SorobanClient.xdr.ScVal.scvBool(buyA),
                    bigNumberToI128(BigNumber(buyAmount).shiftedBy(7)),
                    bigNumberToI128(BigNumber(maxSold).shiftedBy(7)),
                ]
            });

            const result = await sendTransaction(tx, { sorobanContext });

            sorobanContext.connect()
            // Process the result or perform any additional actions

        } catch (error) {
            console.log(error);
            setError(true)
        }
        setSubmitting(false)
        setFormValues({
            ...formValues,
            sellAmount: "0.00",
            buyAmount: "0.00"
        })
    };
    return (
        <form>
            <div className={styles.formContent}>
                <div className={styles.formContentLeft}>
                    <InputCurrency
                        label={swapTokens.sell.symbol}
                        name="sellAmount"
                        value={formValues.sellAmount}
                        onChange={handleInputChange}
                        decimalScale={swapTokens.sell.decimals}
                        icon={swapTokens.sellIcon}
                    />
                    <div className={styles.changeOrder} >
                        <Button onClick={handleChangeTokensOrder}><SwapIcon /></Button>
                    </div>
                    <InputCurrency
                        label={swapTokens.buy.symbol}
                        name="buyAmount"
                        value={formValues.buyAmount}
                        onChange={handleInputChange}
                        decimalScale={swapTokens.buy.decimals}
                        icon={swapTokens.buyIcon}
                    />
                </div>

                <div className={styles.formContentRight}>
                    <div className={styles.info}>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>
                                Maximum sold
                                <Tooltip title={"Your transaction will revert if there is a large, unfavorable price movement before it is confirmed."} placement="top">
                                    <div> <Icon name={IconNames.info} /></div>
                                </Tooltip>
                            </div>
                            <div>{maxSold} {swapTokens.sell.symbol}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>Price
                                <Tooltip title={"Price based on the last pool query. It may vary until the transaction is confirmed."} placement="top">
                                    <div> <Icon name={IconNames.info} /></div>
                                </Tooltip>
                            </div>
                            <div>1 {tokenA.symbol} = {tokenAValue.toLocaleString()} {tokenB.symbol}</div>
                            <div>1 {tokenB.symbol} = {tokenBValue.toLocaleString()} {tokenA.symbol}</div>
                        </div>
                    </div>
                    <InputPercentage
                        label="Max slippage"
                        name="maxSlippage"
                        value={formValues.maxSlippage}
                        onChange={handleInputChange}
                        helpText="The percentage of variation accepted for the maximum amount sold."
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
                    disabled={parseFloat(formValues.buyAmount) == 0 && parseFloat(formValues.sellAmount) == 0}
                >
                    Swap
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

export { Swap }

