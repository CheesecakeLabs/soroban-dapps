
USER_PK="$1"
USER_SK="$2"
SHARE_AMOUNT="$3"
MIN_A="$4"
MIN_B="$5"

CONTRACT_ID=${AMM_CONTRACT_ID}
FUNCTION_NAME="withdraw"
INVOKER_SK=${USER_SK}
ARGS="--to ${USER_PK} --share_amount ${SHARE_AMOUNT} --min_a ${MIN_A} --min_b ${MIN_B}"


./helpers/invoke.sh \
        ${CONTRACT_ID} \
        ${FUNCTION_NAME} \
        ${INVOKER_SK} \
        $ARGS






