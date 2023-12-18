import { StellarPlus } from "stellar-plus";
import { initializeBaseAccounts, initializeContracts } from "./setup";
export const cometDexProfiling = async (
  network: typeof StellarPlus.Constants.testnet
) => {
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

  const { factoryEngine, contractsEngine } = await initializeContracts(
    network,
    opexTxInvocation
  );

  console.log("Initializing Factory...");
  await factoryEngine.init({
    user: admin.getPublicKey(),
    poolWasmHash: contractsEngine.getWasmHash() as string,
    txInvocation: adminTxInvocation,
  });
};
