#!/bin/bash

set -e

NETWORK="$1"

# If soroban-cli is called inside the soroban-preview docker containter,
# it can call the stellar standalone container just using its name "stellar"
if [[ "$IS_USING_DOCKER" == "true" ]]; then
  SOROBAN_RPC_HOST="http://stellar:8000"
else
  SOROBAN_RPC_HOST="http://localhost:8000"
fi

SOROBAN_RPC_URL="$SOROBAN_RPC_HOST/soroban/rpc"

case "$1" in
standalone)
  echo "Using standalone network"
  SOROBAN_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
  FRIENDBOT_URL="$SOROBAN_RPC_HOST/friendbot"
  ;;
futurenet)
  echo "Using Futurenet network"
  SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
  FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"
  ;;
*)
  echo "Usage: $0 standalone|futurenet"
  exit 1
  ;;
esac

#if !(soroban config network ls | grep "$NETWORK" 2>&1 >/dev/null); then
# Always set a net configuration 
  echo Add the $NETWORK network to cli client
  soroban config network add "$NETWORK" \
    --rpc-url "$SOROBAN_RPC_URL" \
    --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE"
#fi

if !(soroban config identity ls | grep token-admin 2>&1 >/dev/null); then
  echo Create the token-admin identity
  soroban config identity generate token-admin
fi
TOKEN_ADMIN_SECRET="$(soroban config identity show token-admin)"
TOKEN_ADMIN_ADDRESS="$(soroban config identity address token-admin)"

# TODO: Remove this once we can use `soroban config identity` from webpack.
echo "$TOKEN_ADMIN_SECRET" > .soroban/token_admin_secret
echo "$TOKEN_ADMIN_ADDRESS" > .soroban/token_admin_address

# This will fail if the account already exists, but it'll still be fine.
echo Fund token-admin account from friendbot
curl --silent -X POST "$FRIENDBOT_URL?addr=$TOKEN_ADMIN_ADDRESS" >/dev/null

ARGS="--network $NETWORK --source token-admin"

echo Wrap the first Stellar asset 
mkdir -p .soroban

TOKEN_1_ID=$(soroban lab token wrap $ARGS --asset "USDC:$TOKEN_ADMIN_ADDRESS")
echo "Token wrapped succesfully with TOKEN_ID: $TOKEN_1_ID"

echo -n "$TOKEN_1_ID" > .soroban/token_1_id

echo Wrap the second Stellar asset 
mkdir -p .soroban
TOKEN_2_ID=$(soroban lab token wrap $ARGS --asset "BTC:$TOKEN_ADMIN_ADDRESS")
echo "Token wrapped succesfully with TOKEN_ID: $TOKEN_2_ID"

echo -n "$TOKEN_2_ID" > .soroban/token_2_id

echo Build the liquidity pool contract


echo Deploy the liquidity pool contract
LIQUIDITY_POOL_ID="$(
  soroban contract deploy $ARGS \
    --wasm target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm
)"
echo "$LIQUIDITY_POOL_ID" > .soroban/liquidity_pool_id

echo "Liquidity Pool contract deployed succesfully with ID: $LIQUIDITY_POOL_ID"

echo "Installing token wasm contract"
TOKEN_WASM_HASH="$(soroban contract install \
    $ARGS \
    --wasm liquidity_pool/token/soroban_token_contract.wasm 
)"
echo "$TOKEN_WASM_HASH" > .soroban/token_wasm_hash
echo "Token wasm hash installed succesfully with ID: $TOKEN_WASM_HASH"

echo "Initialize the liquidity pool contract"

soroban contract invoke \
  $ARGS \
  --wasm target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm \
  --id "$LIQUIDITY_POOL_ID" \
  -- \
  initialize \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_a "$TOKEN_1_ID" \
  --token_b "$TOKEN_2_ID"


echo "Getting the share id"
REACT_SHARE_ID="$(soroban contract invoke \
  $ARGS \
  --wasm target/wasm32-unknown-unknown/release/soroban_liquidity_pool_contract.wasm \
  --id "$LIQUIDITY_POOL_ID" \
  -- \
  share_id
)"
echo "$REACT_SHARE_ID" > .soroban/share_id
echo "Share ID: $REACT_SHARE_ID"


echo "Done"



