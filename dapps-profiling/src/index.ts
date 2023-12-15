import { StellarPlus } from "stellar-plus";
import { cometDexProfiling } from "./dapps/comet-contracts";

const network = StellarPlus.Constants.futurenet;

cometDexProfiling(network);
