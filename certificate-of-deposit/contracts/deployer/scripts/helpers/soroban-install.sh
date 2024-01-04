
ADMIN=$1



WASM_HASH=$(soroban contract install \
  --network ${NETWORK_NAME} \
  --source ${ADMIN} \
  --wasm ${COD_CONTRACT_WASM_OPTIMIZED})


  # Check if the directory exists and create it if it doesn't
mkdir -p ${DATA_DIR}
# Store Contract ID
echo ${WASM_HASH} > ${DATA_DIR}/${COD_WASM_FILE}-out

# Output the Contract ID
echo "Contract wasm hash: ${WASM_HASH} has been saved in ${DATA_DIR}/${COD_WASM_FILE}-out"


