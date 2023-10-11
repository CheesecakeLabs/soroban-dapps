import React, { FunctionComponent, useState } from 'react'

import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';

import styles from './styles.module.scss'
import { IToken } from "interfaces/soroban/token"
import { IReserves } from "interfaces/soroban/liquidityPool"
import { Icon, IconNames, InputCurrency, InputPercentage, Tooltip } from "components/atoms"
import { SwapIcon, TokenAIcon, TokenBIcon } from 'components/icons';
import { ErrorText } from 'components/atoms/error-text';
import { Address, Contract, networks } from 'liquidity-pool-contract'
import { contractLiquidityPool } from 'shared/contracts';

interface IFormValues {
    buyAmount: string;
    sellAmount: string;
    maxSlippage: string;
}
interface ISwap {
    account: Address;
    tokenA: IToken;
    tokenB: IToken;
    reserves: IReserves;
    onUpdate: () => void;
}

const Swap: FunctionComponent<ISwap> = ({ account, tokenA, tokenB, reserves, onUpdate }) => {
    const [isSubmitting, setSubmitting] = useState(false)
    const [error, setError] = useState(false)
    const [swapTokens, setSwapTokens] = useState({
        buy: { token: tokenA, icon: TokenAIcon },
        sell: { token: tokenB, icon: TokenBIcon },

    });

    const [formValues, setFormValues] = useState<IFormValues>({
        sellAmount: "0.00",
        buyAmount: "0.00",
        maxSlippage: "0.5",
    });

    // TokenA value in terms of TokenB based on pool reserves
    const tokenAInTokenB = reserves.reservesA ? reserves.reservesB / (reserves.reservesA) : 0;
    // TokenB value in terms of TokenA based on pool reserves
    const tokenBInTokenA = reserves.reservesB ? reserves.reservesA / (reserves.reservesB) : 0;
    // Maximum amount that will be sold based on sell amount and max slippage
    const maxSold = Math.ceil(parseFloat(formValues.sellAmount) * (1 + parseFloat(formValues.maxSlippage) / 100));

    const handleChangeTokensOrder = (e: React.MouseEvent): void => {
        e.preventDefault();
        setSwapTokens({
            buy: swapTokens.sell,
            sell: swapTokens.buy,
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

        try {
            await contractLiquidityPool.swap({
                to: account,
                buy_a: swapTokens.buy.token == tokenA,
                out: BigInt(parseFloat(formValues.buyAmount) * 10 ** swapTokens.buy.token.decimals),
                in_max: BigInt(maxSold * 10 ** swapTokens.sell.token.decimals),
            }, { fee: 100000 })
        } catch (error) {
            console.error(error);
            setError(true)
        }
        setSubmitting(false);
        setFormValues({
            ...formValues,
            sellAmount: "0.00",
            buyAmount: "0.00"
        });
        onUpdate();
    };
    return (
        <form>
            <div className={styles.formContent}>
                <div className={styles.formContentLeft}>
                    <InputCurrency
                        label={swapTokens.sell.token.symbol}
                        name="sellAmount"
                        value={formValues.sellAmount}
                        onChange={handleInputChange}
                        decimalScale={swapTokens.sell.token.decimals}
                        icon={swapTokens.sell.icon}
                    />
                    <div className={styles.changeOrder} >
                        <Button onClick={handleChangeTokensOrder}><SwapIcon /></Button>
                    </div>
                    <InputCurrency
                        label={swapTokens.buy.token.symbol}
                        name="buyAmount"
                        value={formValues.buyAmount}
                        onChange={handleInputChange}
                        decimalScale={swapTokens.buy.token.decimals}
                        icon={swapTokens.buy.icon}
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
                            <div>{maxSold} {swapTokens.sell.token.symbol}</div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.infoLabel}>Price
                                <Tooltip title={"Price based on the last pool query. It may vary until the transaction is confirmed."} placement="top">
                                    <div> <Icon name={IconNames.info} /></div>
                                </Tooltip>
                            </div>
                            <div>1 {tokenA.symbol} = {tokenAInTokenB.toLocaleString()} {tokenB.symbol}</div>
                            <div>1 {tokenB.symbol} = {tokenBInTokenA.toLocaleString()} {tokenA.symbol}</div>
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

