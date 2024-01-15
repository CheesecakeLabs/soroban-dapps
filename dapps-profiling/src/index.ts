import { Constants } from "stellar-plus/lib/stellar-plus";
import { tokensProfiling, tokenTransactions } from "./profilings/tokens";
import {
    cometDexProfiling,
    cometDexProfilingConfigType,
} from "./profilings/comet-dex";
import { liquidityPoolProfiling } from "./profilings/liquidity-pool";
import { liquidityPoolTransactions } from "./dapps/liquidity-pool/liquidity-pool-contract";


liquidityPoolProfiling({
    nUsers: 1,
    nTransactions: 2,
    transactions: [
        liquidityPoolTransactions.deposit,
        liquidityPoolTransactions.swap,
        liquidityPoolTransactions.get_rsrvs
    ],
    network: Constants.testnet
})

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//     nUsers: 3,
//     network: StellarPlus.Constants.futurenet,
// };
// cometDexProfiling(cometDexProfilingConfig);

// tokensProfiling({
//     nUsers: 5,
//     nTransactions: 10,
//     network: StellarPlus.Constants.testnet,
//     transactions: [
//         tokenTransactions.burn,
//         tokenTransactions.mint,
//         tokenTransactions.transfer,
//     ],
// });
