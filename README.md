
<p align="center">
  <a href="https://cheesecakelabs.com/en/">
    <img src="images/cheesecake-labs-logo.png" width="51%" alt="Logo">
  </a>
  <img src="images/blue_plus_icon.png" width="9%">
  <a href="https://www.stellar.org/learn/intro-to-stellar">
    <img src="images/stellar-logo.png" width="29%" title="Stellar">
  </a>
</p>

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

1. [Fork](https://github.com/CheesecakeLabs/soroban-dapps/fork) the repository.
2. Create a branch from `main`.
   ```
   git checkout main
   git pull origin main
   git checkout -b your-feature-branch
   ```
3. Make your changes.
4. Commit and push your changes to your forked repository.
   ```
   git add .
   git commit -m "Your commit message"
   git push origin your-feature-branch
   ```
5. Visit your forked repository on GitHub and create a pull request from your feature branch to the original repository's `main` branch.


# Learn more:
- [About Stellar](https://www.stellar.org/learn/intro-to-stellar)  
- [Stellar docs](https://developers.stellar.org/docs/)  
- [About Soroban](https://soroban.stellar.org/)  
- [Soroban docs](https://soroban.stellar.org/docs)  

# Get involved:
- [Protocol proposals](https://github.com/stellar/stellar-protocol)
- [Developer Discord](https://discord.gg/stellardev)

# Need Help?
- [Cheesecake Labs](https://cheesecakelabs.com/contact/)
