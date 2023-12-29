import { StellarPlus } from "stellar-plus";
import { TransactionInvocation } from "../../utils/lib-types";
import { randomBytes } from "crypto";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { hexStringToBytes32 } from "../../utils/converters";

enum methods {
  pool_type = "pool_type",
  get_pool = "get_pool",
  share_id = "share_id",
  get_reserves = "get_reserves",
  get_tokens = "get_tokens",
  deposit = "deposit",
  swap = "swap",
  estimate_swap = "estimate_swap",
  withdraw = "withdraw",
  set_rewards_config = "set_rewards_config",
  get_rewards_info = "get_rewards_info",
  get_user_reward = "get_user_reward",
  claim = "claim",
  init_pool = "init_pool",
  init_standard_pool = "init_standard_pool",
  init_stableswap_pool = "init_stableswap_pool",
  get_pools = "get_pools",
  add_custom_pool = "add_custom_pool",
  remove_pool = "remove_pool",
  version = "version",
  upgrade = "upgrade",
  init_admin = "init_admin",
  set_token_hash = "set_token_hash",
  set_pool_hash = "set_pool_hash",
  set_stableswap_pool_hash = "set_stableswap_pool_hash",
  configure_init_pool_payment = "configure_init_pool_payment",
  set_reward_token = "set_reward_token",
}

export class PoolRouterClient extends StellarPlus.ContractEngine {
  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  async pool_type(args: {
    tokens: string[];
    poolIndex: number;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      tokens: args.tokens,
      poolIndex: args.poolIndex,
    };

    await this.invokeContract({
      method: methods.pool_type,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async get_pool(args: {
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {
      tokens: args.tokens,
      pool_index: args.pool_index
    };

    return (await this.invokeOrReadFromContract(
      methods.get_pool,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async share_id(args: {
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {
      tokens: args.tokens,
      pool_index: args.pool_index
    };

    return (await this.invokeOrReadFromContract(
      methods.share_id,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async get_reserves(args: {
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {
      tokens: args.tokens,
      pool_index: args.pool_index
    };

    return (await this.invokeOrReadFromContract(
      methods.get_reserves,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async get_tokens(args: {
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean;
  }): Promise<string> {
    const methodArgs = {
      tokens: args.tokens,
      pool_index: args.pool_index
    };

    return (await this.invokeOrReadFromContract(
      methods.get_tokens,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as string;
  }

  async deposit(args: {
    user: string;
    tokens: string[];
    pool_index: number;
    desired_amounts: BigInt[],
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_index: args.pool_index,
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
    tokens: string[];
    token_in: string;
    token_out: string;
    pool_index: number;
    in_amount: BigInt;
    out_min: BigInt;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      token_in: args.token_in,
      token_out: args.token_out,
      pool_index: args.pool_index,
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
    tokens: string[];
    token_in: string;
    token_out: string;
    pool_index: number;
    in_amount: BigInt;
    txInvocation: TransactionInvocation;
    invoke?: boolean
  }): Promise<BigInt> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      token_in: args.token_in,
      token_out: args.token_out,
      pool_index: args.pool_index,
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
    tokens: string[];
    pool_index: number;
    share_amount: BigInt;
    min_amounts: BigInt[];
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_index: args.pool_index,
      share_amount: args.share_amount,
      min_amounts: args.min_amounts,
    };

    await this.invokeContract({
      method: methods.withdraw,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_rewards_config(args: {
    admin: string;
    tokens: string[];
    pool_index: number;
    expired_at: BigInt;
    tps: BigInt;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      admin: args.admin,
      tokens: args.tokens,
      pool_index: args.pool_index,
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
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean
  }): Promise<any> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_index: args.pool_index,
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
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
    invoke?: boolean
  }): Promise<BigInt> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_index: args.pool_index,
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
    tokens: string[];
    pool_index: number;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_index: args.pool_index,
    };

    await this.invokeContract({
      method: methods.claim,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async init_pool(args: {
    tokens: string[];
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      tokens: args.tokens,
    };

    await this.invokeContract({
      method: methods.init_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async init_standard_pool(args: {
    user: string;
    tokens: string[];
    fee_fraction: number;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      fee_fraction: args.fee_fraction,
    };

    await this.invokeContract({
      method: methods.init_standard_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async init_stableswap_pool(args: {
    user: string;
    tokens: string[];
    a: BigInt;
    fee_fraction: number;
    admin_fee: number;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      a: args.a,
      fee_fraction: args.fee_fraction,
      admin_fee: args.admin_fee,
    };

    await this.invokeContract({
      method: methods.init_stableswap_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async get_pools(args: {
    tokens: string[];
    txInvocation: TransactionInvocation;
    invoke?: boolean
  }): Promise<any> {
    const methodArgs = {
      tokens: args.tokens,
    };

    return (await this.invokeOrReadFromContract(
      methods.get_pools,
      methodArgs,
      args.txInvocation,
      args.invoke as boolean
    )) as any;
  }

  async add_custom_pool(args: {
    user: string;
    tokens: string[];
    pool_address: string;
    pool_type: string;
    init_args: string[];
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_address: args.pool_address,
      pool_type: args.pool_type,
      init_args: args.init_args,
    };

    await this.invokeContract({
      method: methods.add_custom_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async remove_pool(args: {
    user: string;
    tokens: string[];
    pool_hash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      user: args.user,
      tokens: args.tokens,
      pool_hash: hexStringToBytes32(args.pool_hash),
    };

    await this.invokeContract({
      method: methods.remove_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async init_admin(args: {
    account: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      account: args.account,
    };

    await this.invokeContract({
      method: methods.init_admin,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_token_hash(args: {
    new_hash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      new_hash: hexStringToBytes32(args.new_hash),
    };

    await this.invokeContract({
      method: methods.set_token_hash,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_pool_hash(args: {
    new_hash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      new_hash: hexStringToBytes32(args.new_hash),
    };

    await this.invokeContract({
      method: methods.set_pool_hash,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_stableswap_pool_hash(args: {
    num_tokens: number;
    new_hash: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      num_tokens: args.num_tokens,
      new_hash: hexStringToBytes32(args.new_hash),
    };

    await this.invokeContract({
      method: methods.set_stableswap_pool_hash,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async configure_init_pool_payment(args: {
    token: string;
    amount: BigInt;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token: args.token,
      amount: args.amount,
    };

    await this.invokeContract({
      method: methods.configure_init_pool_payment,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async set_reward_token(args: {
    reward_token: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      reward_token: args.reward_token,
    };

    await this.invokeContract({
      method: methods.set_reward_token,
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
