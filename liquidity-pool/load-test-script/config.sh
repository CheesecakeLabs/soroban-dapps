#!/bin/bash

# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (testnet, futurenet)
export LOCAL=false

if [ "$LOCAL" == true ]; then
    export FRIENDBOT_URL="http://localhost:8000/friendbot" 
else
    if [ "$NETWORK_NAME" == "testnet" ]; then
        export FRIENDBOT_URL="https://friendbot.stellar.org/"
    else
        export FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
    fi
fi

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

# OTHER
export INVOKE_LOG_OUTPUT_FILE="invoke-log.csv"
export WRITE_TO_LOG_FILE=true
export LOG_TIME=true                             # enable invoke to log the execution time
# 400 0000000 is not in 0..=4294967295
# 40000 000 000 is not in 0..=4294 967 295
# export DEFAULT_FEE=$((400 * 10**A_DECIMAL))    # Base fee in stroops(1 XLM * 10**-7)
export DEFAULT_FEE=$((400 * 10**A_DECIMAL))                    # Base fee in stroops(1 XLM * 10**-7)
export LOAD_AMOUNT=$((10000000 * 10**A_DECIMAL)) # Amount initially loaded in each user account
export PARALLEL_SWAPS=3                          # Number of swaps to be executed in parallel
export SWAP_MIN_AMOUNT=10000                     # Min. value for a swap
export SWAP_MAX_AMOUNT=100000  	                 # Max. value for a swap
export TIME_INTERVAL=1                           # Time interval for each execution
export TOTAL_ACCOUNTS=7                          # Number of accounts to be created