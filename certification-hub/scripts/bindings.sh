source ./config.sh
export DATA_DIR="./data"

soroban contract bindings typescript \
    --wasm ${CH_CONTRACT_WASM} \
    --output-dir ./.bindings \
    --contract-id ${CH_CONTRACT_ID} \
    --network ${NETWORK_NAME} \
    --overwrite