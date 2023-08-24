/// <reference types="node" />
import * as SorobanClient from 'soroban-client';
import { ResponseTypes } from './method-options.js';
export * from './constants.js';
export * from './server.js';
export * from './invoke.js';
export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Address = string;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;
export interface Error_ {
    message: string;
}
export interface Result<T, E = Error_> {
    unwrap(): T;
    unwrapErr(): E;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Ok<T> implements Result<T> {
    readonly value: T;
    constructor(value: T);
    unwrapErr(): Error_;
    unwrap(): T;
    isOk(): boolean;
    isErr(): boolean;
}
export declare class Err<T> implements Result<T> {
    readonly error: Error_;
    constructor(error: Error_);
    unwrapErr(): Error_;
    unwrap(): never;
    isOk(): boolean;
    isErr(): boolean;
}
export declare function initialize<R extends ResponseTypes = undefined>({ contractId, token_wasm_hash, token_a, token_b }: {
    contractId: string;
    token_wasm_hash: Buffer;
    token_a: Address;
    token_b: Address;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? void : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : void>;
export declare function shareId<R extends ResponseTypes = undefined>({ contractId }: {
    contractId: string;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `Address`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? string : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : string>;
export declare function deposit<R extends ResponseTypes = undefined>({ contractId, to, desired_a, min_a, desired_b, min_b }: {
    contractId: string;
    to: Address;
    desired_a: i128;
    min_a: i128;
    desired_b: i128;
    min_b: i128;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? void : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : void>;
export declare function swap<R extends ResponseTypes = undefined>({ contractId, to, buy_a, out, in_max }: {
    contractId: string;
    to: Address;
    buy_a: boolean;
    out: i128;
    in_max: i128;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `void`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? void : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : void>;
export declare function withdraw<R extends ResponseTypes = undefined>({ contractId, to, share_amount, min_a, min_b }: {
    contractId: string;
    to: Address;
    share_amount: i128;
    min_a: i128;
    min_b: i128;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `[i128, i128]`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? [bigint, bigint] : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : [bigint, bigint]>;
export declare function getRsrvs<R extends ResponseTypes = undefined>({ contractId }: {
    contractId: string;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `[i128, i128]`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? [bigint, bigint] : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : [bigint, bigint]>;
export declare function getShares<R extends ResponseTypes = undefined>({ contractId }: {
    contractId: string;
}, options?: {
    /**
     * The fee to pay for the transaction. Default: 100.
     */
    fee?: number;
    /**
     * What type of response to return.
     *
     *   - `undefined`, the default, parses the returned XDR as `i128`. Runs preflight, checks to see if auth/signing is required, and sends the transaction if so. If there's no error and `secondsToWait` is positive, awaits the finalized transaction.
     *   - `'simulated'` will only simulate/preflight the transaction, even if it's a change/set method that requires auth/signing. Returns full preflight info.
     *   - `'full'` return the full RPC response, meaning either 1. the preflight info, if it's a view/read method that doesn't require auth/signing, or 2. the `sendTransaction` response, if there's a problem with sending the transaction or if you set `secondsToWait` to 0, or 3. the `getTransaction` response, if it's a change method with no `sendTransaction` errors and a positive `secondsToWait`.
     */
    responseType?: R;
    /**
     * If the simulation shows that this invocation requires auth/signing, `invoke` will wait `secondsToWait` seconds for the transaction to complete before giving up and returning the incomplete {@link SorobanClient.SorobanRpc.GetTransactionResponse} results (or attempting to parse their probably-missing XDR with `parseResultXdr`, depending on `responseType`). Set this to `0` to skip waiting altogether, which will return you {@link SorobanClient.SorobanRpc.SendTransactionResponse} more quickly, before the transaction has time to be included in the ledger. Default: 10.
     */
    secondsToWait?: number;
}): Promise<R extends undefined ? bigint : R extends "simulated" ? SorobanClient.SorobanRpc.SimulateTransactionResponse : R extends "full" ? SorobanClient.SorobanRpc.SimulateTransactionResponse | SorobanClient.SorobanRpc.SendTransactionResponse | SorobanClient.SorobanRpc.GetTransactionResponse : bigint>;
