# Certificates of Deposit dApp example

This repository contains a demo Soroban dApp for managing Certificates of Deposit (CD) using a Stellar Classic asset.

**Important**: This is a demo implementation designed to showcase Soroban's capabilities. It should be deployed to futurenet and testnet only.

## Use Case

The Certificates of Deposit dApp is designed to run a certificate of deposit system for a Stellar Classic asset. It allows users to make deposits, which will accrue interest based on the configured yield rate and term. At the end of the term, users can withdraw their original deposit along with the accrued interest.

### Initialization

There is a set of configurable parameters during initialization that defines how the contract will behave.

- Yield Rate: The dApp allows setting a yield rate, determining the interest that accrues on deposits during the term.
- Term: Defines the period in seconds for how long the deposit will accrue yield. The full yield rate is achieved at the end of the term.
- Minimum Deposit Amount: The dApp enforces a minimum deposit amount, ensuring that only deposits above this threshold are accepted.
- Penalty Rate. This rate applies to users who withdraw before the end of the term. The penalty is applied on the interest accrued until the moment of the withdrawal.

### Features

#### Deposit

A User can perform a deposit above the minimum threshold and it'll start to accrue interest rate immediately until it reaches the end of the term.
The full yield rate is achieved at the end of the term and then the deposit does not accrue any more interest.

It is important to note that a user can only have one active deposit at a time.

#### Withdraw

Once active deposit has achieved the end of the term it can be fully withdrawn with the accrued interest. Both the original deposit and yield are paid at once and the user position is closed, enabling for a new deposit to be made if desired.

#### Premature Withdraw

In case the term hasn't been reached yet, the flag `accept_premature_withdraw` can be provided with the withdrawal request and the user will perform a premature withdrawal.
When withdrawing prematurely, the penalty rate will be applied to the yield accrued until that moment.

e.g. An user that has accrued 100 stroops in yield, withdrawing prematurely with a penalty rate of 50% would get only 50 stroops of yield on top of the original deposit.

#### Withdraw Contract Funds

An admin can withdraw the contract funds by performing an `admin_withdraw`. It is just important to keep the contract fueled with enough balance to pay the existing positions, otherwise users might get a `"Contract is underfunded."` error when withdrawing.

# Getting Started

Follow the steps below to deploy and interact with the Certificates of Deposit dApp:

## Install Dependencies

1. `soroban-cli v0.9.4`. See https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli

## Compile Contract

1. In the project root directory, run the command `soroban contract build`. This will compile the project and generate the wasm files for the contract.

## Deploy on Futurenet

1. Access the folder `/scripts`. There you'll find a collection of helpers scripts to deploy and test this contract.
2. Set the parameters under `config.sh`. By default, they come set for futurenet with dummy accounts and assets.
3. Run `init.sh` to deploy and initialize the contract and basic setup.

For further details on how to configure and use the helper scripts, refer to [./scripts/README](scripts/README.md).

## Usage

One can use the `run.sh` helper script to execute the different contract functions. Here below is an example of a user interacting with the contract.
For further details on how to configure and use the helper scripts, refer to [./scripts/README](scripts/README.md).

1. The user performs a deposit of 1000 stroops of the asset.
   ```bash
   ./run.sh user d 1000
   ```
2. After a few minutes, the user verifies their accrued yield.
   ```bash
   ./run.sh user get yield
   ```
3. After the end of the term, the user then withdraws his position.
   ```bash
   ./run.sh user w
   ```

## Contributing

We welcome contributions from the community to enhance and improve the Certificates of Deposit dApp. If you find any bugs or have ideas for new features, feel free to open an issue or submit a pull request.
