#!/bin/bash

echo -e "\n ${STYLE} DEPOSITING LIQUIDITY...${NS}"

INVOKER_SK=""
CONTRACT_ID=${AMM_CONTRACT_ID}

for file in "${DATA_DIR}/.accounts"/*"-address"
do
    USER_PK=$(<"${file}")
    USER_SK=$(<"${file%-address}-secret")

    echo -e "\n Depositing ${DEPOSIT_AMOUNT} units of from account $USER_PK"

    source helpers/amm/deposit.sh ${USER_SK} \
        ${USER_PK} \
        ${DEPOSIT_AMOUNT} \
        1 \
        ${DEPOSIT_AMOUNT} \
        1 &

done
wait

echo -e "\n ${STYLE} TRIGGERING SWAPS...${NS}"

declare -i swaps_executed=1
declare -i total_swaps=${TOTAL_SWAPS}

while [ ${swaps_executed} -le ${total_swaps} ]
do

    for file in "${DATA_DIR}/.accounts"/*"-address"
    do
        USER_PK=$(<"${file}")
        INVOKER_SK=$(<"${file%-address}-secret")

        echo -e "\n  PARALLEL for\n"
        swap_amount=$(( RANDOM % (SWAP_MAX_AMOUNT - SWAP_MIN_AMOUNT + 1) + SWAP_MIN_AMOUNT ))

        echo -e "\n  Swap n-${swaps_executed} -> ${USER_PK} is swapping ${swap_amount} units... \n"
        
        source helpers/swap.sh "$USER_PK" "$INVOKER_SK" "$swap_amount" true 9999999999999999 true &
        ((swaps_executed++))
        if [[ ${swaps_executed} == ${total_swaps} ]]
        then
            wait
            echo -e "\n  swaps_executed: ${swaps_executed} -> total_swaps ${total_swaps} \n"
            INVOKER_SK=${ADMIN_SK}
            FUNCTION_NAME="get_rsrvs"
            source helpers/invoke.sh \
                ${CONTRACT_ID} \
                ${FUNCTION_NAME} \
                ${INVOKER_SK}
            break
        fi
    done
    wait
    INVOKER_SK=${ADMIN_SK}
    FUNCTION_NAME="get_rsrvs"
    source helpers/invoke.sh \
        ${CONTRACT_ID} \
        ${FUNCTION_NAME} \
        ${INVOKER_SK}
done

for file in "data/.accounts"/*"-address"
do
    USER_PK=$(<"${file}")
    USER_SK=$(<"${file%-address}-secret")

    echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user A"
    source helpers/withdraw.sh "$USER_PK" "$USER_SK" "$SHARE_AMOUNT" 10000000 10000000 &
done
wait

echo -e "\n ${STYLE} CHECKING POOL RESERVES...${NS}"

INVOKER_SK=${ADMIN_SK}
FUNCTION_NAME="get_rsrvs"
source helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK}

echo -e "\n Finished"
