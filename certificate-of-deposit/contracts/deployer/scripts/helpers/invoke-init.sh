#!/bin/bash

CONTRACT_ID=$(<"${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out")
INVOKER_SK=${ADMIN_SK}
FUNCTION_NAME="initialize"

ADMIN=${ADMIN_PK}
ASSET_ADDRESS=$(<"${DATA_DIR}/${ASSET_DEPLOY_OUTPUT_FILE}-out")
TERM=${COD_TERM}
YIELD_RATE=${COD_YIELD_RATE}
MIN_DEPOSIT=${COD_MIN_DEPOSIT}
PENALTY_RATE=${COD_PENALTY_RATE}

./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
  --admin ${ADMIN} \
  --asset ${ASSET_ADDRESS} \
  --term  ${TERM} \
  --yield_rate ${YIELD_RATE} \
  --min_deposit ${MIN_DEPOSIT} \
  --penalty_rate ${PENALTY_RATE}