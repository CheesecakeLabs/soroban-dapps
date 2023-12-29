import { StellarPlus } from "stellar-plus";
import { tokensProfiling } from "./profilings/tokens";
import {
  cometDexProfiling,
  cometDexProfilingConfigType,
} from "./profilings/comet-dex";
import { aquariusProfiling, aquariusProfilingConfigType } from "./profilings/aquarius";

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//   nUsers: 1,
//   network: StellarPlus.Constants.testnet,
// };

// cometDexProfiling(cometDexProfilingConfig);

// tokensProfiling({
//   nUsers: 5,
//   nTransactions: 15,
//   network: StellarPlus.Constants.testnet,
// });


const aquariusProfilingConfig: aquariusProfilingConfigType = {
  nUsers: 1,
  network: StellarPlus.Constants.testnet,
};

aquariusProfiling(aquariusProfilingConfig);
