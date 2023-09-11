# Event watcher Example

This is a demo project showcasing a Soroban Dapp that utilizes an event watcher service to update contract data in a database. The Dapp serves as a liquidity pool dashboard, enabling users to access metrics and interact with liquidity pools.

![event-watcher-preview](https://github.com/CheesecakeLabs/soroban-dapps/assets/31604209/f70a1ac7-aa6a-43c5-89ea-4d7313c95cd2)


Getting Started
===============

Install Dependencies
--------------------

1. `soroban-cli v0.9.4`
2. `stellar-core` compatible with Futurenet to execute the [rs-ingest](https://github.com/xycloo/rs-ingest) dependency. You can follow [these](https://github.com/xycloo/rs-ingest/tree/main#stellar-core-setup) instructions.
3. `Node.js v18`
4. [Freighter Wallet](https://www.freighter.app/) ≥[v5.0.2](https://github.com/stellar/freighter/releases/tag/2.9.1). Or from the Firefox / Chrome extension store. Once installed, enable "Experimental Mode" in the settings (gear icon).


Initialize
-----------
From the root folder, run:

       ./initialize.sh

This command will create example liquidity pools and tokens, saving them in the database. There are a total of three liquidity pools with different token pairs.

Build Application
-----------
Run the following command:

       make build

This command will build the frontend, backend and events. Will download and install dependencies.

Run Application
-----------
To run application execute the following command:

       make run -j3

This command will start the backend, which creates a new SQLite database and provides APIs to query the database data. Then will launch the service responsible for ingesting the pool events and updating the database located in the backend folder with the latest data. Finally, starts the frontend, keeping it all running.

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Run application separately
Run Backend
-----------
Go to the `backend` folder and run the following command::

       cargo run

This command will start the backend separately.

Run Event Watcher
-----------
Go to the `events` folder and run:

       cargo run

This command will launch the event service and keep it running.


Run Frontend
-----------
Go to the `frontend` folder and start the frontend:

       make start


The frontend is created in [http://localhost:5173](http://localhost:5173). 


Overview
===============

- **Tokens**: Tokens generated as examples are linked to a fictional XLM value at the time of their creation. This simplifies the calculation of metrics such as volume and liquidity in a common currency. It's possible to check these values on the home page.

- **Liquidity**: The liquidity of each pool is calculated by multiplying the value of current reserves by the price in XLM of each currency. The Total Value Locked (TVL) represents the sum total of the liquidity across all the pools.

- **Volume**: Refers to the total amount of inputs from swap operations.

- **Fees**: The "fees" field represents the amount of fees collected by the pool, which is 0.3% of the amount of the swap input.

- **User Accounts**: This indicates the number of users who have interacted with the pool.
