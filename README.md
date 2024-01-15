# Soroban Dapps

Soroban DApps is a collection of demos and experiments showcasing the capabilities of Soroban smart contracts. Each folder within this repository represents a different DApp, offering a README file with detailed information about its purpose and usage. 

Also have examples of how to use *[Stellar Plus](#stellar-plus-library)* Library, an all-in-one Javascript library for building and interacting with the Stellar network. Stellar Plus bundles the main resources from the community into an easy-to-use set of tools and capabilities.

Please note that the demos and experiments included in this repository are meant for educational and illustrative purposes. They can help developers get started with Soroban and serve as a foundation for building more sophisticated and customized applications.

## Stellar Plus Library
The stellar-plus library is a powerful tool for interacting with Stellar blockchain. For detailed documentation, refer to the [Stellar Plus Documentation](https://cheesecake-labs.gitbook.io/stellar-plus).

## Repository Structure

- [**DApps Profiling**](dapps-profiling/readme.md): Contain examples of how to profile decentralized applications (DApps) on the Stellar network. It focuses on analyzing the performance of various smart contract use cases, offering insights into their efficiency and resource utilization.
- [**Certificate of Deposit**](certificate-of-deposit/README.md): Contains a demo of Soroban dApp for managing Certificates of Deposit (CD) using a Stellar Classic asset.
- [**Event Watcher**](event-watcher/README.md): Contains a demo project showcasing a Soroban Dapp that utilizes an event watcher service to update contract data in a database. The Dapp serves as a liquidity pool dashboard, enabling users to access metrics and interact with liquidity pools.
- [**Liquidity Pool**](liquidity-pool/README.md): This path contain:
  - *Liquidity Pool Demo*: A React demo simulation using Soroban smart contracts on Stellar. 
  - *Load Test script*: A shell script demo simulating Load Test in Liquidity Pool.


## DApps Profiling
These examples are using Stellar Plus lib to create base smart contract resources (like asset, contract and account) and perform profiler.

### Profiling Comet Dex
Use case to perform Comet contract using Stellar Plus Library (for more information check [Comet Repository](https://github.com/CometDEX/comet-contracts-v1)).

### Profiling Tokens
Use case focused on comparing the performance of Classic Stellar tokens wrapped in the Stellar Asset Contract (SAC) versus pure Soroban Tokens.

### Profiling Liquidity Pool
Use case execute and compare different transaction of Liquidity Pool contract in Stellar ecosystem using Stellar Plus.
