import { Network } from "stellar-plus/lib/stellar-plus/types";
import {
  addTrustlinesToUsers,
  createBaseAccounts,
  mintSorobanTokensToUsers,
  setupAssets,
} from "./setup";
import { exportArrayToCSV } from "../../utils/export-to-csv";

export type tokensProfilingConfigType = {
  nUsers: number;
  nTransactions: number;
  network: Network;
  transactions?: tokenTransactions[];
};

export enum tokenTransactions {
  transfer = "transfer",
  transferFrom = "transferFrom",
  approve = "approve",
  mint = "mint",
  burn = "burn",
}

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

  const { sorobanToken, sacToken, tokenProfiler, sacProfiler } =
    await setupAssets(args.network, issuer, issuerTxInvocation);

  await addTrustlinesToUsers(users, opexTxInvocation, sacToken);
  await mintSorobanTokensToUsers(users, issuerTxInvocation, sorobanToken);

  // console.log("====================================");
  // console.log("Triggering Payments with SAC using Classic Handler...");
  // console.log("====================================");

  // for (let i = 0; i < args.nTransactions; i += users.length) {
  //   const promises = users.map((user) => {
  //     const userInvocation = {
  //       header: {
  //         source: user.getPublicKey(),
  //         fee: "1000000", //0.1 XLM as maximum fee
  //         timeout: 0,
  //       },
  //       signers: [user],
  //       feeBump: opexTxInvocation,
  //     };

  //     const receiver = users[Math.floor(Math.random() * users.length)];
  //     const amount = Math.floor(Math.random() * 100 + 1);
  //     console.log("Amount: ", amount);
  //     return sacToken.classicHandler.transfer({
  //       from: user.getPublicKey(),
  //       to: receiver.getPublicKey(),
  //       amount,
  //       ...userInvocation,
  //     });
  //   });

  //   await Promise.all(promises);
  //   console.log("Payments executed: ", i + users.length);
  // }

  console.log("====================================");
  console.log("Triggering Payments with SAC using Soroban Handler...");
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
      return sacToken.sorobanTokenHandler.transfer({
        from: user.getPublicKey(),
        to: receiver.getPublicKey(),
        amount,
        ...userInvocation,
      });
    });

    await Promise.all(promises);
    console.log("Payments executed: ", i + users.length);
  }

  console.log("====================================");
  console.log("Triggering Payments with pure soroban token...");
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
      return sorobanToken.transfer({
        from: user.getPublicKey(),
        to: receiver.getPublicKey(),
        amount,
        ...userInvocation,
      });
    });

    await Promise.all(promises);
    console.log("Payments executed: ", i + users.length);
  }

  console.log("====================================");

  console.log("Profiling Results: ");

  console.log(
    "SAC transfer invocations aggregated by standardDeviation: ",
    sacProfiler.getLog({
      filter: { methods: ["transfer"] },
      aggregate: { all: { method: "standardDeviation" } },
    })
  );

  console.log(
    "Soroban token transfer invocations aggregated by standardDeviation: ",
    tokenProfiler.getLog({
      filter: { methods: ["transfer"] },
      aggregate: { all: { method: "standardDeviation" } },
    })
  );

  const logDataSAC = sacProfiler.getLog({ formatOutput: "csv" });
  const columnsSAC = Object.keys(
    logDataSAC[0]
  ) as (keyof (typeof logDataSAC)[0])[];

  exportArrayToCSV(
    logDataSAC,
    "./src/export/assets_profiling_sac.csv",
    columnsSAC
  );

  const logDataToken = tokenProfiler.getLog({ formatOutput: "csv" });
  const columnsToken = Object.keys(
    logDataToken[0]
  ) as (keyof (typeof logDataToken)[0])[];

  exportArrayToCSV(
    logDataToken,
    "./src/export/assets_profiling_token.csv",
    columnsToken
  );
};
