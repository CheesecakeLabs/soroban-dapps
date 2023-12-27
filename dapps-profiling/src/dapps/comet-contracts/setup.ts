import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { factorySpec, contractsSpec } from "./constants";
import { FactoryClient } from "./factory-client";
import { ContractClient } from "./comet-client";
import { AccountHandler, TransactionInvocation } from "../../utils/lib-types";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { TransactionCosts } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";

export const initializeBaseAccounts = async (
  network: typeof StellarPlus.Constants.testnet,
  opexSecret?: string, adminSecret?: string
): Promise<{
  opex: StellarPlus.Account.DefaultAccountHandler;
  admin: StellarPlus.Account.DefaultAccountHandler;
}> => {
  const opex = new StellarPlus.Account.DefaultAccountHandler({ network, secretKey: opexSecret });
  console.log("Initializing opex account... ", opex.getPublicKey());
  if (!opexSecret)
    await [opex.friendbot?.initialize() as Promise<void>];

  const admin = new StellarPlus.Account.DefaultAccountHandler({ network, secretKey: adminSecret });
  console.log("Initializing admin account... ", admin.getPublicKey());
  if (!adminSecret)
    await (admin.friendbot?.initialize() as Promise<void>);

  console.log("Base accounts initialized!");

  return { opex, admin };
};

export const deployContracts = async (
  network: typeof StellarPlus.Constants.testnet,
  txInvocation: any,
  factoryId?: string,
  cometId?: string,
): Promise<{
  factoryClient: FactoryClient;
  cometClient: ContractClient;
}> => {
  console.log("Loading WASM Files...");
  const factoryWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/factory.wasm"
  );
  const cometWasm = await loadWasmFile(
    "./src/dapps/comet-contracts/wasm/contracts.wasm"
  );

  const factoryClient = new FactoryClient({
    network,
    wasm: factoryWasm,
    spec: factorySpec,
    contractId: factoryId,
    options: { debug: true, costHandler: defaultCostHandler }
  });

  const cometClient = new ContractClient({
    network,
    wasm: cometWasm,
    spec: contractsSpec,
    contractId: cometId,
    options: { debug: true, costHandler: defaultCostHandler }
  });

  console.log("Uploading WASM Files...");
  await cometClient.uploadWasm(txInvocation);
  await factoryClient.uploadWasm(txInvocation);
  console.log("Contracts WASM uploaded!");


  if (!cometId) {
    console.log("Deploying comet instance...");
    await cometClient.deploy(txInvocation);
    console.log("Contracts instance deployed!");
  }

  if (!factoryId) {
    console.log("Deploying factory instance...");
    await factoryClient.deploy(txInvocation);
    console.log("Contracts instance deployed!");
  }

  return { factoryClient, cometClient };
};

export const createUsers = async (
  nUsers: number,
  network: typeof StellarPlus.Constants.testnet,
  txInvocation: any,
  userSecrets?: string[],
) => {
  const users = [];

  if (userSecrets) {
    for (let i = 0; i < nUsers; i++) {
      const user = new StellarPlus.Account.DefaultAccountHandler({ network, secretKey: userSecrets[i] });
      users.push(user);
      console.log("Initializing user account: ", user.getPublicKey());
    }
    return users;
  }

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
  txInvocation: TransactionInvocation,
  users?: AccountHandler[],
  assetAId?: string,
  assetBId?: string
): Promise<{
  assetA: StellarPlus.Asset.SorobanTokenHandler;
  assetB: StellarPlus.Asset.SorobanTokenHandler;
}> => {
  const wasmBuffer = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  console.log("Initiating Asset A...");
  const assetA = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: wasmBuffer,
    contractId: assetAId
  });

  if (!assetAId) {
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
  }

  console.log("Initiating Asset B...");
  const assetB = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: wasmBuffer,
    contractId: assetBId
  });

  if (!assetBId) {
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
  }

  console.log("Asset A: ", assetA.getContractId())
  console.log("Asset B: ", assetB.getContractId())

  if (users) {
    console.log("Minting assets")
    users.push(issuer);
    for (let user of users) {
      for (let asset of [assetA, assetB]) {
        await asset.mint({
          to: user.getPublicKey(),
          amount: BigInt(1000000000000000),
          ...txInvocation,
        })
      }
    }
  }

  return { assetA, assetB };
};

function defaultCostHandler(methodName: string, costs: TransactionCosts): void {
  console.log("Debugging method: ", methodName)
  console.log(costs);
  console.log(
    `${costs.cpuInstructions},${costs.ram},${costs.minResourceFee},` +
    `${costs.ledgerReadBytes},${costs.ledgerWriteBytes},` +
    `${costs.ledgerEntryReads},${costs.ledgerEntryWrites},` +
    `${(costs.eventSize || 0) + (costs.returnValueSize || 0)},${costs.transactionSize}`
  );
}