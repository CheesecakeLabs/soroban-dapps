import { StellarPlus } from "stellar-plus";
import { TransactionInvocation } from "../../utils/simulation/types";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { hexStringToBytes32 } from "../../utils/converters";

enum methods {
  pool_type = "pool_type",
  initialize = "initialize",
  share_id = "share_id",
  get_tokens = "get_tokens",
  deposit = "deposit",
  swap = "swap",
  estimate_swap = "estimate_swap",
  withdraw = "withdraw",
  get_reserves = "get_reserves",
  get_fee_fraction = "get_fee_fraction",
  version = "version",
  upgrade = "upgrade",
  initialize_rewards_config = "initialize_rewards_config",
  set_rewards_config = "set_rewards_config",
  get_rewards_info = "get_rewards_info",
  get_user_reward = "get_user_reward",
  claim = "claim",
}

export class PoolClient extends StellarPlus.ContractEngine {
  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  async initialize(args: {
    admin: string;
    tokens: string[];
    lp_token_wasm_hash: string;
    fee_fraction: number;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      admin: args.admin,
      tokens: args.tokens,
      lp_token_wasm_hash: hexStringToBytes32(args.lp_token_wasm_hash),
      fee_fraction: args.fee_fraction,
    };

    await this.invokeContract({
      method: methods.initialize,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async pool_type(args: {
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {};

    await this.invokeContract({
      method: methods.pool_type,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async share_id(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.share_id,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async get_reserves(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.get_reserves,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async get_fee_fraction(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.get_fee_fraction,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async get_tokens(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.get_tokens,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async deposit(args: {
    user: string;
    desired_amounts: BigInt[];
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      desired_amounts: args.desired_amounts,
    };

    await this.invokeContract({
      method: methods.deposit,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async swap(args: {
    user: string;
    in_idx: number;
    out_idx: number;
    in_amount: BigInt;
    out_min: BigInt;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      in_idx: args.in_idx,
      out_idx: args.out_idx,
      in_amount: args.in_amount,
      out_min: args.out_min,
    };

    await this.invokeContract({
      method: methods.swap,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async estimate_swap(args: {
    user: string;
    in_idx: number;
    out_idx: number;
    in_amount: BigInt;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<BigInt> {
    const methodArgs = {
      user: args.user,
      in_idx: args.in_idx,
      out_idx: args.out_idx,
      in_amount: args.in_amount,
    };

    return (await this.invokeOrReadFromContract(
      methods.estimate_swap,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as BigInt;
  }

  async withdraw(args: {
    user: string;
    share_amount: BigInt;
    min_amounts: BigInt[];
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      share_amount: args.share_amount,
      min_amounts: args.min_amounts,
    };

    await this.invokeContract({
      method: methods.withdraw,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async initialize_rewards_config(args: {
    reward_token: string;
    reward_storage: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      reward_token: args.reward_token,
      reward_storage: args.reward_storage,
    };

    await this.invokeContract({
      method: methods.initialize_rewards_config,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_rewards_config(args: {
    admin: string;
    expired_at: BigInt;
    tps: BigInt;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      admin: args.admin,
      expired_at: args.expired_at,
      tps: args.tps,
    };

    await this.invokeContract({
      method: methods.set_rewards_config,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async get_rewards_info(args: {
    user: string;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<any> {
    const methodArgs = {
      user: args.user,
    };

    return (await this.invokeOrReadFromContract(
      methods.get_rewards_info,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as any;
  }

  async get_user_reward(args: {
    user: string;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<BigInt> {
    const methodArgs = {
      user: args.user,
    };

    return (await this.invokeOrReadFromContract(
      methods.get_user_reward,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as BigInt;
  }

  async claim(args: {
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
    };

    await this.invokeContract({
      method: methods.claim,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async upgrade(args: {
    new_wasm_hash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      new_wasm_hash: hexStringToBytes32(args.new_wasm_hash),
    };

    await this.invokeContract({
      method: methods.upgrade,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async version(args: {
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {};

    return (await this.invokeOrReadFromContract(
      methods.version,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  private async invokeOrReadFromContract(
    method: string,
    methodArgs: object,
    txInvocation: TransactionInvocation,
    invoke: boolean
  ): Promise<any> {
    if (invoke) {
      return await this.invokeContract({
        method: method,
        methodArgs: methodArgs,
        ...txInvocation,
      });
    }
    return await this.readFromContract({
      method: method,
      methodArgs: methodArgs,
      header: txInvocation.header,
    });
  }
}
