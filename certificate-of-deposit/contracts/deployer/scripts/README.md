# Helper Scripts

Here you'll find a few helper scripts to deploy and the deployer dApp with the CoD contract.

## Configuration

Before using the contract, you need to configure the necessary parameters in the `config.sh` file. This file contains environment variables,account details and other attributes used by the contract and deployment scripts.

To configure the contract, follow these steps:

1. Open the `config.sh` file in the `scripts` folder.

2. Set the required values for the environment variables and account details. Additional comments are there to indicate what each parameter represents.

3. Save and close the file.

4. Make sure the certificates of deposit contract wasm can be found within the `./cod` folder.

# Initialization

After setting the configuration parameters, one can deploy and initialize the contract by running the following script:

```bash
./init.sh
```

This script will load the configuration parameters and perform the following steps:

1. Wrap the classid asset in a soroban asset contract. In case it was already wrapped, it'll then collect it's address to use in the following steps.

2. Deploy the Deployer contract in the selected network.

3. Generate the WASM hash for CoD contract and store it.

# Running the contract

To run the contract one can make use of the `deploy.sh` script. It will load the data from the configuration file to invoke the deployer contract and deploy a new instance of the CoD dApp with the defined parameters.

```bash
./deploy.sh
```
