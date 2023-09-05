# Event watcher Example

This is a demo project showcasing a Soroban Dapp that utilizes an event watcher service to update contract data in a database. The Dapp serves as a liquidity pool dashboard, enabling users to access metrics and interact with liquidity pools.

Getting Started
===============

Install Dependencies
--------------------

1. `soroban-cli v0.9.4`
2. `stellar-core` compatible with Futurenet to execute the [rs-ingest](https://github.com/xycloo/rs-ingest) dependency. You can follow [these](https://github.com/xycloo/rs-ingest/tree/main#stellar-core-setup) instructions.
3. `Node.js v18`
4. [Freighter Wallet](https://www.freighter.app/) ≥[v5.0.2](https://github.com/stellar/freighter/releases/tag/2.9.1). Or from the Firefox / Chrome extension store. Once installed, enable "Experimental Mode" in the settings (gear icon).


Run Backend
-----------
Go to the `backend` folder and run the following command::

       cargo run

This command will start the backend, which creates a new SQLite database and provides APIs to query the database data. Keep it running.


Initialize
-----------
From the root folder, run:

       ./initialize

This command will create example liquidity pools and tokens, saving them in the database. There are a total of three liquidity pools with different token pairs.


Run Event Watcher
-----------
Go to the `events` folder and run:

       cargo run

This command will launch the service responsible for ingesting the pool events and updating the database located in the backend folder with the latest data. Keep it running.


Run Frontend
-----------
Go to the `frontend` folder and set up the `.env` file:

       cp src/config/.env.example src/config/.env

Now, start the frontend:

       make start


Open [http://localhost:5173](http://localhost:5173) with your browser to see the result. 


Overview
===============

- **Tokens**: Tokens generated as examples are linked to a fictional XLM value at the time of their creation. This simplifies the calculation of metrics such as volume and liquidity in a common currency. It's possible to check these values on the home page.

- **Liquidity**: The liquidity of each pool is calculated by multiplying the value of current reserves by the price in XLM of each currency. The Total Value Locked (TVL) represents the sum total of the liquidity across all the pools.

- **Volume**: Refers to the total amount of inputs from swap operations.

- **Fees**: The "fees" field represents the amount of fees collected by the pool, which is 0.3% of the amount of the swap input.

- **User Accounts**: This indicates the number of users who have interacted with the pool.
