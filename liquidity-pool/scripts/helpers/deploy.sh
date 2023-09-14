#!/bin/bash

# Get the function name and args from command-line arguments
CONTRACT_WASM=$1
DEPLOYER_SK=$2
DEPLOY_OUTPUT_FILE=$3


# Deploy Contract
CONTRACT_ID=$(soroban contract deploy \
  --wasm ${CONTRACT_WASM} \
  --source ${DEPLOYER_SK} \
  --network ${NETWORK_NAME})

# Check if the directory exists and create it if it doesn't
mkdir -p ${DATA_DIR}
# Store Contract ID
echo ${CONTRACT_ID} > ${DATA_DIR}/${DEPLOY_OUTPUT_FILE}-out

# Output the Contract ID
echo "Contract ID: ${CONTRACT_ID} has been saved in ${DATA_DIR}/${DEPLOY_OUTPUT_FILE}-out"

