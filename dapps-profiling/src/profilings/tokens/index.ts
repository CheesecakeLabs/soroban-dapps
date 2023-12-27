import { Network } from "stellar-plus/lib/stellar-plus/types";
import { createBaseAccounts, setupAssets } from "./setup";

import {
  mintSorobanTokensToUsers,
  setupDemuUsers,
} from "../../utils/simulation/functions";
import { DemoUser } from "../../utils/simulation-types";
import {
  profileBurn,
  profileMinting,
  profilePayments,
} from "./profiling-simulations";

export type tokensProfilingConfigType = {
  nUsers: number;
  nTransactions: number;
  network: Network;
  transactions?: tokenTransactions[];
};

export enum tokenTransactions {
  transfer = "transfer",
  // transferFrom = "transferFrom",
  // approve = "approve",
  mint = "mint",
  burn = "burn",
}

/**
 * @args {tokensProfilingConfigType} args
 * @param {number} args.nUsers - Number of users to be created
 * @param {number} args.nTransactions - Number of transactions to be executed in each testing phase
 * @param {Network} args.network - Network to be used
 * @param {tokenTransactions[]} args.transactions - Transactions to be executed. If not provided, all transactions will be executed
 * If the mint transaction is not provided, the tests are skipped for this transactin but still, the mint transaction will be executed for each user during setup.
 *
 * @description This function will execute the following steps:
 * 1. Create base accounts - opex and issuer accounts. Opex will be used to pay for the transactions, issuer will be used to issue and manage the tokens.
 * 2. Setup assets - Soroban token and SAC token. Soroban token is a pure soroban token, SAC token is a classic token wrapped in a soroban contract.
 * 3. Setup users - Create users, add trustlines to the tokens and mint tokens to the users.
 * 4. Execute transactions - Execute transactions with the tokens and users created in the previous steps. Everything is captured by the profiler for later analysis.
 * 5. Export results - Export the results to a CSV file.
 **/
export const tokensProfiling = async (args: tokensProfilingConfigType) => {
  const { opex, issuer } = await createBaseAccounts(args.network);

  const { sorobanToken, sacToken, tokenProfiler, sacProfiler } =
    await setupAssets(
      args.network,
      issuer.account,
      issuer.transactionInvocation
    );

  const users: DemoUser[] = await setupDemuUsers({
    nOfUsers: args.nUsers,
    network: args.network,
    feeBump: opex.transactionInvocation,
    addTrustline: [
      {
        asset: sacToken.classicHandler,
        mintAmount: "1",
      },
    ],
  });

  const sorobanTokenDecimals = await sorobanToken.decimals(
    issuer.transactionInvocation
  );
  const classicTokenDecimals = await sacToken.sorobanTokenHandler.decimals(
    issuer.transactionInvocation
  );

  const mintAmountSorobanToken = (
    1000000 *
    10 ** sorobanTokenDecimals
  ).toString();
  const mintAmountSAC = (1000000 * 10 ** classicTokenDecimals).toString();

  await mintSorobanTokensToUsers({
    users,
    issuer,
    token: sorobanToken,
    mintAmount: mintAmountSorobanToken,
  });

  await mintSorobanTokensToUsers({
    users,
    issuer,
    token: sacToken.sorobanTokenHandler,
    mintAmount: mintAmountSAC,
  });

  // ====================================
  // Profiling minting transactions
  // ====================================

  if (args.transactions?.includes(tokenTransactions.mint)) {
    await profileMinting({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken,
    });

    await profileMinting({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken: sacToken.sorobanTokenHandler,
    });
  }

  // ====================================
  // Profiling payments transactions
  // ====================================

  if (args.transactions?.includes(tokenTransactions.transfer)) {
    await profilePayments({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken,
    });

    await profilePayments({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken: sacToken.sorobanTokenHandler,
    });
  }

  // ====================================
  // Profiling burn transactions
  // ====================================

  if (args.transactions?.includes(tokenTransactions.burn)) {
    await profileBurn({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken,
    });

    await profileBurn({
      nTransactions: args.nTransactions,
      users,
      issuer,
      sorobanToken: sacToken.sorobanTokenHandler,
    });
  }

  // console.log("profiler results: ", tokenProfiler.getLog());

  // console.log("====================================");
  // console.log("Triggering Payments with SAC using Soroban Handler...");
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
  //     return sacToken.sorobanTokenHandler.transfer({
  //       from: user.getPublicKey(),
  //       to: receiver.getPublicKey(),
  //       amount,
  //       ...userInvocation,
  //     });
  //   });

  //   await Promise.all(promises);
  //   console.log("Payments executed: ", i + users.length);
  // }

  // console.log("====================================");
  // console.log("Triggering Payments with pure soroban token...");
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
  //     return sorobanToken.transfer({
  //       from: user.getPublicKey(),
  //       to: receiver.getPublicKey(),
  //       amount,
  //       ...userInvocation,
  //     });
  //   });

  //   await Promise.all(promises);
  //   console.log("Payments executed: ", i + users.length);
  // }

  // console.log("====================================");

  // console.log("Profiling Results: ");

  // console.log(
  //   "SAC transfer invocations aggregated by standardDeviation: ",
  //   sacProfiler.getLog({
  //     filter: { methods: ["transfer"] },
  //     aggregate: { all: { method: "standardDeviation" } },
  //   })
  // );

  // console.log(
  //   "Soroban token transfer invocations aggregated by standardDeviation: ",
  //   tokenProfiler.getLog({
  //     filter: { methods: ["transfer"] },
  //     aggregate: { all: { method: "standardDeviation" } },
  //   })
  // );

  // const logDataSAC = sacProfiler.getLog({ formatOutput: "csv" });
  // const columnsSAC = Object.keys(
  //   logDataSAC[0]
  // ) as (keyof (typeof logDataSAC)[0])[];

  // exportArrayToCSV(
  //   logDataSAC,
  //   "./src/export/assets_profiling_sac.csv",
  //   columnsSAC
  // );

  // const logDataToken = tokenProfiler.getLog({ formatOutput: "csv" });
  // const columnsToken = Object.keys(
  //   logDataToken[0]
  // ) as (keyof (typeof logDataToken)[0])[];

  // exportArrayToCSV(
  //   logDataToken,
  //   "./src/export/assets_profiling_token.csv",
  //   columnsToken
  // );
};
