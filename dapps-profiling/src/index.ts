import { StellarPlus } from "stellar-plus";
import { tokenTransactions, tokensProfiling } from "./profilings/tokens";
import {
  cometDexProfiling,
  cometDexProfilingConfigType,
} from "./profilings/comet-dex";

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//   nUsers: 3,
//   network: StellarPlus.Constants.futurenet,
// };

// cometDexProfiling(cometDexProfilingConfig);

tokensProfiling({
  nUsers: 3,
  nTransactions: 15,
  network: StellarPlus.Constants.testnet,
  transactions: [tokenTransactions.burn],
});
