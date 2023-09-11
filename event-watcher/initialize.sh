#!/bin/bash

set -e

WASM_PATH="target/wasm32-unknown-unknown/release/"
LIQUIDITY_POOL_WASM=$WASM_PATH"soroban_liquidity_pool_contract.optimized.wasm"
ABUNDANCE_WASM=$WASM_PATH"abundance_token.optimized.wasm"
TOKEN_WASM="contracts/liquidity-pool/token/soroban_token_contract.wasm"

NETWORK="futurenet"
SOROBAN_RPC_HOST="https://rpc-futurenet.stellar.org:443"
SOROBAN_RPC_URL="$SOROBAN_RPC_HOST"
echo "Using Futurenet network with RPC URL: $SOROBAN_RPC_URL"
SOROBAN_NETWORK_PASSPHRASE="Test SDF Future Network ; October 2022"
FRIENDBOT_URL="https://friendbot-futurenet.stellar.org/"


echo Add the $NETWORK network to cli client
soroban config network add \
  --rpc-url "$SOROBAN_RPC_URL" \
  --network-passphrase "$SOROBAN_NETWORK_PASSPHRASE" "$NETWORK"

if !(soroban config identity ls | grep event-watcher-admin 2>&1 >/dev/null); then
  echo Create the event-watcher-admin identity
  soroban config identity generate event-watcher-admin
fi
ADMIN_SECRET="$(soroban config identity show event-watcher-admin)"
ADMIN_ADDRESS="$(soroban config identity address event-watcher-admin)"

mkdir -p .soroban

# This will fail if the account already exists, but it'll still be fine.
echo Fund event-watcher-admin account from friendbot
curl --silent -X POST "$FRIENDBOT_URL?addr=$ADMIN_ADDRESS" >/dev/null

ARGS="--network $NETWORK --source event-watcher-admin"


echo "Building contracts"
soroban contract build
echo "Optimizing contracts"
soroban contract optimize --wasm $WASM_PATH"soroban_liquidity_pool_contract.wasm"
soroban contract optimize --wasm $WASM_PATH"abundance_token.wasm"


echo Deploy the first liquidity pool contract
LIQUIDITY_POOL_1_ID="$(
  soroban contract deploy $ARGS \
    --wasm $LIQUIDITY_POOL_WASM
)"
echo "Liquidity Pool 1 contract deployed succesfully with ID: $LIQUIDITY_POOL_1_ID"

echo Deploy the second liquidity pool contract
LIQUIDITY_POOL_2_ID="$(
  soroban contract deploy $ARGS \
    --wasm $LIQUIDITY_POOL_WASM
)"
echo "Liquidity Pool 2 contract deployed succesfully with ID: $LIQUIDITY_POOL_2_ID"

echo Deploy the third liquidity pool contract
LIQUIDITY_POOL_3_ID="$(
  soroban contract deploy $ARGS \
    --wasm $LIQUIDITY_POOL_WASM
)"
echo "Liquidity Pool 3 contract deployed succesfully with ID: $LIQUIDITY_POOL_3_ID"

echo Deploy the abundance token A 1 contract
ABUNDANCE_A_1_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_A_1_ID"

echo Deploy the abundance token B 1 contract
ABUNDANCE_B_1_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_B_1_ID"

echo Deploy the abundance token A 2 contract
ABUNDANCE_A_2_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_A_2_ID"

echo Deploy the abundance token B 2 contract
ABUNDANCE_B_2_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_B_2_ID"

echo Deploy the abundance token A 3 contract
ABUNDANCE_A_3_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_A_3_ID"

echo Deploy the abundance token B 3 contract
ABUNDANCE_B_3_ID="$(
  soroban contract deploy $ARGS \
    --wasm $ABUNDANCE_WASM
)"
echo "Contract deployed succesfully with ID: $ABUNDANCE_B_3_ID"

if [[ "$ABUNDANCE_B_1_ID" < "$ABUNDANCE_A_1_ID" ]]; then
  echo Changing tokens order
  OLD_ABUNDANCE_A_ID=$ABUNDANCE_A_1_ID
  ABUNDANCE_A_1_ID=$ABUNDANCE_B_1_ID
  ABUNDANCE_B_1_ID=$OLD_ABUNDANCE_A_ID
fi

if [[ "$ABUNDANCE_B_2_ID" < "$ABUNDANCE_A_2_ID" ]]; then
  echo Changing tokens order
  OLD_ABUNDANCE_A_ID=$ABUNDANCE_A_2_ID
  ABUNDANCE_A_2_ID=$ABUNDANCE_B_2_ID
  ABUNDANCE_B_2_ID=$OLD_ABUNDANCE_A_ID
fi

if [[ "$ABUNDANCE_B_3_ID" < "$ABUNDANCE_A_3_ID" ]]; then
  echo Changing tokens order
  OLD_ABUNDANCE_A_ID=$ABUNDANCE_A_3_ID
  ABUNDANCE_A_3_ID=$ABUNDANCE_B_3_ID
  ABUNDANCE_B_3_ID=$OLD_ABUNDANCE_A_ID
fi


echo "Initialize the abundance token A 1 contract"
TOKEN_1_A_SYMBOL=USDC
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_A_1_ID" \
  -- \
  initialize \
  --symbol $TOKEN_1_A_SYMBOL \
  --decimal 7 \
  --name USDCoin \
  --admin "$ADMIN_ADDRESS"


echo "Initialize the abundance token B 1 contract"
TOKEN_1_B_SYMBOL=BTC
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_B_1_ID" \
  -- \
  initialize \
  --symbol $TOKEN_1_B_SYMBOL \
  --decimal 7 \
  --name Bitcoin \
  --admin "$ADMIN_ADDRESS"

echo "Initialize the abundance token A 2 contract"
TOKEN_2_A_SYMBOL=DAI
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_A_2_ID" \
  -- \
  initialize \
  --symbol $TOKEN_2_A_SYMBOL \
  --decimal 7 \
  --name Dai \
  --admin "$ADMIN_ADDRESS"


echo "Initialize the abundance token B 2 contract"
TOKEN_2_B_SYMBOL=BNB
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_B_2_ID" \
  -- \
  initialize \
  --symbol $TOKEN_2_B_SYMBOL \
  --decimal 7 \
  --name BinanceCoin \
  --admin "$ADMIN_ADDRESS"


echo "Initialize the abundance token A 3 contract"
TOKEN_3_A_SYMBOL=LTC
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_A_3_ID" \
  -- \
  initialize \
  --symbol $TOKEN_3_A_SYMBOL \
  --decimal 7 \
  --name LiteCoin \
  --admin "$ADMIN_ADDRESS"


echo "Initialize the abundance token B 3"
TOKEN_3_B_SYMBOL=EUROC
soroban contract invoke \
  $ARGS \
  --id "$ABUNDANCE_B_3_ID" \
  -- \
  initialize \
  --symbol $TOKEN_3_B_SYMBOL \
  --decimal 7 \
  --name EuroCoin \
  --admin "$ADMIN_ADDRESS"



echo "Installing token wasm contract"
TOKEN_WASM_HASH="$(soroban contract install \
    $ARGS \
    --wasm $TOKEN_WASM
)"


echo "Initialize the liquidity pool 1 contract"
soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_1_ID" \
  -- \
  initialize \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_a "$ABUNDANCE_A_1_ID" \
  --token_b "$ABUNDANCE_B_1_ID"


echo "Getting the share id 1"
SHARE_ID_1="$(soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_1_ID" \
  -- \
  share_id
)"
SHARE_ID_1=${SHARE_ID_1//\"/}
echo "Share ID 1: $SHARE_ID_1"

echo "Initialize the liquidity pool 2 contract"
soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_2_ID" \
  -- \
  initialize \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_a "$ABUNDANCE_A_2_ID" \
  --token_b "$ABUNDANCE_B_2_ID"

echo "Getting the share id 2"
SHARE_ID_2="$(soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_2_ID" \
  -- \
  share_id
)"
SHARE_ID_2=${SHARE_ID_2//\"/}
echo "Share ID 2: $SHARE_ID_2"

echo "Initialize the liquidity pool 3 contract"
soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_3_ID" \
  -- \
  initialize \
  --token_wasm_hash "$TOKEN_WASM_HASH" \
  --token_a "$ABUNDANCE_A_3_ID" \
  --token_b "$ABUNDANCE_B_3_ID"

echo "Getting the share id 3"
SHARE_ID_3="$(soroban contract invoke \
  $ARGS \
  --wasm $LIQUIDITY_POOL_WASM \
  --id "$LIQUIDITY_POOL_3_ID" \
  -- \
  share_id
)"
SHARE_ID_3=${SHARE_ID_3//\"/}
echo "Share ID 3: $SHARE_ID_3"

echo Creating envioriment to frontend
cp frontend/src/config/.env.example frontend/src/config/.env

echo Creating database
DB_FILE="backend/database.db"

sqlite3 "$DB_FILE" "CREATE TABLE IF NOT EXISTS token (
              id          INTEGER PRIMARY KEY,
              contract_id VARCHAR(60),
              symbol      VARCHAR(12),
              decimals    INTEGER,
              xlm_value   INTEGER,
              is_share    INTEGER DEFAULT 0
          );"

sqlite3 "$DB_FILE" "CREATE TABLE IF NOT EXISTS pool (
              id          INTEGER PRIMARY KEY,
              contract_id VARCHAR(60),
              contract_hash_id VARCHAR(64),
              name        VARCHAR(100),
              liquidity   INTEGER,
              volume      INTEGER,
              fees        INTEGER,
              token_a_id  INTEGER REFERENCES token(id),
              token_b_id  INTEGER REFERENCES token(id),
              token_share_id  INTEGER REFERENCES token(id),
              token_a_reserves INTEGER,
              token_b_reserves INTEGER
          );"

sqlite3 "$DB_FILE" "CREATE TABLE IF NOT EXISTS event (
                id INTEGER PRIMARY KEY,
                pool_id  INTEGER REFERENCES pool(id),
                type TEXT CHECK(type IN ('SWAP', 'WITHDRAW', 'DEPOSIT')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                amount_token_a INTEGER,
                amount_token_b INTEGER,
                reserves_a INTEGER,
                reserves_b INTEGER,
                buy_a BOOL,
                user INTEGER
            );"              

echo Cleaning data in database if exist

sqlite3 "$DB_FILE" "DELETE from event;"
sqlite3 "$DB_FILE" "DELETE from pool;"
sqlite3 "$DB_FILE" "DELETE from token;"

echo Creating data on database

# Insert data into the token table and get the inserted IDs
echo First pool
TOKEN_ID_1=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_A_1_ID', '$TOKEN_1_A_SYMBOL', 7, 2); SELECT last_insert_rowid();")

TOKEN_ID_2=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_B_1_ID', '$TOKEN_1_B_SYMBOL', 7, 5); SELECT last_insert_rowid();")

TOKEN_SHARE_ID=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value, is_share) VALUES ('$SHARE_ID_1', 'POOL', 7, 0, 1); SELECT last_insert_rowid();")

POOL_HASH_ID=$(curl -s "https://rpciege.com/convert/$LIQUIDITY_POOL_1_ID")

sqlite3 "$DB_FILE" "INSERT INTO pool (contract_id, contract_hash_id, name, liquidity, volume, fees, token_a_id, token_b_id, token_share_id, token_a_reserves, token_b_reserves) VALUES ('$LIQUIDITY_POOL_1_ID', '$POOL_HASH_ID', '${TOKEN_1_A_SYMBOL}-${TOKEN_1_B_SYMBOL}', 0, 0, 0, $TOKEN_ID_1, $TOKEN_ID_2,  $TOKEN_SHARE_ID, 0, 0);"

echo Second pool
TOKEN_ID_1=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_A_2_ID', '$TOKEN_2_A_SYMBOL', 7, 3); SELECT last_insert_rowid();")

TOKEN_ID_2=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_B_2_ID', '$TOKEN_2_B_SYMBOL', 7, 1); SELECT last_insert_rowid();")

TOKEN_SHARE_ID=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value, is_share) VALUES ('$SHARE_ID_2', 'POOL', 7, 0, 1); SELECT last_insert_rowid();")

POOL_HASH_ID=$(curl -s "https://rpciege.com/convert/$LIQUIDITY_POOL_2_ID")


sqlite3 "$DB_FILE" "INSERT INTO pool (contract_id, contract_hash_id, name, liquidity, volume, fees, token_a_id, token_b_id, token_share_id, token_a_reserves, token_b_reserves) VALUES ('$LIQUIDITY_POOL_2_ID', '$POOL_HASH_ID', '${TOKEN_2_A_SYMBOL}-${TOKEN_2_B_SYMBOL}', 0, 0, 0, $TOKEN_ID_1, $TOKEN_ID_2, $TOKEN_SHARE_ID, 0, 0);"


echo Third pool
TOKEN_ID_1=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_A_3_ID', '$TOKEN_3_A_SYMBOL', 7, 4); SELECT last_insert_rowid();")

TOKEN_ID_2=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value) VALUES ('$ABUNDANCE_B_3_ID', '$TOKEN_3_B_SYMBOL', 7, 7); SELECT last_insert_rowid();")

TOKEN_SHARE_ID=$(sqlite3 "$DB_FILE" "INSERT INTO token (contract_id, symbol, decimals, xlm_value, is_share) VALUES ('$SHARE_ID_3', 'POOL', 7, 0, 1); SELECT last_insert_rowid();")

POOL_HASH_ID=$(curl -s "https://rpciege.com/convert/$LIQUIDITY_POOL_3_ID")

sqlite3 "$DB_FILE" "INSERT INTO pool (contract_id, contract_hash_id, name, liquidity, volume, fees, token_a_id, token_b_id, token_share_id, token_a_reserves, token_b_reserves) VALUES ('$LIQUIDITY_POOL_3_ID', '$POOL_HASH_ID', '${TOKEN_3_A_SYMBOL}-${TOKEN_3_B_SYMBOL}', 0, 0, 0, $TOKEN_ID_1, $TOKEN_ID_2, $TOKEN_SHARE_ID, 0, 0);"

echo "Done"

