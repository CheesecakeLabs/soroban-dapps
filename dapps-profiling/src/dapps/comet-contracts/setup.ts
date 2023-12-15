import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { factorySpec, contractsSpec } from "./constants";

export const initializeContracts = async (
  network: typeof StellarPlus.Constants.testnet,
  txInvocation: any
): Promise<{
  factoryEngine: StellarPlus.ContractEngine;
  contractsEngine: StellarPlus.ContractEngine;
}> => {
  console.log("Loading WASM Files...");
  const factoryWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/factory.optimized.wasm"
  );
  const contractsWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/contracts.optimized.wasm"
  );

  const factoryEngine = new StellarPlus.ContractEngine({
    network,
    wasm: factoryWasm,
    spec: factorySpec,
  });

  const contractsEngine = new StellarPlus.ContractEngine({
    network,
    wasm: contractsWasm,
    spec: contractsSpec,
  });

  console.log("Uploading Contracts WASM Files...");
  await contractsEngine.uploadWasm(txInvocation);
  console.log("Contracts WASM uploaded!");
  console.log("Deploying instance...!");
  await contractsEngine.deploy(txInvocation);
  console.log("Contracts instance deployed!");

  console.log("Uploading Factory WASM Files...");
  await factoryEngine.uploadWasm(txInvocation);
  console.log("Factory WASM uploaded!");
  console.log("Deploying instance...!");
  await factoryEngine.deploy(txInvocation);
  console.log("Factory instance deployed!");

  return { factoryEngine, contractsEngine };
};
