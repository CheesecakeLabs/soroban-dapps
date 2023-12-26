import { StellarPlus } from "stellar-plus";
import { LiquidityPoolContract } from "./liquidity-pool-contract";
import { Constants } from "stellar-plus/lib/stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { liquidityPoolSpec } from "./constants";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { setupAssets } from "../comet-contracts/setup";

export type executeLiquidityPoolArgs = {
    nUsers: number;
    network: Network;
};

export async function executeLiquidityPool({ nUsers, network }: executeLiquidityPoolArgs) {

    console.log("====================================");
    console.log("Creating Admin");
    console.log("====================================");

    const admin = new StellarPlus.Account.DefaultAccountHandler({ network: network });
    await admin.friendbot?.initialize()

    console.log("admin key", admin.getPublicKey())
    console.log("admin secret", admin.secretKey)

    const adminTxInvocation = {
        header: {
            source: admin.getPublicKey(),
            fee: "1000000", //0.1 XLM as maximum fee
            timeout: 30,
        },
        signers: [admin],
    };

    const liquidityPoolWasm = await loadWasmFile(
        "./src/dapps/liquidity-pool/wasm/soroban_liquidity_pool_contract.optimized.wasm"
    );

    const liquidityPool = new LiquidityPoolContract({
        network: Constants.testnet,
        spec: liquidityPoolSpec,
        wasm: liquidityPoolWasm
    })

    console.log("====================================");
    console.log("Deploying Contract");
    console.log("====================================");

    await liquidityPool.uploadWasm(adminTxInvocation);
    await liquidityPool.deploy(adminTxInvocation)

    console.log("====================================");
    console.log("Creating Assets...");
    console.log("====================================");
    const { assetA, assetB } = await setupAssets(
        network,
        admin,
        adminTxInvocation
    );

    const assetAId = assetA.getContractId()
    if (!assetAId) {
        throw "Asset A Id not found"
    }

    const assetBId = assetB.getContractId()
    if (!assetBId) {
        throw "Asset B Id not found"
    }

    console.log("====================================");
    console.log("Initialize Contract");
    console.log("====================================");

    const poolWasmHash = assetA.getWasmHash()
    if (!poolWasmHash) {
        throw "Wasm hash not found"
    }

    console.log("poolWasmHash: ", poolWasmHash)

    await liquidityPool.initialize({
        poolWasmHash: poolWasmHash,
        tokenA: assetAId,
        tokenB: assetBId,
        txInvocation: adminTxInvocation
    })

    // console.log("liquidityPool reserves:", await liquidityPool.getReserves(adminTxInvocation))
}