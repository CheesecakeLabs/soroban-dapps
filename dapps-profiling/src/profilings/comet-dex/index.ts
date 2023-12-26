import { StellarPlus } from "stellar-plus";
import {
  createUsers,
  deployContracts,
  initializeBaseAccounts,
  setupAssets,
} from "./setup";

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
      fee: "10000000", //1 XLM as maximum fee
      timeout: 30,
    },
    signers: [opex],
  };

  const adminTxInvocation = {
    header: {
      source: admin.getPublicKey(),
      fee: "1000000", //0.1 XLM as maximum fee
      timeout: 30,
    },
    signers: [admin],
    feeBump: opexTxInvocation,
  };
  console.log("====================================");
  console.log("Creating Core Contracts...");
  console.log("====================================");
  const { factoryClient, cometClient } = await deployContracts(
    network,
    opexTxInvocation
  );

  console.log("Factory Id", factoryClient.getContractId());
  console.log("Contracts Id", cometClient.getContractId());

  console.log("Initializing Factory...");
  await factoryClient.init({
    user: admin.getPublicKey(),
    poolWasmHash: cometClient.getWasmHash() as string,
    txInvocation: adminTxInvocation,
  });

  console.log("Initializing Pool Contract...");
  await cometClient.init({
    factory: factoryClient.getContractId() as string,
    controller: admin.getPublicKey(),
    txInvocation: adminTxInvocation,
  });

  console.log("====================================");
  console.log("Creating users...");
  console.log("====================================");
  const users = await createUsers(nUsers, network, opexTxInvocation);

  console.log("====================================");
  console.log("Creating Assets...");
  console.log("====================================");
  const { assetA, assetB } = await setupAssets(
    network,
    admin,
    adminTxInvocation
  );

  console.log("====================================");
  console.log(
    "get C admin: ",
    (
      await factoryClient.get_c_admin({ txInvocation: adminTxInvocation })
    ).toString()
  );
};
