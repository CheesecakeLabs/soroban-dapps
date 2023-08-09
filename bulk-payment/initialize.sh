#!/bin/bash

set -e

NETWORK="$1"

SOROBAN_RPC_HOST="$2"

WASM_PATH="target/wasm32-unknown-unknown/release/"
BULK_WASM_PATH=$WASM_PATH"bulk_payment.optimized.wasm"



if [[ "$SOROBAN_RPC_HOST" == "" ]]; then
  # If soroban-cli is called inside the soroban-preview docker container,
  # it can call the stellar standalone container just using its name "stellar"
  if [[ "$IS_USING_DOCKER" == "true" ]]; then
    SOROBAN_RPC_HOST="http://stellar:8000"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"
  elif [[ "$NETWORK" == "futurenet" ]]; then
    SOROBAN_RPC_HOST="https://rpc-futurenet.stellar.org:443"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"
  else
     # assumes standalone on quickstart, which has the soroban/rpc path
    SOROBAN_RPC_HOST="http://localhost:8000"
    SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"
  fi
else 
  SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"  
fi


case "$1" in
standalone)
  echo "Using standalone network with RPC URL: $SOROBAN_RPC_URL"
  SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
  FRIENDBOT_URL="$SOROBAN_RPC_HOST/friendbot"
  ;;
futurenet)
  echo "Using Futurenet network with RPC URL: $SOROBAN_RPC_URL"
  SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
  FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
  ;;
*)
  echo "Usage: $0 standalone|futurenet [rpc-host]"
  exit 1
  ;;
esac

echo Add the $NETWORK network to cli client
soroban config network add \
  --rpc-url "$SOROBAN_RPC_URL" \
  --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE" "$NETWORK"

if !(soroban config identity ls | grep token-admin 2>&1 >/dev/null); then
  echo Create the token-admin identity
  soroban config identity generate token-admin
fi
TOKEN_ADMIN_SECRET="$(soroban config identity show token-admin)"
TOKEN_ADMIN_ADDRESS="$(soroban config identity address token-admin)"

mkdir -p .soroban

# This will fail if the account already exists, but it'll still be fine.
echo Fund token-admin account from friendbot
curl --silent -X POST "$FRIENDBOT_URL?addr=$TOKEN_ADMIN_ADDRESS" >/dev/null

ARGS="--network $NETWORK --source token-admin"


echo "Building contracts"
soroban contract build
echo "Optimizing contracts"
soroban contract optimize --wasm $WASM_PATH"bulk_payment.wasm"


echo Deploy the bulk payment contract
BULK_PAYMENT_ID="$(
  soroban contract deploy $ARGS \
    --wasm $BULK_WASM_PATH
)"
echo "Bulk payment contract deployed succesfully with ID: $BULK_PAYMENT_ID"

# echo Deploy the abundance token A contract
# ABUNDANCE_A_ID="$(
#   soroban contract deploy $ARGS \
#     --wasm $ABUNDANCE_WASM
# )"
# echo "Contract deployed succesfully with ID: $ABUNDANCE_A_ID"

# echo Deploy the abundance token B contract
# ABUNDANCE_B_ID="$(
#   soroban contract deploy $ARGS \
#     --wasm $ABUNDANCE_WASM
# )"
# echo "Contract deployed succesfully with ID: $ABUNDANCE_B_ID"


# if [[ "$ABUNDANCE_B_ID" < "$ABUNDANCE_A_ID" ]]; then
#   echo Changing tokens order
#   OLD_ABUNDANCE_A_ID=$ABUNDANCE_A_ID
#   ABUNDANCE_A_ID=$ABUNDANCE_B_ID
#   ABUNDANCE_B_ID=$OLD_ABUNDANCE_A_ID
# fi


# echo "Initialize the abundance token A contract"
# soroban contract invoke \
#   $ARGS \
#   --id "$ABUNDANCE_A_ID" \
#   -- \
#   initialize \
#   --symbol USDC \
#   --decimal 7 \
#   --name USDCoin \
#   --admin "$TOKEN_ADMIN_ADDRESS"


# echo "Initialize the abundance token B contract"
# soroban contract invoke \
#   $ARGS \
#   --id "$ABUNDANCE_B_ID" \
#   -- \
#   initialize \
#   --symbol BTC \
#   --decimal 7 \
#   --name Bitcoin \
#   --admin "$TOKEN_ADMIN_ADDRESS"


# echo "Installing token wasm contract"
# TOKEN_WASM_HASH="$(soroban contract install \
#     $ARGS \
#     --wasm $TOKEN_WASM
# )"


# echo "Initialize the liquidity pool contract"
# soroban contract invoke \
#   $ARGS \
#   --wasm $LIQUIDITY_POOL_WASM \
#   --id "$LIQUIDITY_POOL_ID" \
#   -- \
#   initialize \
#   --token_wasm_hash "$TOKEN_WASM_HASH" \
#   --token_a "$ABUNDANCE_A_ID" \
#   --token_b "$ABUNDANCE_B_ID"


# echo "Getting the share id"
# SHARE_ID="$(soroban contract invoke \
#   $ARGS \
#   --wasm $LIQUIDITY_POOL_WASM \
#   --id "$LIQUIDITY_POOL_ID" \
#   -- \
#   share_id
# )"
# SHARE_ID=${SHARE_ID//\"/}
# echo "Share ID: $SHARE_ID"

echo "Generating bindings"
soroban contract bindings typescript --wasm $BULK_WASM_PATH --network $NETWORK --contract-id $BULK_PAYMENT_ID --contract-name bulk-payment --output-dir ".soroban/contracts/bulk-payment"

echo "Done"
