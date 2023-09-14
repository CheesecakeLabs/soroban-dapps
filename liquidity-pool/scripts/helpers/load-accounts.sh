

AMOUNT=${LOAD_AMOUNT}
N_OF_USERS=3


echo -e "\n ${STYLE}LOADING USER ACCOUNTS WITH TOKENS...${NS}"
INVOKER_SK=${A_ADMIN_SK}
CONTRACT_ID=${A_CONTRACT_ID}

echo -e "\n Minting $((AMOUNT * N_OF_USERS)) units of Token A"
FUNCTION_NAME="mint"
ARGS="--to ${A_ADMIN_PK} --amount $((AMOUNT * N_OF_USERS))"

./helpers/invoke.sh \
${CONTRACT_ID} \
${FUNCTION_NAME} \
${INVOKER_SK} \
$ARGS


for user in ${USER_A_PK} ${USER_B_PK} ${USER_C_PK}
do

    echo -e "\n Sending ${AMOUNT} units of Token A to ${user}"
    FUNCTION_NAME="transfer"
    ARGS="--from ${A_ADMIN_PK} --to ${user} --amount ${AMOUNT}"

    ./helpers/invoke.sh \
        ${CONTRACT_ID} \
        ${FUNCTION_NAME} \
        ${INVOKER_SK} \
        $ARGS

done


INVOKER_SK=${B_ADMIN_SK}
CONTRACT_ID=${B_CONTRACT_ID}

echo -e "\n Minting $((AMOUNT * N_OF_USERS)) units of Token B"
FUNCTION_NAME="mint"
ARGS="--to ${B_ADMIN_PK} --amount $((AMOUNT * N_OF_USERS))"

./helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK} \
    $ARGS


for user in ${USER_A_PK} ${USER_B_PK} ${USER_C_PK}
do

    echo -e "\n Sending ${AMOUNT} units of Token B to ${user}"
    FUNCTION_NAME="transfer"
    ARGS="--from ${A_ADMIN_PK} --to ${user} --amount ${AMOUNT}"

    ./helpers/invoke.sh \
        ${CONTRACT_ID} \
        ${FUNCTION_NAME} \
        ${INVOKER_SK} \
        $ARGS

done


# echo -e "\n Processing..."
# wait  
echo -e "\n Finished!"


