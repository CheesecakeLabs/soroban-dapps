# Soroban Dapps

## Overview

Soroban DApps is a collection of demos and experiments showcasing the capabilities of Soroban smart contracts. Each folder within this repository represents a different DApp, offering a README file with detailed information about its purpose and usage.

Some of the Dapps also have examples of integration with [stellar-plus](https://www.npmjs.com/package/stellar-plus) library, an all-in-one Javascript library for building and interacting with the Stellar network. Stellar Plus bundles the main resources from the community into an easy-to-use set of tools and capabilities.

Please note that the demos and experiments included in this repository are meant for educational and illustrative purposes. They can help developers get started with Soroban and serve as a foundation for building more sophisticated and customized applications.

## Repository Summary

| Name                                                           | Description                                                                                                                         | Components                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [Certificate of Deposit](certificate-of-deposit/README.md)     | Soroban smart contracts for the Certificates of Deposit (CD) use case using a Stellar Classic asset and a deployer.                 | Contracts                                                         |
| [Liquidity Pool Dapp](liquidity-pool/README.md)                | Frontend application for the Liquidity Pool use case.                                                                               | Contracts + React application                                     |
| [Liquidity Pool Load Test](liquidity-pool/load-test/README.md) | Load test for Liquidity Pool contract in shell script.                                                                              | Contracts + Shell script                                          |
| [Event Watcher](event-watcher/README.md)                       | Liquidity pool dashboard application that is updated in real time by capturing data from Soroban events integrated with a database. | Contracts + React application + Rust backend + Rust event watcher |
| [DApps Profiling](dapps-profiling/readme.md)                   | Soroban contract profiling examples that offer insights into their efficiency and resource utilization.                             | Typescript application integrated with Stellar-plus               |

## Contributing

### Opening Issues

Feel free to open an issue for bug reports, feature requests, or general feedback. Please provide a clear and detailed description.

### Pull Requests

1. Fork the repository.
2. Create a branch from `main`.
3. Make your changes.
4. Open a pull request, describing the purpose and changes made.
