#!/bin/bash

echo -e "\n ${STYLE} TEST DEPOSITING LIQUIDITY...${NS}"

INVOKER_SK=""
CONTRACT_ID=${AMM_CONTRACT_ID}

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user A"
source helpers/withdraw.sh "$USER_A_PK" "$USER_A_SK" "$SHARE_AMOUNT" 10000000 10000000 &

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user B"
source helpers/withdraw.sh "$USER_B_PK" "$USER_B_SK" "$SHARE_AMOUNT" 10000000 10000000 &

echo -e "\n Withdraw ${SHARE_AMOUNT} units of from user C"
source helpers/withdraw.sh "$USER_C_PK" "$USER_C_SK" "$SHARE_AMOUNT" 10000000 10000000 &

wait
echo -e "\n Finished"
