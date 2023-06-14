# Soroban Liquidity Pool Dapp Example

This is a React demo project that simulate a liquidity pool dapp using Soroban smart contracts on Stellar. 

## Getting started

### Install Dependencies

1. `soroban-cli v0.7.0`. See https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli

2. `Docker`
3. `Node.js v16`
4. Freighter Wallet


### Run backend

#### Option 1: Deploy on Futurenet

#### Option 2: Run your own Futurenet node

#### Option 3: Localnet/Standalone

Run the RPC node

        ./quickstart standalone

Keep that running, then deploy the contracts and initialize them

        ./initialize.sh standalone


### Run frontend

        make start_dev