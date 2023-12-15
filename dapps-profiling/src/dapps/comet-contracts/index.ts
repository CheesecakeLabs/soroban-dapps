import { StellarPlus } from "stellar-plus";
import { initializeContracts } from "./setup";
export const cometDexProfiling = async (
  network: typeof StellarPlus.Constants.testnet
) => {
  console.log("Initiating Comet DEX Profiling!");

  const opex = new StellarPlus.Account.DefaultAccountHandler({ network });
  console.log("Initializing opex account... ", opex.getPublicKey());
  await (opex.friendbot?.initialize() as Promise<void>);

  const opexTxInvocation = {
    header: {
      source: opex.getPublicKey(),
      fee: "10000000", //1 XLM as maximum fee
      timeout: 30,
    },
    signers: [opex],
  };

  const { factoryEngine, contractsEngine } = await initializeContracts(
    network,
    opexTxInvocation
  );
  console.log("Factory Engine: ", factoryEngine);
};
