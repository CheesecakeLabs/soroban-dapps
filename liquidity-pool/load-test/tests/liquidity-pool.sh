#!/bin/bash

echo -e "\n ${STYLE} DEPOSITING LIQUIDITY...${NS}"

INVOKER_SK=""
CONTRACT_ID=${AMM_CONTRACT_ID}

echo -e "\n Depositing ${DEPOSIT_AMOUNT} units of from user A"

source helpers/amm/deposit.sh ${USER_A_SK} \
    ${USER_A_PK} \
    ${DEPOSIT_AMOUNT} \
    1 \
    ${DEPOSIT_AMOUNT} \
    1 &

echo -e "\n Depositing ${DEPOSIT_AMOUNT} units of from user B"

source helpers/amm/deposit.sh ${USER_B_SK} \
    ${USER_B_PK} \
    ${DEPOSIT_AMOUNT} \
    1 \
    ${DEPOSIT_AMOUNT} \
    1 &

echo -e "\n Depositing ${DEPOSIT_AMOUNT} units of from user C"

source helpers/amm/deposit.sh ${USER_C_SK} \
    ${USER_C_PK} \
    ${DEPOSIT_AMOUNT} \
    1 \
    ${DEPOSIT_AMOUNT} \
    1 &

wait

echo -e "\n ${STYLE} TRIGGERING SWAPS...${NS}"

declare -i swaps_executed=1
declare -i total_swaps=${TOTAL_SWAPS}
declare -i random_user=1

while [ ${swaps_executed} -le ${total_swaps} ]
do

    for ((i = 1; i <= ${PARALLEL_SWAPS}; i++))
    do
        echo -e "\n  PARALLEL for\n"
        swap_amount=$(( RANDOM % (SWAP_MAX_AMOUNT - SWAP_MIN_AMOUNT + 1) + SWAP_MIN_AMOUNT ))
        INVOKER_SK=""
        USER_PK=""

        if (( $random_user > 3 )); then
            random_user=1
        fi
        case $random_user in
        1)
            INVOKER_SK=${USER_A_SK}
            USER_PK=${USER_A_PK}
            ;;
        2)
            INVOKER_SK=${USER_B_SK}
            USER_PK=${USER_B_PK}
            ;;
        3)
            INVOKER_SK=${USER_C_SK}
            USER_PK=${USER_C_PK}
            ;;
        esac

        echo -e "\n  Swap n-${swaps_executed} -> ${USER_PK} is swapping ${swap_amount} units... \n"
        
        source helpers/swap.sh "$USER_PK" "$INVOKER_SK" "$swap_amount" true 9999999999999999 true &
        ((swaps_executed++))
        ((random_user++))
    done
    wait
done

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user A"
source helpers/withdraw.sh "$USER_A_PK" "$USER_A_SK" "$SHARE_AMOUNT" 10000000 10000000 &

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user B"
source helpers/withdraw.sh "$USER_B_PK" "$USER_B_SK" "$SHARE_AMOUNT" 10000000 10000000 &

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user C"
source helpers/withdraw.sh "$USER_C_PK" "$USER_C_SK" "$SHARE_AMOUNT" 10000000 10000000 &

wait

echo -e "\n ${STYLE} CHECKING POOL RESERVES...${NS}"

INVOKER_SK=${ADMIN_SK}
FUNCTION_NAME="get_rsrvs"
source helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK}

source helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK}

source helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK}    


echo -e "\n Finished"
