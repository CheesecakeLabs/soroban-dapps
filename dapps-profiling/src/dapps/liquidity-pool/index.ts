import { StellarPlus } from "stellar-plus";
import { LiquidityPoolContract } from "./liquidity-pool-contract";
import { Constants } from "stellar-plus/lib/stellar-plus";
import { loadWasmFile } from "../../utils/load-wasm";
import { liquidityPoolSpec } from "./constants";
import { Network } from "stellar-plus/lib/stellar-plus/types";
import { setupAssets } from "../../profilings/tokens/setup";
import { createAbundanceAsset, createAbundanceAssetWithId } from "./setup";

export type executeLiquidityPoolArgs = {
    network: Network;
};

export async function executeLiquidityPool({ network }: executeLiquidityPoolArgs) {

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

    // const liquidityPoolContractId = "CCTYFBJT4CTTQ766S54I4VEGAXPRGSEWL3SS2ZYAF62H6AZ42FDXNINE"
    const liquidityPool = new LiquidityPoolContract({
        network: Constants.testnet,
        spec: liquidityPoolSpec,
        wasm: liquidityPoolWasm
    })

    await liquidityPool.uploadWasm(adminTxInvocation)
    await liquidityPool.deploy(adminTxInvocation)

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

    const tokenWasmHash = assetA.getWasmHash()
    if (!tokenWasmHash) {
        throw "Wasm Hash not found"
    }

    console.log("====================================");
    console.log("Initialize Contract");
    console.log("====================================");

    console.log("liquidityPool Id:", liquidityPool.getContractId());

    await liquidityPool.initialize({
        tokenWasmHash: tokenWasmHash,
        tokenA: assetAId,
        tokenB: assetBId,
        txInvocation: adminTxInvocation
    })
    console.log("liquidityPool reserves:", await liquidityPool.getReserves(adminTxInvocation))
    // console.log("liquidityPool reserves:", await liquidityPool.getReserves(adminTxInvocation))
}