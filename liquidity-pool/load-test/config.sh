#!/bin/bash

# Environment Variables
export NETWORK_NAME="futurenet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)
export FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
export DATA_DIR="./data"

# Accounts
export ADMIN_PK="GCSDNKNXKYYSBR4XXB5YL23MNEOSN5FWTBVEY6HAQO2XW344D2CKUHOM"  #The Public key of the Admin account
export ADMIN_SK="SBBARYTESWDLKU62HIGEQMUFFPLXUN73B42DXRFAM6LLN4B2Q5KS6UUG"  #The Secret key of the Admin account

# Assets
export ASSET_WASM="../target/wasm32-unknown-unknown/release/abundance_token.optimized.wasm"
export AMM_WASM="../target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.optimized.wasm"
export ASSET_WASM_RAW="../target/wasm32-unknown-unknown/release/abundance_token.wasm"
export AMM_WASM_RAW="../target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm"


# Asset A
export A_DEPLOYER_ACCOUNT_SK=${ADMIN_SK}
export A_DEPLOY_OUTPUT_FILE="asset-a-deploy"
export A_ADMIN_PK=${ADMIN_PK}
export A_ADMIN_SK=${ADMIN_SK}
export A_DECIMAL=7
export A_NAME="FifoCoin"
export A_SYMBOL="FIFO"


# Asset B
export B_DEPLOYER_ACCOUNT_SK=${ADMIN_SK}
export B_DEPLOY_OUTPUT_FILE="asset-b-deploy"
export B_ADMIN_PK=${ADMIN_PK}
export B_ADMIN_SK=${ADMIN_SK}
export B_DECIMAL=7
export B_NAME="CheesecakeCoin"
export B_SYMBOL="CKL"



# AMM
export AMM_DEPLOYER_ACCOUNT_SK=${ADMIN_SK}
export AMM_DEPLOY_OUTPUT_FILE="amm-deploy"
export AMM_CONTRACT_ID=$(<"${DATA_DIR}/${AMM_DEPLOY_OUTPUT_FILE}-out")
export AMM_ADMIN_PK=${ADMIN_PK}
export AMM_ADMIN_SK=${ADMIN_SK}




#USER ACCOUNTS
export USER_A_PK="GC45QSBFYHGQUIWWQEOZ43INQGXX57CSSAABWRZ325H7MNFIFWZ56FD4"   #The Public key of the account that represents a user
export USER_A_SK="SCMEJMTU57FOOUW5JOKIEGUHLORE36JJKHMLS2E6QPGDQ32CRWFWIZGD"   #The Secret key of the account that represents a user
export USER_B_PK="GDOGCPASYE37XXAEDCY5DKDXUFBLJC63NWQFPQWUP6AA6DQCSULUOUK5"   #The Public key of the account that represents a user
export USER_B_SK="SA5FLB42EENZQWTYJASFY4N43J257BKY5ZET6VIVU625KONF5P7P6XEP"   #The Secret key of the account that represents a user
export USER_C_PK="GBWMCTQCRROOLYVBXQGJLXRXNPKAN2GFGNB7RFJOSVLD7EBQF4OI2GDM"   #The Public key of the account that represents a user
export USER_C_SK="SCOMBFLTEGYE7JRIGVJHYWU5AAT7H2IRSJACWPY5BAQV5K7W7UTKR4Z3"   #The Secret key of the account that represents a user


# OTHER
export INVOKE_LOG_OUTPUT_FILE="invoke-log.csv"
export WRITE_TO_LOG_FILE=true
export LOG_TIME=true                             # enable invoke to log the execution time
export DEFAULT_FEE=1000000                       # Base fee in stroops(1 XLM * 10**-7)
export LOAD_AMOUNT=$((10000000 * 10**A_DECIMAL)) # Amount initially loaded in each user account
export DEPOSIT_AMOUNT=$((10000 * 10**A_DECIMAL)) # Initial position deposited by users
export TOTAL_SWAPS=10                            # Total number os swaps to be executed 
export PARALLEL_SWAPS=3                          # Number os swaps to be executed in parallel
export TOTAL_DEPOSIT=5                           # Number os swaps to be executed in parallel
export SLIPPAGE=10                               # Slippage for each swap
export SWAP_MIN_AMOUNT=10                        # Min. value for a swap
export SWAP_MAX_AMOUNT=100  	                 # Max. value for a swap
export TIME_INTERVAL=1                          # Time interval for each execution
export SHARE_AMOUNT=$((10 * 10**A_DECIMAL))      # Initial position deposited by users