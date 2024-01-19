# Comet DEX Profiling

## Table of Contents

  - [Purpose](#purpose)
  - [StellarPlus Library Integration](#stellarplus-library-integration)
  - [Main Functionality](#main-functionality)
  - [Usage](#usage)
  - [Results achieved](#results-achieved)

## Purpose

This profiling use case is focused on obtaining resource utilization data from [Comet DEX](https://github.com/CometDEX/comet-contracts-v1/tree/main) protocol contracts. This work is part of a larger investigation which aims to collect data from various protocols in order to obtain an estimate of the resource utilization of Soroban contracts.

## StellarPlus Library Integration

This use case extensively utilizes the StellarPlus library, developed by Cheesecake Labs. Key integrations include:

- **Soroban Profiler**: Used for collecting, filtering, and formatting resource utilization data of all Soroban transactions. [Soroban Profiler Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/reference/utils/soroban-profiler)

## Main Functionality

### `cometDexProfiling` Function

- **Purpose**:
  To execute all transactions for profiling the performance of Comet DEX contracts.

- **Arguments**:

  - `nUsers`: Number of users for the profiling test. For now it only supports 1 user.
  - `network`: Stellar network configuration (e.g. testnet).

- **Steps**:

  1. Setup Phase: Create 'opex' and 'issuer' accounts to control fees and the assets.
  2. Setup Factory and Comet contracts.
  3. Setup user accounts.
  4. Setup two Soroban tokens.
  5. Mint initial amounts of both tokens to each user and admin.
  6. Perform the profiling simulation for each transaction present in each contract.
  7. Export profiling data to CSV files.

- **Output**:
  By default, all data collected can be found under `./src/export/comet`
  - `comet-data.csv`: Profiling data for Comet contract.
  - `factory-data.csv`: Profiling data for Factory contract.

## Usage

To execute the profiling, call the `cometDexProfiling` function with the desired configuration:

```javascript
cometDexProfiling({
  nUsers: 1,
  network: StellarPlus.Constants.testnet,
});
```

## Results achieved

The full results obtained can be seen at [this link](https://docs.google.com/spreadsheets/d/1PA5NoRsK92cPIrDpm64uuxAArrdUF7e41wboQbZxzCY/edit?pli=1#gid=0).
The table below shows an overview of the data from both contracts combined.

|                                   | Average    | Max        | Min       | Median     |
| --------------------------------- | ---------- | ---------- | --------- | ---------- |
| CPU Instructions                  | 19,424,139 | 38,773,267 | 5,019,842 | 18,253,538 |
| Memory (bytes)                    | 3,678,395  | 7,287,412  | 1,433,683 | 3,020,225  |
| Resource Fee (Stroops)            | 254,455    | 460,200    | 62,820    | 235,354    |
| Read (bytes)                      | 40,292     | 50,432     | 4,096     | 41,332     |
| Write (bytes)                     | 468        | 1,680      | 0         | 300        |
| Ledger Reads                      | 3          | 6          | 1         | 3          |
| Ledger Writes                     | 2          | 8          | 0         | 1          |
| Event & return value size (bytes) | 214        | 1,360      | 4         | 20         |
| Transaction size (bytes)          | 392        | 1,164      | 116       | 276        |
