#!/bin/bash

ASSET_OUTPUT_FILE=$1
ASSET_ADMIN_PK=$2
ASSET_ADMIN_SK=$3
ASSET_SYMBOL=$4
ASSET_DECIMAL=$5
ASSET_NAME=$6


CONTRACT_ID=$(<"${DATA_DIR}/${ASSET_OUTPUT_FILE}-out")
INVOKER_SK=${ASSET_ADMIN_SK}
FUNCTION_NAME="initialize"

# Important to reload it here in case it was previously 
# deployed in the same script execution otherwise, the 
# value would've been loaded from config.sh at the very 
# beginning of the execution
#RA_CONTRACT_ID_UPDT=$(<"${DATA_DIR}/${RA_DEPLOY_OUTPUT_FILE}-out")

./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
    --symbol ${ASSET_SYMBOL} \
    --decimal ${ASSET_DECIMAL} \
    --name ${ASSET_NAME} \
    --admin ${ASSET_ADMIN_PK}
  