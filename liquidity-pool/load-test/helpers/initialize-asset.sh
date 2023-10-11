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

./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
    --symbol ${ASSET_SYMBOL} \
    --decimal ${ASSET_DECIMAL} \
    --name ${ASSET_NAME} \
    --admin ${ASSET_ADMIN_PK}
  