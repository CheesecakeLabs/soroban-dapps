source ./config.sh
export DATA_DIR="./data"

soroban contract bindings typescript \
    --wasm ${PR_CONTRACT_WASM} \
    --output-dir ./.bindings \
    --contract-id ${PR_CONTRACT_ID} \
    --network ${NETWORK_NAME} \
    --overwrite