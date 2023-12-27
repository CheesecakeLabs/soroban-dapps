import { StellarPlus } from "stellar-plus";
import { TransactionInvocation } from "../../utils/lib-types";
import { randomBytes } from "crypto";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { hexStringToBytes32 } from "../../utils/converters";

enum methods {
  init = "init",
  new_c_pool = "new_c_pool",
  set_c_admin = "set_c_admin",
  collect = "collect",
  is_c_pool = "is_c_pool",
  get_c_admin = "get_c_admin",
}

export class FactoryClient extends StellarPlus.ContractEngine {
  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  async init(args: {
    user: string;
    poolWasmHash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      pool_wasm_hash: hexStringToBytes32(args.poolWasmHash),
    };

    await this.invokeContract({
      method: methods.init,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async new_c_pool(args: {
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<string> {
    const methodArgs = {
      user: args.user,
      salt: randomBytes(32),
    };

    return (await this.invokeContract({
      method: methods.new_c_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    })) as string;
  }

  async set_c_admin(args: {
    caller: string;
    user: string;
    admin: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      caller: args.caller,
      user: args.user,
    };

    await this.invokeContract({
      method: methods.set_c_admin,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async collect(args: {
    caller: string;
    addr: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      caller: args.caller,
      addr: args.addr,
    };

    await this.invokeContract({
      method: methods.collect,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async is_c_pool(args: {
    addr: string;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<boolean> {
    const methodArgs = {
      addr: args.addr,
    };

    return (await this.invokeOrReadFromContract(
      methods.is_c_pool,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as boolean;
  }

  async get_c_admin(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.get_c_admin,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;

  }

  private async invokeOrReadFromContract(
    method: string,
    methodArgs: object,
    txInvocation: TransactionInvocation,
    invoke: boolean,
  ): Promise<any> {
    if (invoke) {
      return (await this.invokeContract({
        method: method,
        methodArgs: methodArgs,
        ...txInvocation,
      }));
    }
    return (await this.readFromContract({
      method: method,
      methodArgs: methodArgs,
      header: txInvocation.header,
    }));
  }

}
