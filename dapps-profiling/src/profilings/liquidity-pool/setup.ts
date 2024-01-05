import { Network } from "stellar-plus/lib/stellar-plus/types";
import {
  AccountHandler,
  TransactionInvocation,
} from "../../utils/simulation/types";
import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { Profiler } from "stellar-plus/lib/stellar-plus/utils/profiler/soroban";
import { DemoUser } from "../../utils/simulation-types";
import { SorobanTokenHandler } from "stellar-plus/lib/stellar-plus/asset";
import { DefaultAccountHandler } from "stellar-plus/lib/stellar-plus/account";
import { Constants } from "stellar-plus/lib/stellar-plus";
import { LiquidityPoolContract } from "../../dapps/liquidity-pool/liquidity-pool-contract";
import { liquidityPoolSpec } from "../../dapps/liquidity-pool/constants";

export const createBaseAccounts = async (
  network: Network
): Promise<{
  opex: DemoUser;
  issuer: DemoUser;
}> => {
  console.log("Initializing base accounts... ");

  const opexAccount = new StellarPlus.Account.DefaultAccountHandler({
    network,
  });

  const issuerAccount = new StellarPlus.Account.DefaultAccountHandler({
    network,
  });

  console.log("Opex: ", opexAccount.getPublicKey());
  console.log("issuer: ", issuerAccount.getPublicKey());

  const promises = [
    opexAccount.friendbot?.initialize() as Promise<void>,
    issuerAccount.friendbot?.initialize() as Promise<void>,
  ];

  await Promise.all(promises).then(() => {
    console.log("Base accounts initialized!");
  });

  const opexTxInvocation = {
    header: {
      source: opexAccount.getPublicKey(),
      fee: "10000000", //1 XLM as maximum fee
      timeout: 30,
    },
    signers: [opexAccount],
  };

  const issuerTxInvocation = {
    header: {
      source: issuerAccount.getPublicKey(),
      fee: "1000000", //0.1 XLM as maximum fee
      timeout: 0,
    },
    signers: [issuerAccount],
    feeBump: opexTxInvocation,
  };

  const opex = {
    account: opexAccount,
    transactionInvocation: opexTxInvocation,
  };

  const issuer = {
    account: issuerAccount,
    transactionInvocation: issuerTxInvocation,
  };

  return { opex, issuer };
};

export type CreateAssetsArgs = {
  network: Network,
  txInvocation: TransactionInvocation,
  validationCloudApiKey?: string
}

export type CreateAssetsResult = {
  assetA: SorobanTokenHandler,
  assetB: SorobanTokenHandler,
}

export async function createAbundanceAsset({ network, txInvocation, validationCloudApiKey }: CreateAssetsArgs): Promise<CreateAssetsResult> {

  const abundanceAssetWasm = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  const vcRpc = validationCloudApiKey
    ? new StellarPlus.RPC.ValidationCloudRpcHandler(
      network,
      validationCloudApiKey
    )
    : undefined;

  const sorobanTokenA = new SorobanTokenHandler({
    network,
    wasm: abundanceAssetWasm,
    rpcHandler: vcRpc,
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
    wasm: abundanceAssetWasm,
    rpcHandler: vcRpc,
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

export type CreateContractArgs = {
  assetA: SorobanTokenHandler,
  assetB: SorobanTokenHandler,
  txInvocation: TransactionInvocation
}

export type CreateContractResponse = {
  liquidityPoolContract: LiquidityPoolContract,
  liquidityPoolProfiler: Profiler
}

export async function createLiquidityPoolContract({
  assetA, assetB, txInvocation
}: CreateContractArgs): Promise<CreateContractResponse> {

  console.log("====================================");
  console.log("Deploying Contract");
  console.log("====================================");

  const liquidityPoolWasm = await loadWasmFile(
    "./src/dapps/liquidity-pool/wasm/soroban_liquidity_pool_contract.optimized.wasm"
  );

  const liquidityPoolProfiler = new StellarPlus.Utils.SorobanProfiler();

  const liquidityPoolContract = new LiquidityPoolContract({
    network: Constants.testnet,
    spec: liquidityPoolSpec,
    wasm: liquidityPoolWasm,
    options: liquidityPoolProfiler?.getOptionsArgs(),
  })

  await liquidityPoolContract.uploadWasm(txInvocation)
  await liquidityPoolContract.deploy(txInvocation)

  const assetAId = assetA.getContractId()
  if (!assetAId) {
    throw "assetAId not found"
  }

  const assetBId = assetB.getContractId()
  if (!assetBId) {
    throw "assetBId not found"
  }

  const tokenWasmHash = assetA.getWasmHash()
  if (!tokenWasmHash) {
    throw "Wasm Hash not found"
  }

  console.log("====================================");
  console.log("Initialize Contract");
  console.log("====================================");

  console.log("liquidityPoolContract Id:", liquidityPoolContract.getContractId());

  await liquidityPoolContract.initialize({
    tokenWasmHash: tokenWasmHash,
    tokenA: assetAId,
    tokenB: assetBId,
    txInvocation: txInvocation
  })

  console.log("liquidityPoolContract reserves:", await liquidityPoolContract.getReserves(txInvocation))

  return { liquidityPoolContract, liquidityPoolProfiler }
}
