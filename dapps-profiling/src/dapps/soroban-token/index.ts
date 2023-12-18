import { StellarPlus } from "stellar-plus";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";

export class SorobanToken extends StellarPlus.ContractEngine {
  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  public async init(args: { controller: string; txInvocation: any }) {
    const { controller, txInvocation } = args;
    const { contractId } = this;

    const initArgs = {
      controller,
    };

    return this.execute({
      contractId,
      functionName: "init",
      args: initArgs,
      txInvocation,
    });
  }
}
