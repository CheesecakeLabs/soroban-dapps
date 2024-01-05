import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { DefaultAccountHandler } from "stellar-plus/lib/stellar-plus/account";
import { SorobanTokenHandler } from "stellar-plus/lib/stellar-plus/asset";
import { LiquidityPoolContract } from "./liquidity-pool-contract";
import { Constants } from "stellar-plus/lib/stellar-plus";
import { liquidityPoolSpec } from "./constants";
import { TransactionInvocation } from "../../utils/simulation/types";

export type CreateAssetsArgs = {
  network: Network,
  txInvocation: TransactionInvocation,
  admin: DefaultAccountHandler
}

export type CreateAssetsResult = {
  assetA: SorobanTokenHandler,
  assetB: SorobanTokenHandler
}

export async function createAbundanceAssetWithId({ network, txInvocation, admin }: CreateAssetsArgs): Promise<CreateAssetsResult> {
  const abundanceAssetWasm = await loadWasmFile(
    "./src/dapps/liquidity-pool/wasm/abundance_token.optimized.wasm"
  );

  const vcRpc = new StellarPlus.RPC.ValidationCloudRpcHandler(
    network,
    "Knct5k6sgFn2w2gPvBTOdOc3u5sNnLW9dt6kSLSPrs8"
  );

  const sorobanTokenA = new SorobanTokenHandler({
    network,
    wasm: abundanceAssetWasm,
    rpcHandler: vcRpc,
    contractId: "CD5MC5UUWGDXI6OY4PJTZOBMXHXJHFKCVT6A4I2W7G2N6GNKK76EL46W"
  });
  console.log("Uploading Soroban Token A WASM Files...");
  await sorobanTokenA.uploadWasm(txInvocation);

  console.log("Deploying Soroban Token A instance... ");
  await sorobanTokenA.deploy(txInvocation);

  console.log("Initializing Soroban Token instance...");
  await sorobanTokenA.initialize({
    admin: admin.getPublicKey(),
    decimal: 7,
    name: "Token A",
    symbol: "TOKA",
    ...txInvocation,
  });

  const sorobanTokenB = new SorobanTokenHandler({
    network,
    wasm: abundanceAssetWasm,
    rpcHandler: vcRpc,
    contractId: "CCYFKJUW4RT4RZ72SIFPJIUDLXTRSHC55XOAOG6YMIGRKG4KMQS7PU76"
  });
  console.log("Uploading Soroban Token B WASM Files...");
  await sorobanTokenB.uploadWasm(txInvocation);

  console.log("Deploying Soroban Token B instance... ");
  await sorobanTokenB.deploy(txInvocation);

  console.log("Initializing Soroban Token B instance...");
  await sorobanTokenB.initialize({
    admin: admin.getPublicKey(),
    decimal: 7,
    name: "Token B",
    symbol: "TOKB",
    ...txInvocation,
  });

  return { assetA: sorobanTokenA, assetB: sorobanTokenB }
}

export async function createAbundanceAsset({ network, txInvocation }: CreateAssetsArgs): Promise<CreateAssetsResult> {

  const abundanceAssetWasm = await loadWasmFile(
    "./src/dapps/liquidity-pool/wasm/abundance_token.optimized.wasm"
  );

  // const vcRpc = new StellarPlus.RPC.ValidationCloudRpcHandler(
  //   network,
  //   "u-6YvsQsbJ0h3HfAmKGybTejJV6hncVNAOxK3LtI8ec"
  // );

  const sorobanTokenA = new SorobanTokenHandler({
    network,
    wasm: abundanceAssetWasm,
  });

  console.log("Uploading Soroban Token A WASM Files...");
  await sorobanTokenA.uploadWasm(txInvocation)
  console.log("deploy Soroban Token A...");
  await sorobanTokenA.deploy(txInvocation)
  console.log("initialize Soroban Token A...");
  await sorobanTokenA.initialize({
    admin: txInvocation.header.source,
    decimal: 7,
    name: "Token A",
    symbol: "TAKA",
    ...txInvocation
  })

  const sorobanTokenB = new SorobanTokenHandler({
    network,
    wasm: abundanceAssetWasm
  });

  console.log("Uploading Soroban Token B WASM Files...");
  await sorobanTokenB.uploadWasm(txInvocation)

  console.log("Deploy Soroban Token B...");
  await sorobanTokenB.deploy(txInvocation)

  console.log("Initialize Soroban Token B...");
  await sorobanTokenB.initialize({
    admin: txInvocation.header.source,
    decimal: 7,
    name: "Token B",
    symbol: "TAKB",
    ...txInvocation
  })

  return { assetA: sorobanTokenA, assetB: sorobanTokenB }
}

export async function createLiquidityPoolContract({ network }: CreateAssetsArgs): Promise<LiquidityPoolContract> {

  console.log("====================================");
  console.log("Creating Admin");
  console.log("====================================");

  const admin = new StellarPlus.Account.DefaultAccountHandler({ network: network });
  await admin.friendbot?.initialize()

  const adminTxInvocation = {
    header: {
      source: admin.getPublicKey(),
      fee: "1000000", //0.1 XLM as maximum fee
      timeout: 30,
    },
    signers: [admin],
  };

  console.log("====================================");
  console.log("Creating Assets...");
  console.log("====================================");

  const { assetA, assetB } = await createAbundanceAsset({ network: Constants.testnet, txInvocation: adminTxInvocation, admin })

  console.log("====================================");
  console.log("Deploying Contract");
  console.log("====================================");

  const liquidityPoolWasm = await loadWasmFile(
    "./src/dapps/liquidity-pool/wasm/soroban_liquidity_pool_contract.optimized.wasm"
  );

  const liquidityPool = new LiquidityPoolContract({
    network: Constants.testnet,
    spec: liquidityPoolSpec,
    wasm: liquidityPoolWasm
  })

  const assetAId = assetA.getContractId()
  if (!assetAId) {
    throw "assetAId not found"
  }
  console.log("assetAId: ", assetAId)

  const assetBId = assetB.getContractId()
  if (!assetBId) {
    throw "assetBId not found"
  }
  console.log("assetBId: ", assetBId)

  // const poolWasmHashBuffer = await loadWasmFile(
  //     "./src/dapps/liquidity-pool/wasm/token_wasm_hash"
  // );

  // const poolWasmHash = liquidityPool.getWasmHash()
  // if (!poolWasmHash) {
  //     throw "Wasm Hash not found"
  // }

  // console.log("poolWasmHashss", poolWasmHashBuffer.toString())

  console.log("====================================");
  console.log("Initialize Contract");
  console.log("====================================");

  console.log("liquidityPool Id:", liquidityPool.getContractId());

  return <any>""
}