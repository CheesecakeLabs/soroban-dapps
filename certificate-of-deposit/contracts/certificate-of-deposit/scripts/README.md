# Helper Scripts

Here you'll find a few helper scripts to deploy and test the Certificates of Deposit dApp.

## Configuration

Before using the contract, you need to configure the necessary parameters in the `config.sh` file. This file contains environment variables, account details, and other attributes used by the contract and deployment scripts.

To configure the contract, follow these steps:

1. Open the `config.sh` file in the `scripts` folder.

2. Set the required values for the environment variables and account details. Additional comments are there to indicate what each parameter represents.

3. Save and close the file.

# Initialization

After setting the configuration parameters, one can deploy and initialize the contract by running the following script:

```bash
./init.sh
```

This script will load the configuration parameters and perform the following steps:

1. Wrap the classic asset in a soroban asset contract. In case it was already wrapped, it'll then collect its address to use in the following steps.

2. Deploy the Certificates of Deposit contract in the selected network.

3. Initialize the CoD contract with the base parameters set.

4. Mint new units of the classic asset and fuel the CoD contract.

5. Mint new units of the classic asset and fuel the user account.

# Running the contract

To run the contract from different perspectives one may use the `run.sh` script which takes additional arguments to trigger the different contract functions.
The accepted structure is the following:

```bash
./run.sh <ACTOR> <ACTION> <ARGS>
```

The first argument determines the actor which can be one of the following:

- `user`: Invokes different contract functions from the user perspective.
- `admin`: Invokes different contract functions from the contract admin perspective.

Depending on the provided actor, one can select a number of different actions.

## User Actions

### Deposit

Action: `d`
Additional arguments: `<amount>`

To perform a user deposit of 100 stroops one can run the following command:

```bash
./run.sh user d 100
```

### Withdraw

Action: `w`
Additional arguments: `<accept_premature_withdraw>`

To perform a user withdrawone can run the following command:

```bash
./run.sh user w
```

This will execute a withdrawal in case the term has already been achieved. To force a premature withdrawal, one can use the following option:

```bash
./run.sh user w true
```

This will add the argument `--accept_premature_withdraw` when invoking the contract.

### Get Data

Action: `get`
Additional arguments: `pos`, `yield`, `premature`, `time`

One can use one of the additional arguments listed to invoke a different 'get' function.

- Get the current position of the user (Original deposit plus interest accrued so far)

```bash
./run.sh user get pos
```

- Get the current yield accrued for the user (Partial interest calculated so far on top of the deposit)

```bash
./run.sh user get yield
```

- Get estimated position if withdrawn now (Original deposit plus accrued interest with applied penalties if earlier than the term duration)

```bash
./run.sh user get premature
```

- Get time left for the user position to achieve the term in seconds

```bash
./run.sh user get time
```

## Admin Actions

### Withdraw contract funds

Action: `w`
Additional arguments: `<amount> <destinatin address>`

- Admin triggers a withdrawal to move funds from the contract treasury to another address. Below is an example of withdrawing 1000000 strops to another account.

```bash
./run.sh admin w 1000000 GDSLEJXPR6X5BKVFGLJEFRLG6BA66VMXRWMIVWZNPI3HUK7PMZWA43MO
```

## Asset Actions

Action: `m`
Additional arguments: `<to> <amount>`

- Asset Issuer triggers a mint sending funds to the target.The `<to>` parameter can be on of the following:
  - cod: Sends the minted funds to the CoD contract
  - user: Sends the minted funds to the User contract

Sending 100000 stroops to the CoD contract:

```bash
./run.sh asset m cod 100000
```

Sending 100000 stroops to the User account:

```bash
./run.sh asset m user 100000
```

# Generating Data for the Frontend

If you'd like to use the recently generated contracts in the frontend, you can run the following command to create a `contract-data.json` file containing the contract parameters.

```bash
./generate-frontend-data.sh
```

Example of `contract-data.json` file:

```json
{
  "network_name": "futurenet",
  "asset": {
    "asset_code": "FIFO",
    "asset_contract_id": "CDBZO2BCX7OQ4DKSF45WOYLBSBXH4RPUV55J3OHKYFOXUC4ZBUUUFG3H",
    "asset_issuer_pk": "GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"
  },
  "cod": {
    "cod_contract_id": "CCHAXLE5NWI5UY4STMM3M7ZC5K5U4YAOHFVIKX7AGWLFASAUTPRTCWH5",
    "cod_term": 60,
    "cod_yield_rate": 2000,
    "cod_min_deposit": 100,
    "cod_penalty_rate": 5000
  }
}
```
