import { StellarPlus } from "stellar-plus";
import { tokensProfiling } from "./profilings/tokens";
import {
  cometDexProfiling,
  cometDexProfilingConfigType,
} from "./dapps/comet-contracts";

const cometDexProfilingConfig: cometDexProfilingConfigType = {
  nUsers: 1,
  network: StellarPlus.Constants.testnet,
  useConfig: true,
  saveConfig: true
};

cometDexProfiling(cometDexProfilingConfig);

// tokensProfiling({
//   nUsers: 3,
//   nTransactions: 9,
//   network: StellarPlus.Constants.testnet,
// });
