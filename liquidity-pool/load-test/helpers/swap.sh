
USER_PK="$1"
USER_SK="$2"
AMOUNT="$3"
BUY_A="$4"
IN_MAX="$5"

buy_a_arg=""

if [ "$BUY_A" ]; then
    buy_a_arg="--buy_a "
fi

CONTRACT_ID=${AMM_CONTRACT_ID}
FUNCTION_NAME="swap"
INVOKER_SK=${USER_SK}
ARGS="--to ${USER_PK} ${buy_a_arg} --out ${AMOUNT} --in_max ${IN_MAX}"


./helpers/invoke.sh \
        ${CONTRACT_ID} \
        ${FUNCTION_NAME} \
        ${INVOKER_SK} \
        $ARGS






