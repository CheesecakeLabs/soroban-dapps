import { StellarPlus } from "stellar-plus";
import { tokensProfiling } from "./profilings/tokens";
import {
  cometDexProfiling,
  cometDexProfilingConfigType,
} from "./profilings/comet-dex";

const cometDexProfilingConfig: cometDexProfilingConfigType = {
  nUsers: 1,
  network: StellarPlus.Constants.futurenet,
};

cometDexProfiling(cometDexProfilingConfig);

// tokensProfiling({
//   nUsers: 5,
//   nTransactions: 15,
//   network: StellarPlus.Constants.testnet,
// });
