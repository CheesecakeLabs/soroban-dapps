import { StellarPlus } from "stellar-plus";
import {
  createUsers,
  deployContracts,
  initializeBaseAccounts,
  setupAssets,
} from "./setup";
import { exportArrayToCSV } from "../../utils/export-to-csv";


export type aquariusProfilingConfigType = {
  nUsers: number;
  network: typeof StellarPlus.Constants.testnet;
};

export const aquariusProfiling = async (args: aquariusProfilingConfigType) => {
  const { nUsers, network } = args;

  console.log("====================================");
  console.log("Initiating Aquarius Profiling!");
  console.log("====================================");
  const { opex, admin } = await initializeBaseAccounts(network, "SDDAOPC6BLNJQ43NGWDIH433XHV4JOBPNFXVFDW6FD5GYO2O4RLTP33Y", "SDDAOPC6BLNJQ43NGWDIH433XHV4JOBPNFXVFDW6FD5GYO2O4RLTP33Y");

  const opexTxInvocation = {
    header: {
      source: opex.getPublicKey(),
      fee: "1000000000",
      timeout: 30,
    },
    signers: [opex],
  };

  const adminTxInvocation = {
    header: {
      source: admin.getPublicKey(),
      fee: "100000000",
      timeout: 30,
    },
    signers: [admin],
  };

  console.log("====================================");
  console.log("Creating Core Contracts...");
  console.log("====================================");
  const { poolRouterClient, poolClient, poolRouterProfiler, poolProfiler } = await deployContracts(
    network,
    opexTxInvocation
  );

  console.log("Factory Id", poolRouterClient.getContractId());
  console.log("Contracts Id", poolClient.getContractId());

  console.log("====================================");
  console.log("Creating users...");
  console.log("====================================");
  const users = await createUsers(nUsers, network, opexTxInvocation, ["SA4WTTZ4VEMC62TR27FECUDDQ7OAK3G4BUYEQQA3O75W4NZXPGXLOFVY"]);

  const user1TxInvocation = {
    header: {
      source: users[0].getPublicKey(),
      fee: "100000000",
      //0.1 XLM as maximum fee
      timeout: 30,
    },
    signers: [users[0]],
  };

  console.log("====================================");
  console.log("Creating Assets...");
  console.log("====================================");
  const mintingForUsers = users;
  mintingForUsers.push(admin);
  const { assetA, assetB, share } = await setupAssets(
    network,
    admin,
    adminTxInvocation,
    mintingForUsers,
  );

  assetA.approve({
    from: users[0].getPublicKey(),
    spender: poolClient.getContractId() as string,
    amount: 100000000000,
    live_until_ledger: 362428,
    txInvocation: user1TxInvocation,
  })

  assetB.approve({
    from: users[0].getPublicKey(),
    spender: poolClient.getContractId() as string,
    amount: 100000000000,
    live_until_ledger: 362428,
    txInvocation: user1TxInvocation,
  })

  // console.log("====================================");
  // console.log("Profiling factory");
  // console.log("====================================");
  // console.log("init");
  // await poolRouterClient.init({
  //   user: admin.getPublicKey(),
  //   poolWasmHash: poolClient.getWasmHash() as string,
  //   txInvocation: adminTxInvocation,
  // });

  // console.log("set_c_admin");
  // await poolRouterClient.set_c_admin({
  //   user: admin.getPublicKey(),
  //   caller: admin.getPublicKey(),
  //   admin: admin.getPublicKey(),
  //   txInvocation: adminTxInvocation
  // })

  // console.log("get_c_admin");
  // await poolRouterClient.get_c_admin({ txInvocation: adminTxInvocation, invoke: true })

  // console.log("new_c_pool");
  // const factoryPoolId = await (
  //   await poolRouterClient.new_c_pool({
  //     user: admin.getPublicKey(),
  //     txInvocation: adminTxInvocation
  //   })
  // ).toString();
  // console.log("is_c_pool");
  // await poolRouterClient.is_c_pool({
  //   addr: factoryPoolId,
  //   txInvocation: adminTxInvocation,
  //   invoke: true
  // })

  // console.log("collect");


  // const logDataPoolRouter = poolRouterProfiler.getLog({ formatOutput: "csv" });
  // const columnsPoolRouter = Object.keys(
  //   logDataPoolRouter[0]
  // ) as (keyof (typeof logDataPoolRouter)[0])[];

  // exportArrayToCSV(
  //   logDataPoolRouter,
  //   "./src/export/aquarius/pool-router-data.csv",
  //   columnsPoolRouter
  // );

  console.log("====================================");
  console.log("Profiling pool");
  console.log("====================================");
  console.log("initialize");
  await poolClient.initialize({
    lp_token_wasm_hash: share.getWasmHash() as string,
    tokens: [assetA.getContractId() as string, assetB.getContractId() as string],
    fee_fraction: 10,
    admin: admin.getPublicKey(),
    txInvocation: adminTxInvocation,
  });

  console.log("get_fee_fraction");
  await poolClient.get_fee_fraction({
    invoke: true,
    txInvocation: adminTxInvocation,
  });

  console.log("set_rewards_config");
  await poolClient.set_rewards_config({
    expired_at: BigInt(1703865035),
    tps: BigInt(10000000),
    admin: admin.getPublicKey(),
    txInvocation: adminTxInvocation,
  });

  console.log("share_id");

  const shareId = await (
    await poolClient.share_id({
      invoke: true,
      txInvocation: adminTxInvocation,
    })
  ).toString();
  const shareWithId = new StellarPlus.Asset.SorobanTokenHandler({
    contractId: shareId,
    network: network,
  });

  shareWithId.approve({
    from: users[0].getPublicKey(),
    spender: poolClient.getContractId() as string,
    amount: 100000000000,
    live_until_ledger: 362428,
    txInvocation: user1TxInvocation,
  })

  console.log("get_tokens");
  await poolClient.get_tokens({
    invoke: true,
    txInvocation: adminTxInvocation,
  });

  console.log("get_reserves");
  await poolClient.get_reserves({
    invoke: true,
    txInvocation: adminTxInvocation,
  });

  // console.log("version");
  // await poolClient.version({
  //   invoke: true,
  //   txInvocation: adminTxInvocation,
  // });

  console.log("deposit");
  await poolClient.deposit({
    user: users[0].getPublicKey(),
    desired_amounts: [BigInt(100000), BigInt(100000)],
    txInvocation: user1TxInvocation,
  });

  console.log("get_rewards_info");
  await poolClient.get_rewards_info({
    user: users[0].getPublicKey(),
    invoke: true,
    txInvocation: adminTxInvocation,
  });

  console.log("get_user_reward");
  await poolClient.get_user_reward({
    user: users[0].getPublicKey(),
    invoke: true,
    txInvocation: user1TxInvocation,
  });

  console.log("estimate_swap");
  await poolClient.estimate_swap({
    user: users[0].getPublicKey(),
    in_idx: 0,
    out_idx: 1,
    in_amount: BigInt(1000),
    txInvocation: user1TxInvocation,
  });

  console.log("swap");
  await poolClient.swap({
    user: users[0].getPublicKey(),
    in_idx: 0,
    out_idx: 1,
    in_amount: BigInt(10),
    out_min: BigInt(9),
    txInvocation: user1TxInvocation,
  });

  console.log("withdraw");
  await poolClient.withdraw({
    user: users[0].getPublicKey(),
    share_amount: BigInt(50000),
    min_amounts: [BigInt(1), BigInt(1)],
    txInvocation: user1TxInvocation,
  });

  console.log("claim");
  await poolClient.claim({
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation,
  });

  // console.log("upgrade");
  // await poolClient.upgrade({
  //   new_wasm_hash: poolClient.getWasmHash() as string,
  //   txInvocation: adminTxInvocation,
  // });

  const logDataPool = poolProfiler.getLog({ formatOutput: "csv" });
  const columnsPool = Object.keys(
    logDataPool[0]
  ) as (keyof (typeof logDataPool)[0])[];

  exportArrayToCSV(
    logDataPool,
    "./src/export/aquarius/pool-data.csv",
    columnsPool
  );
  console.log("Finished!");
};
