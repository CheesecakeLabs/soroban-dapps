#!/bin/bash

set -e
source config.sh

START=1
END=$TOTAL_ACCOUNTS

if [ -d "${DATA_DIR}/.accounts" ]; then
    rm -r "${DATA_DIR}/.accounts"
    echo "File '${DATA_DIR}/.accounts' has been removed."
else
    echo "File '${DATA_DIR}/.accounts' does not exist."
fi

mkdir -p ${DATA_DIR}/.accounts

for (( c=$START; c<=$TOTAL_ACCOUNTS; c++ ))
do
    account=''
    for i in {0..8}; do account+=$(printf "%x" $(($RANDOM%16)) ); done
    echo Create account identity: $account 
    soroban config identity generate $account

    ACCOUNT_SECRET="$(soroban config identity show $account)"
    ACCOUNT_ADDRESS="$(soroban config identity address $account)"

    echo "${ACCOUNT_SECRET}" > ${DATA_DIR}/.accounts/${account}-secret
    echo "${ACCOUNT_ADDRESS}" > ${DATA_DIR}/.accounts/${account}-address

    # Funds account
    echo Fund token-admin account from friendbot
    curl --silent -X POST "$FRIENDBOT_URL?addr=$ACCOUNT_ADDRESS" >/dev/null
done

