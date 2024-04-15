source ./config.sh
export DATA_DIR="./data"

soroban contract bindings typescript \
    --wasm ${GH_CONTRACT_WASM} \
    --output-dir ./.bindings \
    --contract-id ${GH_CONTRACT_ID} \
    --network ${NETWORK_NAME} \
    --overwrite