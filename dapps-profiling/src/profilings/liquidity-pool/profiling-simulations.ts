import { DemoUser } from "../../utils/simulation-types";
import {
  getRandomAmount,
} from "../../utils/simulation/functions";
import { LiquidityPoolContract } from "../../dapps/liquidity-pool/liquidity-pool-contract";

export type ProfileArgs = {
  nTransactions: number;
  users: DemoUser[];
  liquidityPoolContract: LiquidityPoolContract;
};

type depositArgs = {
  desiredA: number,
  minA: number,
  desiredB: number,
  minB: number,
}

export const profileDeposit = async ({
  liquidityPoolContract,
  users,
  nTransactions
}: ProfileArgs) => {

  console.log(`
    ====================================
    | Triggering ${nTransactions} deposit transactions in liquidity pool...
    | 
    |      (Parallel execution)
    ====================================
    `);

  const depositArgs: depositArgs = {
    desiredA: 1000000,
    desiredB: 1000000,
    minA: 1000000,
    minB: 1000000
  }

  let transaction = 0;
  while (transaction < nTransactions) {
    const promises = users.map((user) => {

      console.log(
        ` ${transaction + 1}/${nTransactions
        } - depositing A: ${depositArgs.desiredA}, B: ${depositArgs.desiredA} to user ${user.account.getPublicKey()} `
      );

      const newDepositArgs = {
        to: user.account.getPublicKey(),
        txInvocation: user.transactionInvocation,
        ...depositArgs,
      }
      transaction++
      return liquidityPoolContract.deposit(newDepositArgs);
    })
    await Promise.all(promises);
  }
  console.log("====================================");
};

type swapArgs = {
  buyA: boolean,
  out: number,
  inMax: number,
}

export const profileSwap = async ({
  liquidityPoolContract,
  users,
  nTransactions,
}: ProfileArgs) => {

  console.log(`
    ====================================
    | Triggering ${nTransactions} swaps transactions in liquidity pool...
    | 
    |      (Sequential execution)
    ====================================
    `);

  let transaction = 0;
  while (transaction < nTransactions) {
    const promises = users.map((user) => {
      const amount = Number(getRandomAmount(1, 10000))

      const swapArgs: swapArgs = {
        buyA: true,
        out: amount,
        inMax: 9999999999999999,
      }
      console.log(
        ` ${transaction + 1}/${nTransactions
        } - swap buy A: ${swapArgs.buyA}, in max: ${swapArgs.inMax} to user ${user.account.getPublicKey()} `
      );

      const newSwapArgs = {
        to: user.account.getPublicKey(),
        txInvocation: user.transactionInvocation,
        ...swapArgs,

      }
      transaction++
      return liquidityPoolContract.swap(newSwapArgs);
    })
    await Promise.all(promises);
  }
  console.log("====================================");
};

type withdrawArgs = {
  shareAmount: number,
  minA: number,
  minB: number,
}

export const profileWithdraw = async ({
  liquidityPoolContract,
  users,
  nTransactions,
}: ProfileArgs) => {

  console.log(`
    ====================================
    | Triggering ${nTransactions} withdraw transactions in liquidity pool...
    | 
    |      (Parallel execution)
    ====================================
    `);

  let transaction = 0;
  while (transaction < nTransactions) {
    const promises = users.map((user) => {

      const withdrawArgs: withdrawArgs = {
        shareAmount: (10 * 10000000),
        minA: 10000000,
        minB: 10000000,
      }

      console.log(
        ` ${transaction + 1}/${nTransactions} 
        - Withdraw share amount: ${withdrawArgs.shareAmount}, min A: ${withdrawArgs.minA}, min B: ${withdrawArgs.minB} to user ${user.account.getPublicKey()} `
      );

      const newWithdrawArgs = {
        to: user.account.getPublicKey(),
        txInvocation: user.transactionInvocation,
        ...withdrawArgs,

      }
      transaction++
      return liquidityPoolContract.withdraw(newWithdrawArgs);
    })
    await Promise.all(promises);
  }
  console.log("====================================");
};

export const profileGetResources = async ({
  liquidityPoolContract,
  users,
  nTransactions,
}: ProfileArgs) => {

  console.log(`
    ====================================
    | Triggering ${nTransactions} get resources transaction in liquidity pool...
    | 
    |      (Parallel execution)
    ====================================
    `);

  let transaction = 0;
  while (transaction < nTransactions) {
    const promises = users.map((user) => {

      console.log(
        ` ${transaction + 1}/${nTransactions} 
        - Get Resources of liquidity pool`
      );
      transaction++
      return liquidityPoolContract.getReserves(user.transactionInvocation);
    })
    await Promise.all(promises);
  }
  console.log("====================================");
};
