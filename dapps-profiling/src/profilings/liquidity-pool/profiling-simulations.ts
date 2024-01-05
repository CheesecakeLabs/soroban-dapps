import { StellarPlus } from "stellar-plus";
import { DemoUser } from "../../utils/simulation-types";
import {
  getRandomAmount,
  getRandomEntryFromArray,
} from "../../utils/simulation/functions";
import { LiquidityPoolContract, depositArgs, liquidityPoolTransactions } from "../../dapps/liquidity-pool/liquidity-pool-contract";
import { DepositArgs } from "stellar-plus/lib/stellar-plus/soroban/contracts/certificate-of-deposit/types";

export type ProfileDepositArgs = {
  nTransactions: number;
  users: DemoUser[];
  liquidityPoolContract: LiquidityPoolContract;
  depositArgs: {
    desiredA: number,
    minA: number,
    desiredB: number,
    minB: number,
  }
};

liquidityPoolTransactions.deposit

export const profileDeposit = async ({
  liquidityPoolContract,
  users,
  nTransactions,
  depositArgs
}: ProfileDepositArgs) => {

  console.log(`
    ====================================
    | Triggering ${nTransactions} deposit transactions in liquidity pool...
    | 
    |      (Sequential execution)
    ====================================
    `);

  for (let i = 0; i < nTransactions; i++) {
    const user = getRandomEntryFromArray(users);

    console.log(
      ` ${i + 1}/${nTransactions
      } - depositing A: ${depositArgs.desiredA}, B: ${depositArgs.desiredA} to user ${user.account.getPublicKey()} `
    );

    const newDepositArgs = {
      to: user.account.getPublicKey(),
      txInvocation: user.transactionInvocation,
      ...depositArgs,

    }
    await liquidityPoolContract.deposit(newDepositArgs);
  }

  console.log("====================================");
};

export type ProfilePaymentsArgs = {
  nTransactions: number;
  users: DemoUser[];
  issuer: DemoUser;
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
};

export const profilePayments = async (args: ProfilePaymentsArgs) => {
  const { sorobanToken, issuer, users, nTransactions } = args;

  console.log(`
    ====================================
    | Triggering ${nTransactions} payment transactions with Soroban...
    | Token ${await sorobanToken.symbol(issuer.transactionInvocation)}
    | 
    |      (Parallel execution)
    ====================================
    `);

  const sorobanTokenDecimals = await sorobanToken.decimals(
    issuer.transactionInvocation
  );
  let i = 0;
  while (i < nTransactions) {
    const promises = users.map((user) => {
      const amount = BigInt(getRandomAmount(1, 500, sorobanTokenDecimals));

      // select another user to receive the payment
      const receiver = getRandomEntryFromArray(users.filter((u) => u !== user));

      console.log(
        `${i + 1}/${args.nTransactions} 
Sender ${user.account.getPublicKey()} is paying ${amount} tokens to 
Receiver ${receiver.account.getPublicKey()}`
      );

      i++;

      return sorobanToken.transfer({
        ...user.transactionInvocation,
        from: user.account.getPublicKey(),
        to: receiver.account.getPublicKey(),
        amount: amount,
      });
    });

    await Promise.all(promises);
  }

  console.log("====================================");
};

export type BurnProfileArgs = {
  nTransactions: number;
  users: DemoUser[];
  issuer: DemoUser;
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
};

export const profileBurn = async (args: BurnProfileArgs) => {
  const { sorobanToken, issuer, users, nTransactions } = args;

  console.log(`
    ====================================
    | Triggering ${nTransactions} burn transactions with Soroban...
    | Token ${await sorobanToken.symbol(issuer.transactionInvocation)}
    | 
    |      (Parallel execution)
    ====================================
    `);

  const sorobanTokenDecimals = await sorobanToken.decimals(
    issuer.transactionInvocation
  );
  let i = 0;
  while (i < nTransactions) {
    const promises = users.map((user) => {
      const amount = BigInt(getRandomAmount(1, 500, sorobanTokenDecimals));

      console.log(
        `${i + 1}/${args.nTransactions} 
User ${user.account.getPublicKey()} is burning ${amount} tokens`
      );

      i++;

      return sorobanToken.burn({
        ...user.transactionInvocation,
        from: user.account.getPublicKey(),
        amount: amount,
      });
    });

    await Promise.all(promises);
  }

  console.log("====================================");
};
