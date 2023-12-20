import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { factorySpec, contractsSpec } from "./constants";
import { FactoryClient } from "./factory-client";
import { ContractClient } from "./comet-client";
import { AccountHandler, TransactionInvocation } from "../../utils/lib-types";
import { Network } from "stellar-plus/lib/stellar-plus/types";

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
  factoryClient: FactoryClient;
  cometClient: ContractClient;
}> => {
  console.log("Loading WASM Files...");
  const factoryWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/factory.optimized.wasm"
  );
  const cometWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/contracts.optimized.wasm"
  );

  const factoryClient = new FactoryClient({
    network,
    wasm: factoryWasm,
    spec: factorySpec,
  });

  const cometClient = new ContractClient({
    network,
    wasm: cometWasm,
    spec: contractsSpec,
  });

  console.log("Uploading WASM Files...");

  //cannot perform async because of sequence number of the opex
  await cometClient.uploadWasm(txInvocation);
  await factoryClient.uploadWasm(txInvocation);

  console.log("Contracts WASM uploaded!");
  console.log("Deploying instances...");

  //cannot perform async because of sequence number of the opex
  await cometClient.deploy(txInvocation);
  await factoryClient.deploy(txInvocation);

  console.log("Contracts instance deployed!");

  return { factoryClient, cometClient };
};

export const createUsers = async (
  nUsers: number,
  network: typeof StellarPlus.Constants.testnet,
  txInvocation: any
) => {
  const users = [];
  const promises = [];

  for (let i = 0; i < nUsers; i++) {
    const user = new StellarPlus.Account.DefaultAccountHandler({ network });
    users.push(user);
    console.log("Initializing user account: ", user.getPublicKey());
    promises.push(user.friendbot?.initialize() as Promise<void>);
  }

  await Promise.all(promises).then(() => {
    console.log("User accounts initialized!");
  });

  return users;
};

export const setupAssets = async (
  network: Network,
  issuer: AccountHandler,
  txInvocation: TransactionInvocation
): Promise<{
  assetA: StellarPlus.Asset.SorobanTokenHandler;
  assetB: StellarPlus.Asset.SorobanTokenHandler;
}> => {
  const wasmBuffer = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  const assetA = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: wasmBuffer,
  });

  console.log("Initiating Asset A...");
  console.log("Uploading WASM Files...");
  await assetA.uploadWasm(txInvocation);
  console.log("Deploying instance... ");
  await assetA.deploy(txInvocation);
  console.log("Initializing instance...");
  await assetA.initialize({
    admin: issuer.getPublicKey(),
    decimal: 7,
    name: "Asset A",
    symbol: "ASTA",
    ...txInvocation,
  });

  const assetB = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: wasmBuffer,
  });

  console.log("Initiating Asset B...");
  console.log("Uploading WASM Files...");
  await assetB.uploadWasm(txInvocation);
  console.log("Deploying instance... ");
  await assetB.deploy(txInvocation);
  console.log("Initializing instance...");
  await assetB.initialize({
    admin: issuer.getPublicKey(),
    decimal: 7,
    name: "Asset B",
    symbol: "ASTB",
    ...txInvocation,
  });

  return { assetA, assetB };
};
