import { StellarPlus } from "stellar-plus";
import {
  createUsers,
  deployContracts,
  initializeBaseAccounts,
  setupAssets,
} from "./setup";
import { exportArrayToCSV } from "../../utils/export-to-csv";



export type cometDexProfilingConfigType = {
  nUsers: number;
  network: typeof StellarPlus.Constants.testnet;
};

export const cometDexProfiling = async (args: cometDexProfilingConfigType) => {
  const { nUsers, network } = args;

  console.log("====================================");
  console.log("Initiating Comet DEX Profiling!");
  console.log("====================================");
  const { opex, admin } = await initializeBaseAccounts(network);

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
  const { factoryClient, cometClient, factoryProfiler, cometProfiler } = await deployContracts(
    network,
    opexTxInvocation
  );

  console.log("Factory Id", factoryClient.getContractId());
  console.log("Contracts Id", cometClient.getContractId());

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
  const { assetA, assetB } = await setupAssets(
    network,
    admin,
    adminTxInvocation,
    mintingForUsers,
  );

  console.log("====================================");
  console.log("Profiling factory");
  console.log("====================================");
  console.log("init");
  await factoryClient.init({
    user: admin.getPublicKey(),
    poolWasmHash: cometClient.getWasmHash() as string,
    txInvocation: adminTxInvocation,
  });

  console.log("set_c_admin");
  await factoryClient.set_c_admin({
    user: admin.getPublicKey(),
    caller: admin.getPublicKey(),
    admin: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("get_c_admin");
  await factoryClient.get_c_admin({ txInvocation: adminTxInvocation, invoke: true })

  console.log("new_c_pool");
  const factoryPoolId = await (
    await factoryClient.new_c_pool({
      user: admin.getPublicKey(),
      txInvocation: adminTxInvocation
    })
  ).toString();

  console.log("is_c_pool");
  await factoryClient.is_c_pool({
    addr: factoryPoolId,
    txInvocation: adminTxInvocation,
    invoke: true
  })

  console.log("collect");
  await factoryClient.collect({
    addr: factoryPoolId,
    caller: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  const logDataFactory = factoryProfiler.getLog({ formatOutput: "csv" });
  const columnsFactory = Object.keys(
    logDataFactory[0]
  ) as (keyof (typeof logDataFactory)[0])[];

  exportArrayToCSV(
    logDataFactory,
    "./src/export/comet/factory-data.csv",
    columnsFactory
  );

  console.log("====================================");
  console.log("Profiling comet pool");
  console.log("====================================");
  console.log("init.");
  await cometClient.init({
    factory: factoryClient.getContractId() as string,
    controller: admin.getPublicKey(),
    txInvocation: adminTxInvocation,
  });

  console.log("bind");
  await cometClient.bind({
    token: assetB.getContractId() as string,
    balance: BigInt(10000000),
    denorm: BigInt(10000000),
    admin: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("unbind");
  await cometClient.unbind({
    token: assetB.getContractId() as string,
    user: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("bundleBind");
  await cometClient.bundleBind({
    token: [assetA.getContractId() as string, assetB.getContractId() as string],
    balance: [BigInt(40000000), BigInt(10000000)],
    denorm: [BigInt(120000000), BigInt(10000000)],
    txInvocation: adminTxInvocation
  })

  console.log("rebind");
  await cometClient.rebind({
    token: assetB.getContractId() as string,
    balance: BigInt(10000000),
    denorm: BigInt(10000000),
    admin: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("setSwapFee");
  await cometClient.setSwapFee({
    fee: BigInt(10),
    caller: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("finalize");
  await cometClient.finalize({
    txInvocation: adminTxInvocation
  })

  console.log("setPublicSwap");
  await cometClient.setPublicSwap({
    val: true,
    caller: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("joinPool");
  await cometClient.joinPool({
    poolAmountOut: BigInt(500000000),
    maxAmountsIn: [BigInt(120000000000000), BigInt(120000000000000)],
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("exitPool");
  await cometClient.exitPool({
    poolAmountIn: BigInt(500000000),
    minAmountsOut: [BigInt(0), BigInt(0)],
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("depositLPTokenAmountOutGetTokenIn");
  await cometClient.depositLPTokenAmountOutGetTokenIn({
    tokenIn: assetA.getContractId() as string,
    poolAmountOut: BigInt(300000),
    maxTokenAmountIn: BigInt(50000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("depositTokenAmountInGetLPTokensOut");
  await cometClient.depositTokenAmountInGetLPTokensOut({
    tokenIn: assetA.getContractId() as string,
    tokenAmountIn: BigInt(300000),
    minPoolAmountOut: BigInt(1000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("withdrawTokenAmountInGetLPTokensOut");
  await cometClient.withdrawTokenAmountInGetLPTokensOut({
    tokenOut: assetA.getContractId() as string,
    poolAmountIn: BigInt(300000),
    minAmountOut: BigInt(1000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("withdrawTokenAmountOutGetLPTokensIn");
  await cometClient.withdrawTokenAmountOutGetLPTokensIn({
    tokenOut: assetA.getContractId() as string,
    tokenAmountOut: BigInt(99),
    maxPoolAmountIn: BigInt(1000000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("swapExactAmountIn");
  await cometClient.swapExactAmountIn({
    tokenOut: assetB.getContractId() as string,
    tokenIn: assetA.getContractId() as string,
    tokenAmountIn: BigInt(10000000),
    minAmountOut: BigInt(10),
    maxPrice: BigInt(5000000000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("swapExactAmountOut");
  await cometClient.swapExactAmountOut({
    tokenOut: assetB.getContractId() as string,
    tokenIn: assetA.getContractId() as string,
    maxAmountIn: BigInt(30000000),
    tokenAmountOut: BigInt(30000),
    maxPrice: BigInt(5000000000),
    user: users[0].getPublicKey(),
    txInvocation: user1TxInvocation
  })

  console.log("gulp");
  await cometClient.gulp({
    t: assetB.getContractId() as string,
    txInvocation: user1TxInvocation
  })

  console.log("setFreezeStatus");
  await cometClient.setFreezeStatus({
    val: true,
    caller: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("setController");
  await cometClient.setController({
    manager: admin.getPublicKey(),
    caller: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })


  console.log("transfer");
  await cometClient.transfer({
    from: users[0].getPublicKey(),
    to: admin.getPublicKey(),
    amount: BigInt(7),
    txInvocation: user1TxInvocation
  })

  console.log("approve");
  await cometClient.approve({
    from: users[0].getPublicKey(),
    spender: admin.getPublicKey(),
    amount: BigInt(10000000),
    expirationLedger: 320158,
    txInvocation: user1TxInvocation
  })

  console.log("transferFrom");
  await cometClient.transferFrom({
    from: users[0].getPublicKey(),
    spender: admin.getPublicKey(),
    to: admin.getPublicKey(),
    amount: BigInt(10),
    txInvocation: adminTxInvocation
  })

  console.log("burnFrom");
  await cometClient.burnFrom({
    from: users[0].getPublicKey(),
    spender: admin.getPublicKey(),
    amount: BigInt(10),
    txInvocation: adminTxInvocation
  })

  console.log("allowance");
  await cometClient.allowance({
    from: users[0].getPublicKey(),
    spender: admin.getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("balanceOf");
  await cometClient.balanceOf({
    id: users[0].getPublicKey(),
    txInvocation: adminTxInvocation
  })

  console.log("name");
  await cometClient.name({
    txInvocation: adminTxInvocation
  })

  console.log("symbol");
  await cometClient.symbol({
    txInvocation: adminTxInvocation
  })

  console.log("decimals");
  await cometClient.decimals({
    txInvocation: adminTxInvocation
  })

  console.log("getTotalSupply");
  await cometClient.getTotalSupply({
    txInvocation: adminTxInvocation
  })

  console.log("isFinalized");
  await cometClient.isFinalized({
    txInvocation: adminTxInvocation
  })

  console.log("isPublicSwap");
  await cometClient.isPublicSwap({
    txInvocation: adminTxInvocation
  })

  console.log("getController");
  await cometClient.getController({
    txInvocation: adminTxInvocation
  })

  console.log("isBound");
  await cometClient.isBound({
    t: assetA.getContractId() as string,
    txInvocation: adminTxInvocation
  })

  console.log("getDenormalizedWeight");
  await cometClient.getDenormalizedWeight({
    token: assetA.getContractId() as string,
    txInvocation: adminTxInvocation
  })

  console.log("getTotalDenormalizedWeight");
  await cometClient.getTotalDenormalizedWeight({
    txInvocation: adminTxInvocation
  })

  console.log("getSpotPrice");
  await cometClient.getSpotPrice({
    tokenIn: assetA.getContractId() as string,
    tokenOut: assetB.getContractId() as string,
    txInvocation: adminTxInvocation
  })

  console.log("getSpotPriceSansFee");
  await cometClient.getSpotPriceSansFee({
    tokenIn: assetA.getContractId() as string,
    tokenOut: assetB.getContractId() as string,
    txInvocation: adminTxInvocation
  })

  console.log("getSwapFee");
  await cometClient.getSwapFee({
    txInvocation: adminTxInvocation
  })

  console.log("getDenormalizedWeight");
  await cometClient.getDenormalizedWeight({
    token: assetA.getContractId() as string,
    txInvocation: adminTxInvocation
  })

  console.log("getBalance");
  await cometClient.getBalance({
    token: assetA.getContractId() as string,
    user: users[0].getPublicKey(),
    txInvocation: adminTxInvocation
  })

  const logDataComet = factoryProfiler.getLog({ formatOutput: "csv" });
  const columnsComet = Object.keys(
    logDataComet[0]
  ) as (keyof (typeof logDataComet)[0])[];

  exportArrayToCSV(
    logDataComet,
    "./src/export/comet/comet-data.csv",
    columnsComet
  );
  console.log("Finished!");
};
