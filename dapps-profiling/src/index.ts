import { StellarPlus } from "stellar-plus";
import { tokensProfiling } from "./profilings/tokens";
// import {
//   cometDexProfiling,
//   cometDexProfilingConfigType,
// } from "./dapps/comet-contracts";

// const cometDexProfilingConfig: cometDexProfilingConfigType = {
//   nUsers: 3,
//   network: StellarPlus.Constants.futurenet,
// };

// cometDexProfiling(cometDexProfilingConfig);

tokensProfiling({
  nUsers: 5,
  nTransactions: 15,
  network: StellarPlus.Constants.testnet,
});
