# Stellar Liquidity Pool Profiling: README

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
  To execute a most used transactions in liquidity pool,  profiling the performance between all contract methods.

- **Arguments**:

  - `nUsers`: Number of users for the profiling test. Whenever possible, the transactions will be parallelized with the number of users available.
  - `nTransactions`: Number of transactions to be executed.
  - `network`: Stellar network configuration (e.g. testnet).
  - `transactions`: Types of transactions to be profiled (transfer, mint, burn).
  - `validationCloudApiKey`: API key to use your custom Validation Cloud RPC isntead of the default one.

- **Steps**:

  1. Setup Phase: Create 'opex' and 'issuer' accounts to control fees and the assets.
  2. Setup two Soroban Tokens from scratch to initialize Liquidity Pool contract.
  3. Setup user accounts and trustlines for the SAC token.
  4. Mint initial amounts of both tokens to each user. Here the whole minting process if done through Soroban invocations and is included in the profiling logs.
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
    liquidityPoolTransactions.get_rsrvs
  ],
  validationCloudApiKey: "<Your_ValidationCloud_API_Key>",
});
```
