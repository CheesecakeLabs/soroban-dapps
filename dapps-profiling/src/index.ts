import { StellarPlus } from "stellar-plus";
import { tokenTransactions, tokensProfiling } from "./profilings/tokens";

tokensProfiling({
  nUsers: 5,
  nTransactions: 100,
  network: StellarPlus.Constants.testnet,
  transactions: [
    tokenTransactions.burn,
    tokenTransactions.mint,
    tokenTransactions.transfer,
  ],
});
