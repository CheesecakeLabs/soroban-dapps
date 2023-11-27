#!/bin/bash

set -e

source ./config.sh

STYLE='\033[1;37;44m'
NS='\033[0m' # No Color

if [ $LOCAL == false ]; then
  if [ "$NETWORK_NAME" == "testnet" ]; then
    SOROBAN_RPC_HOST="https://soroban-testnet.stellar.org:443"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"
  elif [ "$NETWORK_NAME" == "futurenet" ]; then
    SOROBAN_RPC_HOST="https://rpc-futurenet.stellar.org:443"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"
  fi
else 
  SOROBAN_RPC_URL="http://localhost:8000/soroban/rpc" 
fi

case "$NETWORK_NAME" in
    futurenet)
    echo "Using Futurenet network with RPC URL: $SOROBAN_RPC_URL"
    SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
    ;;
    testnet)
    echo "Using Testnet network with RPC URL: $SOROBAN_RPC_URL"
    SOROBAN_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
    ;;  
    *)
    echo "Usage: $0 futurenet|testnet [rpc-host]"
    exit 1
    ;;
esac

echo Add the $NETWORK_NAME network to cli client
soroban config network add \
  --rpc-url "$SOROBAN_RPC_URL" \
  --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE" "$NETWORK_NAME"


echo -e "\n ${STYLE}BUILDING CONTRACTS...${NS}"
cd ..
soroban contract build
cd load-test

echo -e "\n ${STYLE}OPTIMIZING CONTRACTS...${NS}"
soroban contract optimize --wasm ${AMM_WASM_RAW}
soroban contract optimize --wasm ${ASSET_WASM_RAW}

# Check if the directory exists and create it if it doesn't
echo "creating DATA_DIR: ${DATA_DIR}"
mkdir -p ${DATA_DIR}

echo -e "\n ${STYLE}DEPLOYING ASSET A CONTRACT...${NS}"
./helpers/deploy.sh ${ASSET_WASM} ${A_DEPLOYER_ACCOUNT_SK} ${A_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING ASSET A CONTRACT...${NS}"
./helpers/initialize-asset.sh ${A_DEPLOY_OUTPUT_FILE} ${A_ADMIN_PK} ${A_ADMIN_SK} ${A_SYMBOL} ${A_DECIMAL} ${A_NAME}


echo -e "\n ${STYLE}DEPLOYING ASSET B CONTRACT...${NS}"
./helpers/deploy.sh ${ASSET_WASM} ${B_DEPLOYER_ACCOUNT_SK} ${B_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING ASSET B CONTRACT...${NS}"
./helpers/initialize-asset.sh ${B_DEPLOY_OUTPUT_FILE} ${B_ADMIN_PK} ${B_ADMIN_SK} ${B_SYMBOL} ${B_DECIMAL} ${B_NAME}


echo -e "\n ${STYLE}DEPLOYING AMM CONTRACT...${NS}"
./helpers/deploy.sh ${AMM_WASM} ${AMM_DEPLOYER_ACCOUNT_SK} ${AMM_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING AMM CONTRACT...${NS}"
./helpers/initialize-amm.sh

echo -e "\n ${STYLE}CREATE ACCOUNTS...${NS}"
source helpers/create-accounts.sh

echo -e "\n ${STYLE}LOADING USER ACCOUNTS WITH TOKENS...${NS}"
source helpers/load-accounts.sh

