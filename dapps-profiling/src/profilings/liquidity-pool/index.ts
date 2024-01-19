import { Network } from "stellar-plus/lib/stellar-plus/types";
import {
  createAsset,
  createBaseAccounts,
  createLiquidityPoolContract,
} from "./setup";

import {
  mintSorobanTokensToUsers,
  setupDemoUsers,
} from "../../utils/simulation/functions";
import { DemoUser } from "../../utils/simulation-types";
import { exportArrayToCSV } from "../../utils/export-to-csv";
import { liquidityPoolTransactions } from "../../dapps/liquidity-pool/liquidity-pool-contract";
import {
  profileDeposit,
  profileGetResources,
  profileSwap,
  profileWithdraw,
} from "./profiling-simulations";

export type liquidityPoolProfilingType = {
  nUsers: number;
  nTransactions: number;
  network: Network;
  transactions: liquidityPoolTransactions[];
  validationCloudApiKey?: string;
};

/**
 * @args {liquidityPoolProfilingType} args
 * @param {number} nUsers - Number of users to be created
 * @param {number} nTransactions - Number of transactions to be executed in each testing phase
 * @param {Network} network - Network to be used
 * @param {liquidityPoolTransactions[]} transactions - Transactions to be executed. If not provided, all transactions will be executed
 * If the mint transaction is not provided, the tests are skipped for this transactin but still, the mint transaction will be executed for each user during setup.
 *
 * @description This function will execute the following steps:
 * 1. Create base accounts - opex and issuer accounts. Opex will be used to pay for the transactions, issuer will be used to issue and manage the tokens.
 * 2. Setup assets - Soroban token and SAC token. Soroban token is a pure soroban token, SAC token is a classic token wrapped in a soroban contract.
 * 3. Setup users - Create users, add trustlines to the tokens and mint tokens to the users.
 * 4. Execute transactions - Execute transactions with the tokens and users created in the previous steps. Everything is captured by the profiler for later analysis.
 * 5. Export results - Export the results to a CSV file.
 **/
export const liquidityPoolProfiling = async ({
  nUsers,
  nTransactions,
  network,
  transactions,
  validationCloudApiKey,
}: liquidityPoolProfilingType) => {
  const { opex, issuer } = await createBaseAccounts(network);
  const { assetA, assetB } = await createAsset({
    network: network,
    txInvocation: issuer.transactionInvocation,
    validationCloudApiKey,
  });

  const users: DemoUser[] = await setupDemoUsers({
    nOfUsers: nUsers,
    network,
    feeBump: opex.transactionInvocation,
  });

  const sorobanTokenDecimals = await assetA.decimals(
    issuer.transactionInvocation
  );

  const mintAmountSorobanToken = (
    1000000 *
    10 ** sorobanTokenDecimals
  ).toString();

  await mintSorobanTokensToUsers({
    users,
    issuer,
    token: assetA,
    mintAmount: mintAmountSorobanToken,
  });

  await mintSorobanTokensToUsers({
    users,
    issuer,
    token: assetB,
    mintAmount: mintAmountSorobanToken,
  });

  console.log("====================================");
  console.log("Create Liquidity Pool Contract!");
  console.log("====================================");

  const { liquidityPoolContract, liquidityPoolProfiler } =
    await createLiquidityPoolContract({
      assetA,
      assetB,
      txInvocation: issuer.transactionInvocation,
      network,
    });

  console.log("====================================");
  console.log("Profiling Deposit!");
  console.log("====================================");

  if (transactions?.includes(liquidityPoolTransactions.deposit)) {
    await profileDeposit({
      liquidityPoolContract: liquidityPoolContract,
      nTransactions: nTransactions,
      users: users,
    });
  }

  if (transactions?.includes(liquidityPoolTransactions.swap)) {
    await profileSwap({
      liquidityPoolContract: liquidityPoolContract,
      nTransactions: nTransactions,
      users: users,
    });
  }

  if (transactions?.includes(liquidityPoolTransactions.withdraw)) {
    await profileWithdraw({
      liquidityPoolContract: liquidityPoolContract,
      nTransactions: nTransactions,
      users: users,
    });
  }

  if (transactions?.includes(liquidityPoolTransactions.get_rsrvs)) {
    await profileGetResources({
      liquidityPoolContract: liquidityPoolContract,
      nTransactions: nTransactions,
      users: users,
    });
  }

  const logLiquidityPool = liquidityPoolProfiler.getLog({
    formatOutput: "csv",
  });
  const columnsLog = Object.keys(
    logLiquidityPool[0]
  ) as (keyof (typeof logLiquidityPool)[0])[];

  console.log(
    "Exporting Liquidity Pool data to file liquidity_pool_profiling.csv"
  );

  exportArrayToCSV(
    logLiquidityPool,
    "./src/export/liquidity_pool_profiling.csv",
    columnsLog
  );

  console.log("====================================");
  console.log("Finished profiling Liquidity Pool!");
  console.log("====================================");
};
