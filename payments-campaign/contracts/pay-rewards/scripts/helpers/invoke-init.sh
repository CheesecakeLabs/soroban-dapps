#!/bin/bash

CONTRACT_ID=$(<"${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out")
INVOKER_SK=${ADMIN_SK}
FUNCTION_NAME="initialize"

ADMIN=${ADMIN_PK}

./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
  --admin ${ADMIN} 
  --asset ${PR_ASSET} \
  --end_time ${END_TIME} \
  --reward ${REWARD} \
  --amount_required ${AMOUNT_REQUIRED} \
  --start_now ${START_NOW}
