# DApps Profiling

## Overview

This is a Node.js application designed to profile Soroban smart contracts. It focuses on analyzing the performance of various smart contract use cases, offering insights into their efficiency and resource utilization.

## Project Setup

### Requirements

- Node.js environment.
- [stellar-plus](https://www.npmjs.com/package/stellar-plus) package, a all-in-one library developed by Cheesecake Labs. Check the [documentation](https://cheesecake-labs.gitbook.io/stellar-plus/?utm_source=github&utm_medium=codigo-fonte) for more details.
- [js-stellar-sdk](https://github.com/stellar/js-stellar-sdk) package for interacting with the Stellar network.

### Running the Project

1. **Installation**:

   - Clone the repository and navigate to the project directory.
   - Run `npm install` to install the required dependencies.

2. **Define the use case**:
   - To run a use case, import its entry function in the main index file (`./src/index.ts`) and execute it with the required arguments.
3. **Starting the Application**:
   - Use the command `npm run dev` to start the application in development mode. This utilizes `nodemon` and `ts-node` for automatic reloading and TypeScript support.

## Use Cases

The profiling use cases are located in the [`./src/profilings`](src/profilings) directory. Each use case is designed as a standalone module with an entry function that executes the profiling scenario. Each directory has a specific readme file with information on its use, implementation and results obtained.

### Available Use Cases

#### Token profiling

- **Path**: [`./src/profilings/tokens`](src/profilings/tokens)
- **Function**: `tokensProfiling`
- **Description**: Compares the performance of SAC (Stellar Asset Contract) tokens and Soroban Tokens.

Check the [tokens profiling Readme](./src/profilings/tokens/README.md) for more details.

###### Usage example

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

#### Comet DEX profiling

- **Path**: [`./src/profilings/comet-dex`](src/profilings/comet-dex)
- **Function**: `cometDexProfiling`
- **Description**: Logs the performance and resources used in all Comet contracts transactions.

Comet DEX is a protocol that can be checked [here](https://github.com/CometDEX/comet-contracts-v1/tree/main).
Check the [Comet profiling Readme](src/profilings/comet-dex/README.md) for more details.

###### Usage example

```javascript
import { StellarPlus } from "stellar-plus";
import { cometDexProfiling } from "./profilings/comet-dex";

cometDexProfiling({
  nUsers: 1,
  network: StellarPlus.Constants.testnet,
});
```

#### Liquidity Pool Profiling

- **Path**: [`./src/profilings/liquidity-pool`](src/profilings/liquidity-pool)
- **Function**: `liquidityPoolProfiling`
- **Description**: Compares the performance of all liquidity pool method transactions.

Check the [Liqudity Pool profiling Readme](src/profilings/liquidity-pool/README.md) for more details.

###### Usage example

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
    liquidityPoolTransactions.withdraw,
  ],
});
```
