import { StellarPlus } from "stellar-plus";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { addTrustlinesToUsers, createBaseAccounts, setupAssets } from "./setup";

export type tokensProfilingConfigType = {
  nUsers: number;
  nTransactions: number;
  network: Network;
};

export const tokensProfiling = async (args: tokensProfilingConfigType) => {
  const { opex, issuer, users } = await createBaseAccounts(
    args.network,
    args.nUsers
  );

  const opexTxInvocation = {
    header: {
      source: opex.getPublicKey(),
      fee: "10000000", //1 XLM as maximum fee
      timeout: 30,
    },
    signers: [opex],
  };

  const issuerTxInvocation = {
    header: {
      source: issuer.getPublicKey(),
      fee: "1000000", //0.1 XLM as maximum fee
      timeout: 0,
    },
    signers: [issuer],
    feeBump: opexTxInvocation,
  };

  const { sorobanToken, sacToken } = await setupAssets(
    args.network,
    issuer,
    issuerTxInvocation
  );

  await addTrustlinesToUsers(users, opexTxInvocation, sacToken);

  console.log("====================================");
  console.log("Triggering Payments with SAC using Classic Handler...");
  console.log("====================================");

  for (let i = 0; i < args.nTransactions; i += users.length) {
    const promises = users.map((user) => {
      const userInvocation = {
        header: {
          source: user.getPublicKey(),
          fee: "1000000", //0.1 XLM as maximum fee
          timeout: 0,
        },
        signers: [user],
        feeBump: opexTxInvocation,
      };

      const receiver = users[Math.floor(Math.random() * users.length)];
      const amount = Math.floor(Math.random() * 100 + 1);
      console.log("Amount: ", amount);
      return sacToken.classicHandler.transfer({
        from: user.getPublicKey(),
        to: receiver.getPublicKey(),
        amount,
        ...userInvocation,
      });
    });

    await Promise.all(promises);
    console.log("Payments executed: ", i + users.length);
  }
};
