import { StellarPlus } from "stellar-plus";
import { createUsers, deployContracts, initializeBaseAccounts } from "./setup";

export type cometDexProfilingConfigType = {
  nUsers: number;
  network: typeof StellarPlus.Constants.testnet;
};

export const cometDexProfiling = async (args: cometDexProfilingConfigType) => {
  const { nUsers, network } = args;

  console.log("Initiating Comet DEX Profiling!");

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

  console.log("Creating users...");
  const users = await createUsers(nUsers, network, opexTxInvocation);
};
