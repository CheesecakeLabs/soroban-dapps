import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { factorySpec, contractsSpec } from "./constants";
import { FactoryClient } from "./factory-client";
import { AccountHandler, TransactionInvocation } from "../../utils/lib-types";

export const initializeBaseAccounts = async (
  network: typeof StellarPlus.Constants.testnet
): Promise<{
  opex: StellarPlus.Account.DefaultAccountHandler;
  admin: StellarPlus.Account.DefaultAccountHandler;
}> => {
  const opex = new StellarPlus.Account.DefaultAccountHandler({ network });
  console.log("Initializing opex account... ", opex.getPublicKey());
  const promises = [opex.friendbot?.initialize() as Promise<void>];

  const admin = new StellarPlus.Account.DefaultAccountHandler({ network });
  console.log("Initializing admin account... ", admin.getPublicKey());
  promises.push(admin.friendbot?.initialize() as Promise<void>);

  await Promise.all(promises).then(() => {
    console.log("Base accounts initialized!");
  });

  return { opex, admin };
};

export const deployContracts = async (
  network: typeof StellarPlus.Constants.testnet,
  txInvocation: any
): Promise<{
  factoryEngine: FactoryClient;
  contractsEngine: StellarPlus.ContractEngine;
}> => {
  console.log("Loading WASM Files...");
  const factoryWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/factory.optimized.wasm"
  );
  const contractsWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/contracts.optimized.wasm"
  );

  const factoryEngine = new FactoryClient({
    network,
    wasm: factoryWasm,
    spec: factorySpec,
  });

  const contractsEngine = new StellarPlus.ContractEngine({
    network,
    wasm: contractsWasm,
    spec: contractsSpec,
  });

  console.log("Uploading WASM Files...");

  //cannot perform async because of sequence number of the opex
  await contractsEngine.uploadWasm(txInvocation);
  await factoryEngine.uploadWasm(txInvocation);

  console.log("Contracts WASM uploaded!");
  console.log("Deploying instances...");

  //cannot perform async because of sequence number of the opex
  await contractsEngine.deploy(txInvocation);
  await factoryEngine.deploy(txInvocation);

  console.log("Contracts instance deployed!");

  return { factoryEngine, contractsEngine };
};
