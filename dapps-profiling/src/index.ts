import { StellarPlus } from "stellar-plus";
import { Constants } from "stellar-plus/lib/stellar-plus";
import { executeLiquidityPool } from "./dapps/liquidity-pool";
import { tokensProfiling, tokenTransactions } from "./profilings/tokens";
import {
    cometDexProfiling,
    cometDexProfilingConfigType,
} from "./profilings/comet-dex";


// executeLiquidityPool({ network: Constants.testnet })

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//     nUsers: 3,
//     network: StellarPlus.Constants.futurenet,
// };
// cometDexProfiling(cometDexProfilingConfig);


tokensProfiling({
    nUsers: 5,
    nTransactions: 10,
    network: StellarPlus.Constants.testnet,
    transactions: [
        tokenTransactions.burn,
        tokenTransactions.mint,
        tokenTransactions.transfer,
    ],
});
