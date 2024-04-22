source ./config.sh
export DATA_DIR="./data"

soroban contract bindings typescript \
    --wasm ${SB_CONTRACT_WASM} \
    --output-dir ./.bindings \
    --contract-id ${SB_CONTRACT_ID} \
    --network ${NETWORK_NAME} \
    --overwrite