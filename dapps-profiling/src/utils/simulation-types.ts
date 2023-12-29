import { AccountHandler, TransactionInvocation } from "./simulation/types";

export type DemoUser = {
  account: AccountHandler;
  transactionInvocation: TransactionInvocation;
};
