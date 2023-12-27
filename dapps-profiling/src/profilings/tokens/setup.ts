import { Network } from "stellar-plus/lib/stellar-plus/types";
import {
  AccountHandler,
  TransactionInvocation,
} from "../../utils/simulation/types";
import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { Profiler } from "stellar-plus/lib/stellar-plus/utils/profiler/soroban";
import { DemoUser } from "../../utils/simulation-types";

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

export const setupAssets = async (
  network: Network,
  issuer: AccountHandler,
  txInvocation: TransactionInvocation,
  profiler?: Profiler
): Promise<{
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
  sacToken: StellarPlus.Asset.SACHandler;
  tokenProfiler: Profiler;
  sacProfiler: Profiler;
}> => {
  const sorobanTokenWasm = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  const vcRpc = new StellarPlus.RPC.ValidationCloudRpcHandler(
    network,
    "Knct5k6sgFn2w2gPvBTOdOc3u5sNnLW9dt6kSLSPrs8"
  );

  const tokenProfiler = new StellarPlus.Utils.SorobanProfiler();

  const sorobanToken = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: sorobanTokenWasm,
    rpcHandler: vcRpc,
    options: tokenProfiler?.getOptionsArgs(),
  });

  console.log("Uploading Soroban Token WASM Files...");
  await sorobanToken.uploadWasm(txInvocation);

  console.log("Deploying Soroban Token instance... ");
  await sorobanToken.deploy(txInvocation);

  console.log("Initializing Soroban Token instance...");
  await sorobanToken.initialize({
    admin: issuer.getPublicKey(),
    decimal: 7,
    name: "Soroban Token",
    symbol: "SORO",
    ...txInvocation,
  });

  const sacProfiler = new StellarPlus.Utils.SorobanProfiler();

  console.log("Wrapping Classic Asset into SAC...");
  const sacToken = new StellarPlus.Asset.SACHandler({
    network,
    code: "SAC",
    issuerPublicKey: issuer.getPublicKey(),
    issuerAccount: issuer,
    rpcHandler: vcRpc,
    options: sacProfiler?.getOptionsArgs(),
  });

  sacToken.wrapAndDeploy(txInvocation);

  return { sorobanToken, sacToken, tokenProfiler, sacProfiler };
};
