#!/bin/bash

CONTRACT_ID=$(<"${DATA_DIR}/${AMM_DEPLOY_OUTPUT_FILE}-out")
INVOKER_SK=${AMM_ADMIN_SK}
FUNCTION_NAME="initialize"


# Important to reload it here in case it was previously 
# deployed in the same script execution otherwise, the 
# value would've been loaded from config.sh at the very 
# beginning of the execution
A_CONTRACT_ID_UPDT=$(<"${DATA_DIR}/${A_DEPLOY_OUTPUT_FILE}-out")
B_CONTRACT_ID_UPDT=$(<"${DATA_DIR}/${B_DEPLOY_OUTPUT_FILE}-out")

echo "Installing token wasm contract"
TOKEN_WASM_HASH="$(soroban contract install \
    --network ${NETWORK_NAME} \
    --source ${ADMIN_SK} \
    --wasm ${ASSET_WASM}  
)"

echo "TOKEN_WASM_HASH: $TOKEN_WASM_HASH"

if [[ "$B_CONTRACT_ID_UPDT" < "$A_CONTRACT_ID_UPDT" ]]; then
  echo "Asset B Id < Asset A Id"
  echo "Changing tokens order"
  TEMP_A_ID=$A_CONTRACT_ID_UPDT
  A_CONTRACT_ID_UPDT=$B_CONTRACT_ID_UPDT
  B_CONTRACT_ID_UPDT=$TEMP_A_ID
fi


./helpers/invoke.sh \
  ${CONTRACT_ID} \
  ${FUNCTION_NAME} \
  ${INVOKER_SK} \
    --token_wasm_hash ${TOKEN_WASM_HASH} \
    --token_a "$A_CONTRACT_ID_UPDT" \
    --token_b "$B_CONTRACT_ID_UPDT"

# fail=true
# while [ $fail ]; 
# do
#   echo "Running invoke"
#   result=$(soroban contract invoke \
#     --id ${CONTRACT_ID} \
#     --source ${INVOKER_SK} \
#     --network ${NETWORK_NAME} \
#     --fee ${DEFAULT_FEE} \
#     -- \
#     "${FUNCTION_NAME}" \
#     --token_wasm_hash ${TOKEN_WASM_HASH} \
#     --token_a "$A_CONTRACT_ID_UPDT" \
#     --token_b "$B_CONTRACT_ID_UPDT")
#   if [ $? -eq 0 ]; then
#     fail=false
#   fi
# done    