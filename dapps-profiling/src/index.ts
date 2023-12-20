import { StellarPlus } from "stellar-plus";
import {
  cometDexProfiling,
  cometDexProfilingConfigType,
} from "./dapps/comet-contracts";

const cometDexProfilingConfig: cometDexProfilingConfigType = {
  nUsers: 3,
  network: StellarPlus.Constants.futurenet,
};

cometDexProfiling(cometDexProfilingConfig);
