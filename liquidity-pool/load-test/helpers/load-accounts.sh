#!/bin/bash

AMOUNT=${LOAD_AMOUNT}
N_OF_USERS=$TOTAL_ACCOUNTS


INVOKER_SK=${A_ADMIN_SK}
CONTRACT_ID=$(<"${DATA_DIR}/${A_DEPLOY_OUTPUT_FILE}-out")

echo -e "\n Minting $((AMOUNT * N_OF_USERS)) units of Token A"
FUNCTION_NAME="mint"
ARGS="--to ${A_ADMIN_PK} --amount $((AMOUNT * N_OF_USERS))"

./helpers/invoke.sh \
${CONTRACT_ID} \
${FUNCTION_NAME} \
${INVOKER_SK} \
$ARGS

for file in "${DATA_DIR}/.accounts"/*"-address"
do
    user=$(<"${file}")
    FUNCTION_NAME="transfer"
    ARGS="--from ${A_ADMIN_PK} --to ${user} --amount ${AMOUNT}"

    fail=true
    while [ $fail == true ];  
    do
        echo -e "\n Sending ${AMOUNT} units of Token A to ${user}"
        result=$(soroban contract invoke \
        --id ${CONTRACT_ID} \
        --source ${INVOKER_SK} \
        --network ${NETWORK_NAME} \
        --fee ${DEFAULT_FEE} \
        -- \
        "${FUNCTION_NAME}" \
        ${ARGS})
        if [ $? -eq 0 ]; then
            fail=false
        fi
        sleep 1
    done
done

INVOKER_SK=${B_ADMIN_SK}
CONTRACT_ID=$(<"${DATA_DIR}/${B_DEPLOY_OUTPUT_FILE}-out")
FUNCTION_NAME="mint"
ARGS="--to ${B_ADMIN_PK} --amount $((AMOUNT * N_OF_USERS))"

fail=true
while [ $fail == true ]; 
do
    echo -e "\n Minting $((AMOUNT * N_OF_USERS)) units of Token B"
    result=$(soroban contract invoke \
    --id ${CONTRACT_ID} \
    --source ${INVOKER_SK} \
    --network ${NETWORK_NAME} \
    --fee ${DEFAULT_FEE} \
    -- \
    "${FUNCTION_NAME}" \
    ${ARGS})
    if [ $? -eq 0 ]; then
        fail=false
    fi
    sleep 1
done


for file in "data/.accounts"/*"-address"
do
    user=$(<"${file}")
    FUNCTION_NAME="transfer"
    ARGS="--from ${A_ADMIN_PK} --to ${user} --amount ${AMOUNT}"

    fail=true
    while [ $fail == true ]; 
    do
        echo -e "\n Sending ${AMOUNT} units of Token B to ${user}"
        result=$(soroban contract invoke \
        --id ${CONTRACT_ID} \
        --source ${INVOKER_SK} \
        --network ${NETWORK_NAME} \
        --fee ${DEFAULT_FEE} \
        -- \
        "${FUNCTION_NAME}" \
        ${ARGS})
        if [ $? -eq 0 ]; then
            fail=false
        fi
        sleep 1
    done
done

echo -e "\n Finished!"


