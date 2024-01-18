# DApps Profiling

## Overview

The `dapps-profiling` project is a Node.js application designed to profile decentralized applications (DApps) on the Stellar network. It focuses on analyzing the performance of various smart contract use cases, offering insights into their efficiency and resource utilization.

## Project Setup

### Requirements

- Node.js environment.
- StellarPlus, a all-in-one library developed by Cheesecake Labs. [StellarPlus Documentation](https://cheesecake-labs.gitbook.io/stellar-plus/?utm_source=github&utm_medium=codigo-fonte)
- Stellar SDK for interacting with the Stellar network.

### Running the Project

1. **Installation**:

   - Clone the repository and navigate to the project directory.
   - Run `npm install` to install the required dependencies.

2. **Starting the Application**:
   - Use the command `npm run dev` to start the application in development mode. This utilizes `nodemon` and `ts-node` for automatic reloading and TypeScript support.

## Use Cases

The profiling use cases are located in the `./src/profilings` directory. Each use case is designed as a standalone module with an entry function that executes the profiling scenario.

### Available Use Cases

1. **Assets Profiling**:
   - **Path**: `./src/profilings/tokens`
   - **Function**: `tokensProfiling`
   - **Description**: Compares the performance of SAC (Stellar Asset Contract) tokens and Soroban Tokens.
   - [Readme for Assets Profiling](./src/profilings/tokens/readme.md)

To run a use case, import its entry function in the main index file (`./src/index.ts`) and execute it with the required arguments.

### Example: Running the Assets Profiling Use Case

```javascript
import { StellarPlus } from "stellar-plus";
import { tokenTransactions, tokensProfiling } from "./profilings/tokens";

tokensProfiling({
  nUsers: 5,
  nTransactions: 100,
  network: StellarPlus.Constants.testnet,
  transactions: [
    tokenTransactions.burn,
    tokenTransactions.mint,
    tokenTransactions.transfer,
  ],
  // Add Validation Cloud API Key if desired
});
```

2. **Comet Profiling**:
   - **Path**: `./src/profilings/comet-dex`
   - **Function**: `cometDexProfiling`
   - **Description**: Logs the performance and resources used in all Comet contracts transactions.

To run a use case, import its entry function in the main index file (`./src/index.ts`) and execute it with the required arguments.

### Example: Running the Comet Profiling Use Case

```javascript
import { StellarPlus } from "stellar-plus";
import { cometDexProfiling } from "./profilings/comet-dex";

cometDexProfiling({
  nUsers: 5,
  network: StellarPlus.Constants.testnet,
});
```

3. **Liquidity Pool Profiling**:
   - **Path**: `./src/profilings/liquidity-pool`
   - **Function**: `liquidityPoolProfiling`
   - **Description**: Compares the performance of all liquidity pool method transactions.
   - [Readme for Liquidity Pool Profiling](./src/profilings/liquidity-pool/readme.md)

To run a use case, import its entry function in the main index file (`./src/index.ts`) and execute it with the required arguments.

### Example: Running the Liquidity Pool Profiling Use Case

```javascript
import { StellarPlus } from "stellar-plus";
import { cometDexProfiling } from "./profilings/liquidity-pool";

liquidityPoolProfiling({
  nUsers: 5,
  nTransactions: 100,
  network: StellarPlus.Constants.testnet,
  transactions: [
      liquidityPoolTransactions.deposit,
      liquidityPoolTransactions.swap,
      liquidityPoolTransactions.get_rsrvs,
      liquidityPoolTransactions.withdraw
  ],
  // Add Validation Cloud API Key if desired
});
```

