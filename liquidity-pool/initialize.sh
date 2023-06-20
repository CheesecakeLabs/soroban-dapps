#!/bin/bash

set -e

LIQUIDITY_POOL_WASM="contracts/target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm"

TOKEN_WASM="contracts/token/soroban_token_contract.wasm"


NETWORK="$1"

SOROBAN_RPC_HOST="$2"


if [[ "$SOROBAN_RPC_HOST" == "" ]]; then
  # If soroban-cli is called inside the soroban-preview docker container,
  # it can call the stellar standalone container just using its name "stellar"
  if [[ "$IS_USING_DOCKER" == "true" ]]; then
    SOROBAN_RPC_HOST="http://stellar:8000"
  elif [[ "$NETWORK" == "futurenet" ]]; then
    SOROBAN_RPC_HOST="https://rpc-futurenet.stellar.org:443"
  else
    SOROBAN_RPC_HOST="http://localhost:8000"
  fi
fi

SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"

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

# TODO: Remove this once we can use `soroban config identity` from webpack.
echo "$TOKEN_ADMIN_SECRET" > .soroban/token_admin_secret
echo "$TOKEN_ADMIN_ADDRESS" > .soroban/token_admin_address

# This will fail if the account already exists, but it'll still be fine.
echo Fund token-admin account from friendbot
curl --silent -X POST "$FRIENDBOT_URL?addr=$TOKEN_ADMIN_ADDRESS" >/dev/null

ARGS="--network $NETWORK --source token-admin"

echo Wrap the first Stellar asset 
TOKEN_A_ID=$(soroban lab token wrap $ARGS --asset "USDC:$TOKEN_ADMIN_ADDRESS")
echo "Token wrapped succesfully with TOKEN_ID: $TOKEN_A_ID"

echo Wrap the second Stellar asset 
TOKEN_B_ID=$(soroban lab token wrap $ARGS --asset "BTC:$TOKEN_ADMIN_ADDRESS")
echo "Token wrapped succesfully with TOKEN_ID: $TOKEN_B_ID"


if [[ "$TOKEN_B_ID" < "$TOKEN_A_ID" ]]; then
  OLD_TOKEN_A_ID=$TOKEN_A_ID
  TOKEN_A_ID=$TOKEN_B_ID
  TOKEN_B_ID=$OLD_TOKEN_A_ID
fi

echo -n "$TOKEN_B_ID" > .soroban/token_B_id
echo -n "$TOKEN_A_ID" > .soroban/token_A_id


echo Build the liquidity pool contract

echo Deploy the liquidity pool contract
LIQUIDITY_POOL_ID="$(
  soroban contract deploy $ARGS \
    --wasm $LIQUIDITY_POOL_WASM
)"
echo "$LIQUIDITY_POOL_ID" > .soroban/liquidity_pool_id

echo "Liquidity Pool contract deployed succesfully with ID: $LIQUIDITY_POOL_ID"

echo "Installing token wasm contract"
TOKEN_WASM_HASH="$(soroban contract install \
    $ARGS \
    --wasm $TOKEN_WASM
)"
echo "$TOKEN_WASM_HASH" > .soroban/token_wasm_hash
echo "Token wasm hash installed succesfully with ID: $TOKEN_WASM_HASH"

echo "Initialize the liquidity pool contract"
soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_ID" \
  -- \
  initialize \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_a "$TOKEN_A_ID" \
  --token_b "$TOKEN_B_ID"


echo "Getting the share id"
REACT_SHARE_ID="$(soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_ID" \
  -- \
  share_id
)"
echo "$REACT_SHARE_ID" > .soroban/share_id
echo "Share ID: $REACT_SHARE_ID"


# Collect data from .soroban folder into .env file
ENV_FILE="frontend/src/config/.env.local"
echo "Generating .env file"

echo "REACT_APP_TOKEN_A_ADMIN_ADDRESS=$(cat .soroban/token_admin_address)" >> $ENV_FILE
echo "REACT_APP_TOKEN_B_ADMIN_ADDRESS=$(cat .soroban/token_admin_address)" >> $ENV_FILE
echo "REACT_APP_TOKEN_A_ADMIN_SECRET=$(cat .soroban/token_admin_secret)" >> $ENV_FILE
echo "REACT_APP_TOKEN_B_ADMIN_SECRET=$(cat .soroban/token_admin_secret)" >> $ENV_FILE
echo "REACT_APP_TOKEN_A_ID=$(cat .soroban/token_A_id)" >> $ENV_FILE
echo "REACT_APP_TOKEN_B_ID=$(cat .soroban/token_B_id)" >> $ENV_FILE
echo "REACT_APP_LIQUIDITY_POOL_ID=$(cat .soroban/liquidity_pool_id)" >> $ENV_FILE
echo "REACT_APP_TOKEN_SHARE_ID=$(cat .soroban/share_id)" >> $ENV_FILE

echo "Done"