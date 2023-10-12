#!/bin/bash


CONTRACT_ID=$(<"${DATA_DIR}/${DEP_DEPLOY_OUTPUT_FILE}-out")
FUNCTION_NAME="deploy"
INVOKER_SK=${COD_ADMIN_SK}


CONTRACT_ID=$(soroban contract invoke \
  --id ${CONTRACT_ID} \
  --source ${INVOKER_SK} \
  --network ${NETWORK_NAME} \
  --fee ${FEE} \
  -- \
  "${FUNCTION_NAME}" \
  --deployer ${COD_ADMIN_PK} \
  --wasm_hash ${COD_WASM_HASH} \
  --salt ${SALT} \
  --admin ${COD_ADMIN_PK} \
  --asset ${ASSET_CONTRACT_ID} \
  --term ${COD_TERM} \
  --compound_step ${COD_COMPOUND_STEP} \
  --yield_rate ${COD_YIELD_RATE} \
  --min_deposit ${COD_MIN_DEPOSIT} \
  --penalty_rate ${COD_PENALTY_RATE})

  
# Check if the directory exists and create it if it doesn't
mkdir -p ${DATA_DIR}
# Store Contract ID
echo ${CONTRACT_ID} > ${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out

# Output the Contract ID
echo "Contract ID: ${CONTRACT_ID} has been saved in ${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out"



 