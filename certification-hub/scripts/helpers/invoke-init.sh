#!/bin/bash

CONTRACT_ID=$(<"${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out")
INVOKER_SK=${ADMIN_SK}
FUNCTION_NAME="initialize"

SUPER_ADMIN=${ADMIN_PK}

./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
  --super_admin ${SUPER_ADMIN} 
 