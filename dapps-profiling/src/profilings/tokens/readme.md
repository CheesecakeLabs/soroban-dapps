# Token Profiling

## Purpose

This profiling use case is focused on comparing the performance of Classic Stellar tokens wrapped in the Stellar Asset Contract (SAC) versus pure Soroban Tokens. It aims to provide insights into efficiency, resource utilization, and performance differences between these token types.

**Important:** The pure Soroban token uses the WASM implementation available under `./src/dapps/soroban-token/wasm`. Feel free to experiment custom implementations and/or optimized versions.

## StellarPlus Library Integration

This use case extensively utilizes the StellarPlus library, developed by Cheesecake Labs. Key integrations include:

- **Soroban Profiler**: Used for collecting, filtering, and formatting resource utilization data of all Soroban transactions. [Soroban Profiler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/utils/soroban-profiler)
- **Soroban Token Handler**: A ready-to-use asset handler for deploying, instantiating, and invoking Soroban tokens. [Soroban Token Handler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/asset/stellar-asset-contract-handler)
- **SAC Token Handler**: Manages Stellar Classic tokens with the Stellar Asset Contract, providing functions to wrap and invoke these assets. [SAC Token Handler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/asset/soroban-token-handler)

## Main Functionality

### `tokensProfiling` Function

- **Purpose**:
  To execute a series of transactions for profiling the performance between SAC and Soroban Tokens.

- **Arguments**:

  - `nUsers`: Number of users for the profiling test. Whenever possible, the transactions will be parallelized with the number of users available.
  - `nTransactions`: Number of transactions to be executed.
  - `network`: Stellar network configuration (e.g. testnet).
  - `transactions`: Types of transactions to be profiled (transfer, mint, burn).
  - `validationCloudApiKey`: API key to use your custom Validation Cloud RPC isntead of the default one.

- **Steps**:

  1. Setup Phase: Create 'opex' and 'issuer' accounts to control fees and the assets.
  2. Setup SAC and Soroban Tokens from scratch.
  3. Setup user accounts and trustlines for the SAC token.
  4. Mint initial amounts of both tokens to each user. Here the whole minting process if done through Soroban invocations and is included in the profiling logs.
  5. Perform the profiling simulation for each one of the specified transactions.
  6. Export profiling data to CSV files.

- **Output**:
  By default, all data collected can be found under `./src/export`
  - `assets_profiling_sac.csv`: Profiling data for SAC tokens.
  - `assets_profiling_token.csv`: Profiling data for Soroban Tokens.

## Usage

To execute the profiling, call the `tokensProfiling` function with the desired configuration:

```javascript
tokensProfiling({
  nUsers: 5,
  nTransactions: 100,
  network: StellarPlus.Constants.testnet,
  transactions: [
    tokenTransactions.burn,
    tokenTransactions.mint,
    tokenTransactions.transfer,
  ],
  validationCloudApiKey: "<Your_ValidationCloud_API_Key>",
});
```
