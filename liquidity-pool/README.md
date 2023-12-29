# Soroban Liquidity Pool Dapp Example

This React demo project simulates a Liquidity Pool Dapp using Soroban smart contracts on Stellar. 

![preview](https://github.com/CheesecakeLabs/soroban-dapps/assets/31604209/dddbdf82-80b3-41a8-aeda-b54a69207d5a)

Part of the code structure was done using [this repository](https://github.com/stellar/soroban-example-dapp) as inspiration.


Getting Started
===============

Install Dependencies
--------------------

1. `soroban-cli 20.0.0-rc2`. See https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli
2. If you want to run the Soroban RPC locally: `docker` (you can run both Standalone and Futurenet backends with it)
3. `Node.js v16`
4. [Freighter Wallet](https://www.freighter.app/) ≥[v5.0.2](https://github.com/stellar/freighter/releases/tag/2.9.1). Or from the Firefox / Chrome extension store. Once installed, enable "Experimental Mode" in the settings (gear icon).


Run Backend
-----------

You have three options: 1. Deploy on [Futurenet](https://soroban.stellar.org/docs/getting-started/deploy-to-futurenet) using a remote [RPC](https://soroban.stellar.org/docs/getting-started/run-rpc) endpoint, 2. Run your own Futerenet RPC node with Docker and deploy to it, 3. run in [localnet/standalone](https://soroban.stellar.org/docs/getting-started/deploy-to-a-local-network) mode.

### Option 1: Deploy on Futurenet

0. Make sure you have soroban-cli installed, as explained above

1. Deploy the contracts and initialize them

       ./initialize.sh futurenet

   This will create a `token-admin` identity for you (`soroban config identity create token-admin`) and deploy two tokens to be used in the pool as well as the [liquidity pool contract](./contracts/src).

2. Select the Futurenet network in your Freighter browser extension

### Option 2: Run your own Futurenet node

1. Run the soroban-rpc locally using the Stellar Quickstart Docker image
```
docker run --rm -it \
   -p 8000:8000 \
   --name stellar \
   stellar/quickstart:soroban-dev@sha256:8a99332f834ca82e3ac1418143736af59b5288e792d1c4278d6c547c6ed8da3b \
   --futurenet \
   --enable-soroban-rpc
```

   **Note:** This can take up to 5 minutes to start syncing. You can tell it is
   working by visiting http://localhost:8000/, and look at the
   `ingest_latest_ledger`, field. If it is `0`, the quickstart image is not ready yet. 

3. Keep that running, then deploy the contracts and initialize them:

       ./initialize.sh futurenet http://localhost:8000

4. Add the Futurenet custom network in Freighter (Note, the out-of-the-box
   "Future Net" network in Freighter will not work with a local quickstart
   container, so we need to add our own):

   |                        |                                        |
   | ---------------------- | -------------------------------------- |
   | Name                   | Futurenet Local RPC                    |
   | URL                    | http://localhost:8000/soroban/rpc      |
   | Passphrase             | Test SDF Future Network ; October 2022 |
   | Allow HTTP connection  | Enabled                                |
   | Switch to this network | Enabled                                |

5. Add some Futurenet network lumens to your Freighter wallet.

   Visit https://laboratory.stellar.org/#create-account, and follow the instructions to create your freighter account on Futurenet.

### Option 3: Localnet/Standalone

1. Run the soroban-rpc locally using the Stellar Quickstart Docker image
```
docker run --rm -it \
  -p 8000:8000 \
  --name stellar \
  stellar/quickstart:soroban-dev@sha256:8a99332f834ca82e3ac1418143736af59b5288e792d1c4278d6c547c6ed8da3b \
  --standalone \
  --enable-soroban-rpc
```

2. Keep that running, then deploy the contracts and initialize them:

       ./initialize.sh standalone

   **Note:** this state will be lost if the quickstart docker container is removed. You will need to re-run `./initialize.sh` every time you restart the container.

3. Add the Standalone custom network in Freighter

   |                        |                                    |
   | ---------------------- | ---------------------------------- |
   | Name                   | Standalone                         |
   | URL                    | http://localhost:8000/soroban/rpc  |
   | Passphrase             | Standalone Network ; February 2017 |
   | Allow HTTP connection  | Enabled                            |
   | Switch to this network | Enabled                            |

4. Add some Standalone network lumens to your Freighter wallet.

   1. Copy the address for your freighter wallet.
   2. Visit `http://localhost:8000/friendbot?addr=<your address>`


Frontend
--------

Now that you're running the backend, go to the `frontend` folder and run the development server:

    make setup && make start_dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



Features
===============
This section provides an overview of the functionalities available in this demo.

Mint the example tokens
-----------------------
- The demo allows users to mint the example tokens to the active account, enabling them to acquire tokens for testing the liquidity pool.
- This operation is performed using classic Stellar operations since the tokens used are classic tokens wrapped in contracts.
- The minting process requires admin authentication and is signed with the `token-admin` secret key.


Deposit
-------
- Users have the ability to deposit a pair of tokens into the liquidity pool.
- If the liquidity pool is empty, users can deposit any amount of each token, subject to their available balance.
- If the liquidity pool already contains token reserves, the deposit must maintain the existing proportional balance in the pool. To accommodate variations, users can adjust the Max Slippage factor, which allows for a flexible range within which the deposited values can fluctuate. If this factor is not enough, the transaction will fail.
- Upon completing a deposit, users receive Pool Share tokens, representing their ownership share in the liquidity pool. 


Swap
----
- Users can swap an amount of a token for another based on the liquidity pool values.
- When swapping tokens, the contract calculates the precise amount of tokens that need to be sold in order to acquire the desired output amount of the purchased token. This calculation is based on the current liquidity pool values. Users have the flexibility to adjust the maximum amount of tokens they are willing to sell by utilizing the Max Slippage factor. If the specified sell amount exceeds this limit, the transaction will fail.
- The liquidity pool applies a fixed swap fee of 0.3% to each transaction. This fee results in a portion of the user's tokens being retained within the liquidity pool, reducing the received value during the swap. The retained tokens contribute to the overall liquidity of the pool.
- If the amounts of the token pair being swapped are not proportional to the ratio of balances in the pool, it indicates that the swap has disrupted the balance of the pool. As a result, the transaction will fail to maintain the integrity of the pool.


Withdraw
--------
- Users have the option to burn their Pool Share tokens to withdraw a specific quantity of tokens from the liquidity pool.
- The amount of each token to be withdrawn is determined based on the proportion represented by the burned Pool Share tokens. As a result, users may receive a different amount than what they initially deposited, reflecting variations in the pool's composition.
- Prior to confirming the transaction, users are presented with the minimum values they will receive for each token. They can customize these values using the Max Slippage factor. If the adjusted values fall below the required minimum, the transaction will fail.
