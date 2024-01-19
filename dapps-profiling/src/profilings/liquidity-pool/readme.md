# Liquidity Pool Profiling

## Table of Contents

  - [Purpose](#purpose)
  - [StellarPlus Library Integration](#stellarplus-library-integration)
  - [Main Functionality](#main-functionality)
  - [Usage](#usage)
  - [Results achieved](#results-achieved)

## Purpose

This profiling use case provides an example of how to execute profiling on a Liquidity Pool contract in the Stellar Blockchain. The profiling is carried out using the stellar-plus library, which simplifies the process of interacting with Stellar blockchain and liquidity pool contracts.

**Important:** The Liquidity Poll WASM implementation available under `./src/dapps/liquidity-pool/wasm`, to generate you can execute the contract in the root of this repo in `./liquidity-pool`. Feel free to experiment custom implementations and/or optimized versions.

## StellarPlus Library Integration

This use case extensively utilizes the StellarPlus library, developed by Cheesecake Labs. Key integrations include:

- **Soroban Profiler**: Used for collecting, filtering, and formatting resource utilization data of all Soroban transactions. [Soroban Profiler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/utils/soroban-profiler)
- **Soroban Token Handler**: A ready-to-use asset handler for deploying, instantiating, and invoking Soroban tokens. [Soroban Token Handler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/asset/stellar-asset-contract-handler)
- **SAC Token Handler**: Manages Stellar Classic tokens with the Stellar Asset Contract, providing functions to wrap and invoke these assets. [SAC Token Handler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/asset/soroban-token-handler)

## Main Functionality

### `liquidityPoolProfiling` Function

- **Purpose**:
  To execute a most used transactions in liquidity pool, profiling the performance between all contract methods.

- **Arguments**:

  - `nUsers`: Number of users for the profiling test. Whenever possible, the transactions will be parallelized with the number of users available.
  - `nTransactions`: Number of transactions to be executed.
  - `network`: Stellar network configuration (e.g. testnet).
  - `transactions`: Types of transactions to be profiled (transfer, mint, burn).
  - `validationCloudApiKey`: API key to use your custom Validation Cloud RPC isntead of the default one.

- **Steps**:

  1. Setup Phase: Create 'opex' and 'issuer' accounts to control fees and the assets.
  2. Setup two Soroban Tokens from scratch to initialize Liquidity Pool contract.
  3. Setup user accounts.
  4. Mint initial amounts of both tokens to each user.
  5. Perform the profiling simulation for each one of the specified transactions.
  6. Export profiling data to CSV files.

- **Output**:
  By default, all data collected can be found under `./src/export`
  - `liquidity_pool_profiling_sac.csv`: Profiling data for Liquidity Pool contract.

## Usage

To execute the profiling, call the `liquidityPoolProfiling` function with the desired configuration:

```javascript
liquidityPoolProfiling({
  nUsers: 5,
  nTransactions: 100,
  network: StellarPlus.Constants.testnet,
  transactions: [
    liquidityPoolTransactions.deposit,
    liquidityPoolTransactions.swap,
    liquidityPoolTransactions.withdraw,
    liquidityPoolTransactions.get_rsrvs,
  ],
  validationCloudApiKey: "<Your_ValidationCloud_API_Key>",
});
```

## Results achieved

The results for each resource cost per method can be seen in the table below.

| Method     | CPU Instructions | Memory (bytes) | Resource Fee (Stroops) | Read (bytes) | Write (bytes) | Ledger Reads | Ledger Writes | Event & return value size (bytes) | Transaction size (bytes) |
| ---------- | ---------------- | -------------- | ---------------------- | ------------ | ------------- | ------------ | ------------- | --------------------------------- | ------------------------ |
| initialize | 8,115,183        | 3,345,027      | 149,509                | 19,132       | 628           | 2            | 2             | 4                                 | 200                      |
| share_id   | 4,723,482        | 1,751,828      | 95,354                 | 11,856       | 0             | 2            | 0             | 40                                | 116                      |
| deposit    | 21,699,746       | 9,644,244      | 333,484                | 20,520       | 1,068         | 5            | 6             | 528                               | 868                      |
| swap       | 18,374,952       | 8,079,149      | 276,289                | 20,516       | 920           | 4            | 5             | 356                               | 704                      |
| withdraw   | 28,464,766       | 12,769,320     | 412,318                | 20,956       | 1,212         | 5            | 7             | 708                               | 980                      |
| get_rsrvs  | 4,733,393        | 1,752,068      | 95,483                 | 11,856       | 0             | 2            | 0             | 52                                | 116                      |

TODO: Add parallel execution and runtime results.
