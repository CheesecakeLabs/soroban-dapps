import { StellarPlus } from "stellar-plus";
import { Account, Constants } from "stellar-plus/lib/stellar-plus";
import { executeLiquidityPool } from "./dapps/liquidity-pool";
import { tokensProfiling } from "./profilings/tokens";
import {
    cometDexProfiling,
    cometDexProfilingConfigType,
} from "./profilings/comet-dex";


executeLiquidityPool({ nUsers: 3, network: Constants.testnet })

const cometDexProfilingConfig: cometDexProfilingConfigType = {
    nUsers: 3,
    network: StellarPlus.Constants.futurenet,
};
cometDexProfiling(cometDexProfilingConfig);

