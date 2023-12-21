import { StellarPlus } from "stellar-plus";
import { Account, Constants } from "stellar-plus/lib/stellar-plus";
import { executeLiquidityPool } from "./dapps/liquidity-pool";


// cometDexProfiling(cometDexProfilingConfig);
executeLiquidityPool({ nUsers: 3, network: Constants.testnet })
