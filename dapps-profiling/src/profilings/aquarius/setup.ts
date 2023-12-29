import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { AccountHandler, TransactionInvocation } from "../../utils/lib-types";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { Profiler } from "stellar-plus/lib/stellar-plus/utils/profiler/soroban";
import { PoolRouterClient } from "../../dapps/aquarius/pool-router-client";
import { PoolClient } from "../../dapps/aquarius/pool-client";
import { poolRouterSpec, poolSpec } from "../../dapps/aquarius/constants";

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
  poolRouterId?: string,
  poolId?: string,
): Promise<{
  poolRouterClient: PoolRouterClient;
  poolClient: PoolClient;
  poolRouterProfiler: Profiler;
  poolProfiler: Profiler;
}> => {
  console.log("Loading WASM Files...");
  const poolRouterWasm = await loadWasmFile(
    "./src/dapps/aquarius/wasm/soroban_liquidity_pool_router_contract.wasm"
  );
  const poolWasm = await loadWasmFile(
    "./src/dapps/aquarius/wasm/soroban_liquidity_pool_contract.wasm"
  );

  const poolRouterProfiler = new StellarPlus.Utils.SorobanProfiler();
  const poolRouterClient = new PoolRouterClient({
    network,
    wasm: poolRouterWasm,
    spec: poolRouterSpec,
    contractId: poolRouterId,
    options: poolRouterProfiler.getOptionsArgs()
  });

  const poolProfiler = new StellarPlus.Utils.SorobanProfiler();
  const poolClient = new PoolClient({
    network,
    wasm: poolWasm,
    spec: poolSpec,
    contractId: poolId,
    options: poolProfiler.getOptionsArgs()
  });

  console.log("Uploading WASM Files...");
  await poolClient.uploadWasm(txInvocation);
  await poolRouterClient.uploadWasm(txInvocation);
  console.log("Contracts WASM uploaded!");


  if (!poolId) {
    console.log("Deploying pool instance...");
    await poolClient.deploy(txInvocation);
    console.log("Contracts instance deployed!");
  }

  if (!poolRouterId) {
    console.log("Deploying poolRouter instance...");
    await poolRouterClient.deploy(txInvocation);
    console.log("Contracts instance deployed!");
  }

  return { poolRouterClient, poolClient, poolRouterProfiler, poolProfiler };
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
  mintingForUsers?: AccountHandler[],
  assetAId?: string,
  assetBId?: string
): Promise<{
  assetA: StellarPlus.Asset.SorobanTokenHandler;
  assetB: StellarPlus.Asset.SorobanTokenHandler;
  share: StellarPlus.Asset.SorobanTokenHandler;
}> => {
  const wasmBuffer = await loadWasmFile(
    "./src/dapps/aquarius/wasm/soroban_token_contract.wasm"
  );

  const shareWasmBuffer = await loadWasmFile(
    "./src/dapps/aquarius/wasm/soroban_token_contract.wasm"
  );

  console.log("Initiating Share Asset...");
  let share = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: shareWasmBuffer,
  });
  console.log("Uploading WASM Share...");
  await share.uploadWasm(txInvocation);

  console.log("Initiating Asset A...");
  let assetA = new StellarPlus.Asset.SorobanTokenHandler({
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
  let assetB = new StellarPlus.Asset.SorobanTokenHandler({
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

  if ((assetA.getContractId() as string) >= (assetB.getContractId() as string)) {
    let tempAssetA = assetA;
    assetA = assetB;
    assetB = tempAssetA
  }

  console.log("Asset A: ", assetA.getContractId())
  console.log("Asset B: ", assetB.getContractId())

  if (mintingForUsers) {
    console.log("Minting assets")
    for (let user of mintingForUsers) {
      for (let asset of [assetA, assetB]) {
        await asset.mint({
          to: user.getPublicKey(),
          amount: BigInt(1000000000000000),
          ...txInvocation,
        })
      }
    }
  }

  return { assetA, assetB, share };
};