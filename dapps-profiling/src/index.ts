import { Constants } from "stellar-plus/lib/stellar-plus";
import { tokensProfiling, tokenTransactions } from "./profilings/tokens";
import {
    cometDexProfiling,
    cometDexProfilingConfigType,
} from "./profilings/comet-dex";
import { liquidityPoolProfiling } from "./profilings/liquidity-pool";
import { liquidityPoolTransactions } from "./dapps/liquidity-pool/liquidity-pool-contract";


liquidityPoolProfiling({
    nUsers: 3,
    nTransactions: 10,
    transactions: [
        liquidityPoolTransactions.deposit,
        liquidityPoolTransactions.swap,
        liquidityPoolTransactions.get_rsrvs,
        liquidityPoolTransactions.withdraw
    ],
    networkConfig: Constants.testnet
})

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//     nUsers: 3,
//     networkConfig: Constants.testnet
// };
// cometDexProfiling(cometDexProfilingConfig);

// tokensProfiling({
//     nUsers: 5,
//     nTransactions: 10,
//     network: Constants.testnet,
//     transactions: [
//         tokenTransactions.burn,
//         tokenTransactions.mint,
//         tokenTransactions.transfer,
//     ],
// });
