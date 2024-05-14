source ./config.sh
export DATA_DIR="./data"

soroban contract bindings typescript \
    --wasm ${SATP_TOKEN_CONTRACT_WASM} \
    --output-dir ./.bindings \
    --contract-id ${SATP_TOKEN_CONTRACT_ID} \
    --network ${NETWORK_NAME} \
    --overwrite