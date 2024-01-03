#!/bin/bash

ASSET=${CLASSIC_ASSET}
DEPLOYER_SK=${ASSET_DEPLOYER_SK}
DEPLOY_OUTPUT_FILE=${ASSET_DEPLOY_OUTPUT_FILE}

CONTRACT_ID=$(soroban lab token wrap \
    --asset ${ASSET} \
    --source-account ${DEPLOYER_SK} \
    --network ${NETWORK_NAME})

# Check if the CONTRACT_ID is a valid ID (not empty and doesn't contain "error")
if [[ -n "${CONTRACT_ID}" && ! "${CONTRACT_ID}" == *"error"* ]]; then
    echo "Token Wrapped: ${CONTRACT_ID}"
else
    echo "Error Wrapping token, getting existing ID..."
    CONTRACT_ID=$(soroban lab token id \
        --asset ${ASSET} \
        --source-account ${DEPLOYER_SK} \
        --network ${NETWORK_NAME})

fi

# Check if the directory exists and create it if it doesn't
mkdir -p ${DATA_DIR}

# Store Contract ID
echo ${CONTRACT_ID} > ${DATA_DIR}/${DEPLOY_OUTPUT_FILE}-out


# Output the Contract ID
echo "Contract ID: ${CONTRACT_ID} has been saved in ${DATA_DIR}/${DEPLOY_OUTPUT_FILE}-out"