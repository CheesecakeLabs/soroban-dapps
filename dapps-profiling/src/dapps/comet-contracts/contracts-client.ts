import { StellarPlus } from "stellar-plus";
import { Address } from "@stellar/stellar-base";
import { TransactionInvocation, Network } from "../../utils/lib-types";
import { randomBytes } from "crypto";
import { ContractEngineConstructorArgs } from "stellar-plus/lib/stellar-plus/core/contract-engine/types";
import { hexStringToBytes32 } from "../../utils/converters";
import { i128, u32 } from "stellar-plus/lib/stellar-plus/types";

enum methods {
  init = "init",
  bundle_bind = "bundle_bind",
  bind = "bind",
  rebind = "rebind",
  unbind = "unbind",
  finalize = "finalize",
  gulp = "gulp",
  join_pool = "join_pool",
  exit_pool = "exit_pool",
  swap_exact_amount_in = "swap_exact_amount_in",
  swap_exact_amount_out = "swap_exact_amount_out",
  dep_tokn_amt_in_get_lp_tokns_out = "dep_tokn_amt_in_get_lp_tokns_out",
  dep_lp_tokn_amt_out_get_tokn_in = "dep_lp_tokn_amt_out_get_tokn_in",
  wdr_tokn_amt_in_get_lp_tokns_out = "wdr_tokn_amt_in_get_lp_tokns_out",
  wdr_tokn_amt_out_get_lp_tokns_in = "wdr_tokn_amt_out_get_lp_tokns_in",
  set_swap_fee = "set_swap_fee",
  set_controller = "set_controller",
  set_public_swap = "set_public_swap",
  set_freeze_status = "set_freeze_status",
  get_total_supply = "get_total_supply",
  get_controller = "get_controller",
  get_total_denormalized_weight = "get_total_denormalized_weight",
  get_tokens = "get_tokens",
  get_balance = "get_balance",
  get_denormalized_weight = "get_denormalized_weight",
  get_normalized_weight = "get_normalized_weight",
  get_spot_price = "get_spot_price",
  get_swap_fee = "get_swap_fee",
  get_spot_price_sans_fee = "get_spot_price_sans_fee",
  is_public_swap = "is_public_swap",
  is_finalized = "is_finalized",
  is_bound = "is_bound",
  allowance = "allowance",
  approve = "approve",
  balance_of = "balance_of",
  transfer = "transfer",
  transfer_from = "transfer_from",
  burn = "burn",
  burn_from = "burn_from",
  decimals = "decimals",
  name = "name",
  symbol = "symbol",
}

export class ContractClient extends StellarPlus.ContractEngine {
  constructor(args: ContractEngineConstructorArgs) {
    super(args);
  }

  async init(args: {
    factory: string;
    controller: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      factory: new Address(args.factory),
      controller: new Address(args.controller),
    };

    await this.invokeContract({
      method: methods.init,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async bundleBind(args: {
    token: string[];
    balance: i128;
    denorm: i128;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token: args.token.map((token) => new Address(token)),
      balance: args.balance as i128,
      denorm: args.denorm as i128,
    };

    await this.invokeContract({
      method: methods.bundle_bind,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async bind(args: {
    token: string;
    balance: i128;
    denorm: i128;
    admin: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token: new Address(args.token),
      balance: args.balance as i128,
      denorm: args.denorm as i128,
      admin: new Address(args.admin),
    };

    await this.invokeContract({
      method: methods.bind,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async rebind(args: {
    token: string;
    balance: i128;
    denorm: i128;
    admin: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token: new Address(args.token),
      balance: args.balance as i128,
      denorm: args.denorm as i128,
      admin: new Address(args.admin),
    };

    await this.invokeContract({
      method: methods.rebind,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async unbind(args: {
    token: string;
    user: string;

    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token: new Address(args.token),
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.unbind,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async finalize(args: { txInvocation: TransactionInvocation }): Promise<void> {
    await this.invokeContract({
      method: methods.finalize,
      methodArgs: {},
      ...args.txInvocation,
    });
  }

  async gulp(args: {
    t: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      t: new Address(args.t),
    };

    await this.invokeContract({
      method: methods.gulp,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async joinPool(args: {
    poolAmountOut: i128;
    maxAmountsIn: i128[];
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      pool_amount_out: args.poolAmountOut as i128,
      max_amounts_in: args.maxAmountsIn.map((amount) => amount as i128),
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.join_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async exitPool(args: {
    poolAmountIn: i128;
    minAmountsOut: i128[];
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      pool_amount_in: args.poolAmountIn as i128,
      min_amounts_out: args.minAmountsOut.map((amount) => amount as i128),
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.exit_pool,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async swapExactAmountIn(args: {
    tokenIn: string;
    tokenAmountIn: i128;
    tokenOut: string;
    minAmountOut: i128;
    maxPrice: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      token_amount_in: args.tokenAmountIn as i128,
      token_out: new Address(args.tokenOut),
      min_amount_out: args.minAmountOut as i128,
      max_price: args.maxPrice as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.swap_exact_amount_in,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async swapExactAmountOut(args: {
    tokenIn: string;
    maxAmountIn: i128;
    tokenOut: string;
    tokenAmountOut: i128;
    maxPrice: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      max_amount_in: args.maxAmountIn as i128,
      token_out: new Address(args.tokenOut),
      token_amount_out: args.tokenAmountOut as i128,
      max_price: args.maxPrice as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.swap_exact_amount_out,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async depositTokenAmountInGetLPTokensOut(args: {
    tokenIn: string;
    tokenAmountIn: i128;
    minPoolAmountOut: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      token_amount_in: args.tokenAmountIn as i128,
      min_pool_amount_out: args.minPoolAmountOut as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.dep_tokn_amt_in_get_lp_tokns_out,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async depositLPTokenAmountOutGetTokenIn(args: {
    tokenIn: string;
    poolAmountOut: i128;
    maxTokenAmountIn: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      pool_amount_out: args.poolAmountOut as i128,
      max_amount_in: args.maxTokenAmountIn as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.dep_lp_tokn_amt_out_get_tokn_in,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async withdrawTokenAmountInGetLPTokensOut(args: {
    tokenOut: string;
    poolAmountIn: i128;
    minAmountOut: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_out: new Address(args.tokenOut),
      pool_amount_in: args.poolAmountIn as i128,
      min_amount_out: args.minAmountOut as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.wdr_tokn_amt_out_get_lp_tokns_in,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async withdrawTokenAmountOutGetLPTokensIn(args: {
    tokenOut: string;
    tokenAmountOut: i128;
    maxPoolAmountIn: i128;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      token_out: new Address(args.tokenOut),
      token_amount_out: args.tokenAmountOut as i128,
      max_pool_amount_in: args.maxPoolAmountIn as i128,
      user: new Address(args.user),
    };

    await this.invokeContract({
      method: methods.wdr_tokn_amt_out_get_lp_tokns_in,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async setSwapFee(args: {
    fee: i128;
    caller: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      fee: args.fee as i128,
      caller: new Address(args.caller),
    };

    await this.invokeContract({
      method: methods.set_swap_fee,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async setController(args: {
    caller: string;
    manager: string;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      caller: new Address(args.caller),
      manager: new Address(args.manager),
    };

    await this.invokeContract({
      method: methods.set_controller,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async setPublicSwap(args: {
    caller: string;
    val: boolean;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      caller: new Address(args.caller),
      val: args.val,
    };

    await this.invokeContract({
      method: methods.set_public_swap,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async setFreezeStatus(args: {
    caller: string;
    val: boolean;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      caller: new Address(args.caller),
      val: args.val,
    };

    await this.invokeContract({
      method: methods.set_freeze_status,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async getTotalSupply(args: {
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    return (await this.readFromContract({
      method: methods.get_total_supply,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as i128;
  }

  async getController(args: {
    txInvocation: TransactionInvocation;
  }): Promise<string> {
    return (await this.readFromContract({
      method: methods.get_controller,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as string;
  }

  async getTotalDenormalizedWeight(args: {
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    return (await this.readFromContract({
      method: methods.get_total_denormalized_weight,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as i128;
  }

  async getTokens(args: {
    txInvocation: TransactionInvocation;
  }): Promise<string[]> {
    return (await this.readFromContract({
      method: methods.get_tokens,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as string[];
  }

  async getBalance(args: {
    token: string;
    user: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      token: new Address(args.token),
      user: new Address(args.user),
    };

    return (await this.readFromContract({
      method: methods.get_balance,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async getDenormalizedWeight(args: {
    token: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      token: new Address(args.token),
    };

    return (await this.readFromContract({
      method: methods.get_denormalized_weight,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async getNormalizedWeight(args: {
    token: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      token: new Address(args.token),
    };

    return (await this.readFromContract({
      method: methods.get_normalized_weight,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async getSpotPrice(args: {
    tokenIn: string;
    tokenOut: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      token_out: new Address(args.tokenOut),
    };

    return (await this.readFromContract({
      method: methods.get_spot_price,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async getSwapFee(args: {
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    return (await this.readFromContract({
      method: methods.get_swap_fee,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as i128;
  }

  async getSpotPriceSansFee(args: {
    tokenIn: string;
    tokenOut: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      token_in: new Address(args.tokenIn),
      token_out: new Address(args.tokenOut),
    };

    return (await this.readFromContract({
      method: methods.get_spot_price_sans_fee,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async isPublicSwap(args: {
    txInvocation: TransactionInvocation;
  }): Promise<boolean> {
    return (await this.readFromContract({
      method: methods.is_public_swap,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as boolean;
  }

  async isFinalized(args: {
    txInvocation: TransactionInvocation;
  }): Promise<boolean> {
    return (await this.readFromContract({
      method: methods.is_finalized,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as boolean;
  }

  async isBound(args: {
    t: string;
    txInvocation: TransactionInvocation;
  }): Promise<boolean> {
    const methodArgs = {
      t: new Address(args.t),
    };

    return (await this.readFromContract({
      method: methods.is_bound,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as boolean;
  }

  async allowance(args: {
    from: string;
    spender: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      from: new Address(args.from),
      spender: new Address(args.spender),
    };

    return (await this.readFromContract({
      method: methods.allowance,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async approve(args: {
    from: string;
    spender: string;
    amount: i128;
    expirationLedger: u32;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      from: new Address(args.from),
      spender: new Address(args.spender),
      amount: args.amount as i128,
      expiration_ledger: args.expirationLedger as u32,
    };

    await this.invokeContract({
      method: methods.approve,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async balanceOf(args: {
    id: string;
    txInvocation: TransactionInvocation;
  }): Promise<i128> {
    const methodArgs = {
      id: new Address(args.id),
    };

    return (await this.readFromContract({
      method: methods.balance_of,
      methodArgs: methodArgs,
      header: args.txInvocation.header,
    })) as i128;
  }

  async transfer(args: {
    from: string;
    to: string;
    amount: i128;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      from: new Address(args.from),
      to: new Address(args.to),
      amount: args.amount as i128,
    };

    await this.invokeContract({
      method: methods.transfer,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async transferFrom(args: {
    spender: string;
    from: string;
    to: string;
    amount: i128;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      spender: new Address(args.spender),
      from: new Address(args.from),
      to: new Address(args.to),
      amount: args.amount as i128,
    };

    await this.invokeContract({
      method: methods.transfer_from,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async burn(args: {
    from: string;
    amount: i128;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      from: new Address(args.from),
      amount: args.amount as i128,
    };

    await this.invokeContract({
      method: methods.burn,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async burnFrom(args: {
    spender: string;
    from: string;
    amount: i128;
    txInvocation: TransactionInvocation;
  }): Promise<void> {
    const methodArgs = {
      spender: new Address(args.spender),
      from: new Address(args.from),
      amount: args.amount as i128,
    };

    await this.invokeContract({
      method: methods.burn_from,
      methodArgs: methodArgs,
      ...args.txInvocation,
    });
  }

  async decimals(args: { txInvocation: TransactionInvocation }): Promise<u32> {
    return (await this.readFromContract({
      method: methods.decimals,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as u32;
  }

  async name(args: { txInvocation: TransactionInvocation }): Promise<string> {
    return (await this.readFromContract({
      method: methods.name,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as string;
  }

  async symbol(args: { txInvocation: TransactionInvocation }): Promise<string> {
    return (await this.readFromContract({
      method: methods.symbol,
      methodArgs: {},
      header: args.txInvocation.header,
    })) as string;
  }
}
