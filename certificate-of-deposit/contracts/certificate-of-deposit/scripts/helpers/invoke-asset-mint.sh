#!/bin/bash


CONTRACT_ID=$(<"${DATA_DIR}/${ASSET_DEPLOY_OUTPUT_FILE}-out")
FUNCTION_NAME="mint"
INVOKER_SK=${ASSET_ISSUER_SK}



TO=$1
AMOUNT=$2


./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
  --to ${TO} \
  --amount  ${AMOUNT} 
 