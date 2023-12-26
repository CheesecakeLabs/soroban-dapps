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
