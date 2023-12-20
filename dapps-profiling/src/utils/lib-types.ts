import {
  Address as StellarAddress,
  Horizon,
  Transaction,
  FeeBumpTransaction,
} from "stellar-sdk";
export type Network = {
  name: NetworksList;
  networkPassphrase: string;
  rpcUrl: string;
  horizonUrl: string;
  friendbotUrl?: string;
};
export enum NetworksList {
  testnet = "testnet",
  futurenet = "futurenet",
  mainnet = "mainnet",
  custom = "custom",
}

export type u32 = number;
export type i32 = number;
export type u64 = bigint;
export type i64 = bigint;
export type u128 = bigint;
export type i128 = bigint;
export type u256 = bigint;
export type i256 = bigint;
export type Option<T> = T | undefined;
export type Typepoint = bigint;
export type Duration = bigint;

export type Address = StellarAddress | string;

export type TransactionInvocation = {
  signers: AccountHandler[];
  header: EnvelopeHeader;
  feeBump?: FeeBumpHeader;
  sponsor?: AccountHandler;
};

export type EnvelopeHeader = {
  fee: string;
  source: string;
  timeout: number;
};

export type FeeBumpHeader = {
  signers: AccountHandler[];
  header: EnvelopeHeader;
};

export type TransactionXdr = string;

export type AccountHandler = AccountBase & {
  sign(
    tx: Transaction | FeeBumpTransaction
  ): Promise<TransactionXdr> | TransactionXdr;
};
export type AccountBase = AccountHelpers & {
  publicKey?: string;
  getPublicKey(): string;
};

export type AccountHelpersPayload = AccountDataViewerConstructor;
export type AccountHelpers = {
  accountDataViewer?: AccountDataViewer;
  friendbot?: Friendbot;
};

export type AccountDataViewer = {
  getBalances(): Promise<
    (
      | Horizon.HorizonApi.BalanceLineNative
      | Horizon.HorizonApi.BalanceLineAsset<"credit_alphanum4">
      | Horizon.HorizonApi.BalanceLineAsset<"credit_alphanum12">
      | Horizon.HorizonApi.BalanceLineLiquidityPool
    )[]
  >;
  getTransactions(): Promise<void>;
};

//
export type Friendbot = {
  initialize(): Promise<void>;
};

export type AccountDataViewerConstructor = {
  network?: Network;
};
