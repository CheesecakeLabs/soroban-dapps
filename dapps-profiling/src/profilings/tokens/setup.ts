import { Network } from "stellar-plus/lib/stellar-plus/types";
import { AccountHandler, TransactionInvocation } from "../../utils/lib-types";
import { StellarPlus } from "stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";

export const createBaseAccounts = async (
  network: Network,
  nUsers: number
): Promise<{
  opex: AccountHandler;
  issuer: AccountHandler;
  users: AccountHandler[];
}> => {
  console.log("Initializing base accounts... ");

  const opex = new StellarPlus.Account.DefaultAccountHandler({ network });
  const issuer = new StellarPlus.Account.DefaultAccountHandler({ network });
  const users: AccountHandler[] = [];

  console.log("Opex: ", opex.getPublicKey());
  console.log("issuer: ", issuer.getPublicKey());

  for (let i = 0; i < nUsers; i++) {
    const user = new StellarPlus.Account.DefaultAccountHandler({ network });
    users.push(user);
    console.log(`User ${i + 1}: `, user.getPublicKey());
  }

  const promises = [
    opex.friendbot?.initialize() as Promise<void>,
    issuer.friendbot?.initialize() as Promise<void>,
    ...users.map((user) => user.friendbot?.initialize() as Promise<void>),
  ];

  await Promise.all(promises).then(() => {
    console.log("Base accounts initialized!");
  });

  return { opex, issuer, users };
};

export const setupAssets = async (
  network: Network,
  issuer: AccountHandler,
  txInvocation: TransactionInvocation
): Promise<{
  sorobanToken: StellarPlus.Asset.SorobanTokenHandler;
  sacToken: StellarPlus.Asset.SACHandler;
}> => {
  const sorobanTokenWasm = await loadWasmFile(
    "./src/dapps/soroban-token/wasm/soroban_token_contract.wasm"
  );

  const vcRpc = new StellarPlus.RPC.ValidationCloudRpcHandler(
    network,
    "Knct5k6sgFn2w2gPvBTOdOc3u5sNnLW9dt6kSLSPrs8"
  );

  const sorobanToken = new StellarPlus.Asset.SorobanTokenHandler({
    network,
    wasm: sorobanTokenWasm,
    rpcHandler: vcRpc,
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

  console.log("Wrapping Classic Asset into SAC...");
  const sacToken = new StellarPlus.Asset.SACHandler({
    network,
    code: "SAC",
    issuerPublicKey: issuer.getPublicKey(),
    issuerAccount: issuer,
    rpcHandler: vcRpc,
  });

  sacToken.wrapAndDeploy(txInvocation);

  return { sorobanToken, sacToken };
};

export const addTrustlinesToUsers = async (
  users: AccountHandler[],
  feeBump: TransactionInvocation,
  sacToken: StellarPlus.Asset.SACHandler
): Promise<void> => {
  const promises = users.map((user) => {
    const userInvocation = {
      header: {
        source: user.getPublicKey(),
        fee: "1000000", //0.1 XLM as maximum fee
        timeout: 0,
      },
      signers: [user],
      feeBump,
    };

    console.log(`Adding trustline to user: `, user.getPublicKey());

    return sacToken.classicHandler.addTrustlineAndMint({
      to: user.getPublicKey(),
      amount: "1000000",
      ...userInvocation,
    });
  });

  return await Promise.all(promises).then(() => {
    console.log("Trustlines added to users!");
  });
};
