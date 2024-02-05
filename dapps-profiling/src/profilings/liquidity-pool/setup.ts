import { NetworkConfig } from "stellar-plus/lib/stellar-plus/types";
import {
  TransactionInvocation,
} from "../../utils/simulation/types";
import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { DemoUser } from "../../utils/simulation-types";
import { SorobanTokenHandler } from "stellar-plus/lib/stellar-plus/asset";
import { LiquidityPoolContract } from "../../dapps/liquidity-pool/liquidity-pool-contract";
import { liquidityPoolSpec } from "../../dapps/liquidity-pool/constants";
import { ProfilerPlugin } from "stellar-plus/lib/stellar-plus/utils/pipeline/plugins/soroban-transaction/profiler";
import { DebugPlugin } from "stellar-plus/lib/stellar-plus/utils/pipeline/plugins/generic/debug";
import { SorobanTransactionPipelinePlugin } from "stellar-plus/lib/stellar-plus/core/pipelines/soroban-transaction/types";
import { AutoRestorePlugin } from "stellar-plus/lib/stellar-plus/utils/pipeline/plugins/simulate-transaction/auto-restore";

export const createBaseAccounts = async (
  networkConfig: NetworkConfig
): Promise<{
  opex: DemoUser;
  issuer: DemoUser;
}> => {
  console.log("Initializing base accounts... ");

  const opexAccount = new StellarPlus.Account.DefaultAccountHandler({
    networkConfig,
  });

  const issuerAccount = new StellarPlus.Account.DefaultAccountHandler({
    networkConfig,
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
      fee: "100000000", //10 XLM as maximum fee
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
  networkConfig: NetworkConfig,
  txInvocation: TransactionInvocation,
  validationCloudApiKey?: string
}

export type CreateAssetsResult = {
  assetA: SorobanTokenHandler,
  assetB: SorobanTokenHandler,
}

export async function createAsset({ networkConfig, txInvocation, validationCloudApiKey }: CreateAssetsArgs): Promise<CreateAssetsResult> {

  const assetWasm = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  const vcRpc = validationCloudApiKey
    ? new StellarPlus.RPC.ValidationCloudRpcHandler(
      networkConfig,
      validationCloudApiKey
    )
    : undefined;

  const sorobanTokenA = new SorobanTokenHandler({
    networkConfig,
    contractParameters: {
      wasm: assetWasm,
    },
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
    networkConfig,
    contractParameters: {
      wasm: assetWasm
    },
    options: {
      sorobanTransactionPipeline: {
        customRpcHandler: vcRpc
      }
    }
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

  if (!sorobanTokenA.getContractId()) {
    throw "assetAId not found"
  }
  if (!sorobanTokenB.getContractId()) {
    throw "assetAId not found"
  }

  if ((Number(sorobanTokenA.getContractId())) >= (Number(sorobanTokenB.getContractId()))) {
    return { assetA: sorobanTokenB, assetB: sorobanTokenA }
  }

  return { assetA: sorobanTokenA, assetB: sorobanTokenB }
}

export type CreateContractArgs = {
  assetA: SorobanTokenHandler,
  assetB: SorobanTokenHandler,
  txInvocation: TransactionInvocation,
  networkConfig: NetworkConfig
}

export type CreateContractResponse = {
  liquidityPoolContract: LiquidityPoolContract,
  liquidityPoolProfiler: ProfilerPlugin
}

export async function createLiquidityPoolContract({
  assetA, assetB, txInvocation, networkConfig
}: CreateContractArgs): Promise<CreateContractResponse> {

  console.log("====================================");
  console.log("Deploying Contract");
  console.log("====================================");

  const liquidityPoolWasm = await loadWasmFile(
    "./src/dapps/liquidity-pool/wasm/soroban_liquidity_pool_contract.optimized.wasm"
  );

  const liquidityPoolProfiler = new ProfilerPlugin();
  const autoRestorePlugin = new AutoRestorePlugin(txInvocation, networkConfig)

  const liquidityPoolContract = new LiquidityPoolContract({
    networkConfig: networkConfig,
    contractParameters: {
      spec: liquidityPoolSpec,
      wasm: liquidityPoolWasm,
    },
    options: {
      sorobanTransactionPipeline: {
        plugins: [liquidityPoolProfiler, autoRestorePlugin]
      },
    }
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

  return { liquidityPoolContract, liquidityPoolProfiler }
}
