import {
  Options,
  TransactionCosts,
} from "stellar-plus/lib/stellar-plus/core/contract-engine/types";

export type LogEntry = { [key: string]: TransactionCosts };

export class profiler {
  private log: LogEntry[] = [];

  constructor() {}

  private costHandler = (methodName: string, costs: TransactionCosts): void => {
    const entry: LogEntry = {};
    entry[methodName] = costs;
    this.log.push(entry);
  };
  private txTimeHandler?: (methodName: string, elapsedTime: number) => void;

  public getOptionsArgs = (): Options => {
    return {
      debug: true,
      costHandler: this.costHandler,
      txTimeHandler: this.txTimeHandler,
    };
  };
}
