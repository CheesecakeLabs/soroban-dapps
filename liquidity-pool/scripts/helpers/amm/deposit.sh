
INVOKER_SK=$1
TO=$2
DESIRED_A=$3
MIN_A=$4
DESIRED_B=$5 
MIN_B=$6

FUNCTION_NAME="deposit"
CONTRACT_ID=${AMM_CONTRACT_ID}

FUNCTION_NAME="deposit"
ARGS="--to ${TO} --desired_a ${DESIRED_A} --min_a ${MIN_A} --desired_b ${DESIRED_B} --min_b ${MIN_B}"

./helpers/invoke.sh \
    ${CONTRACT_ID} \
    ${FUNCTION_NAME} \
    ${INVOKER_SK} \
    $ARGS &