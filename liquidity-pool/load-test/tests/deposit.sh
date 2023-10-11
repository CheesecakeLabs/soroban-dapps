#!/bin/bash

echo -e "\n ${STYLE} TEST DEPOSITING LIQUIDITY...${NS}"

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
echo -e "\n Finished"
