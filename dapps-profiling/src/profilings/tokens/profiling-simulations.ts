import { StellarPlus } from "stellar-plus";
import { DemoUser } from "../../utils/simulation-types";
import {
  getRandomAmount,
  getRandomEntryFromArray,
} from "../../utils/simulation/functions";

export type profileMintingArgs = {
  nTransactions: number;
  users: DemoUser[];
  issuer: DemoUser;
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
};

export const profileMinting = async (args: profileMintingArgs) => {
  const { sorobanToken, issuer, users, nTransactions } = args;

  console.log(`
    ====================================
    | Triggering ${nTransactions} mint transactions with Soroban...
    | Token ${await sorobanToken.symbol(issuer.transactionInvocation)}
    | 
    |      (Sequential execution)
    ====================================
    `);

  const sorobanTokenDecimals = await sorobanToken.decimals(
    issuer.transactionInvocation
  );

  for (let i = 0; i < nTransactions; i++) {
    const user = getRandomEntryFromArray(users);
    const amount = BigInt(getRandomAmount(1, 10000, sorobanTokenDecimals));

    console.log(
      ` ${i + 1}/${args.nTransactions} - minting ${amount} tokens to user: `,
      user.account.getPublicKey()
    );

    await sorobanToken.mint({
      ...issuer.transactionInvocation,
      amount: amount,
      to: user.account.getPublicKey(),
    });
  }

  console.log("====================================");
};

export type profilePaymentsArgs = {
  nTransactions: number;
  users: DemoUser[];
  issuer: DemoUser;
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
};

export const profilePayments = async (args: profilePaymentsArgs) => {
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

      console.log(`${i + 1}/${args.nTransactions} 
Sender ${user.account} is paying ${amount} tokens to 
Receiver ${receiver.account}`);

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
