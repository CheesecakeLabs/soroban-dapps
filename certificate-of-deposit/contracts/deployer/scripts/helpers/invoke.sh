#!/bin/bash


# Get the function name and args from command-line arguments
CONTRACT_ID=$1
FUNCTION_NAME=$2
INVOKER_SK=$3
ARGS="${*:4}"

# Debug statements
echo ""
echo "Invoking Contract with following Params"
echo "CONTRACT_ID: ${CONTRACT_ID}"
echo "INVOKER_SK: ${INVOKER_SK}"
echo "FUNCTION_NAME: ${FUNCTION_NAME}"
echo "ARGS: ${ARGS}"
echo ""

# Invoke the Contract
soroban contract invoke \
  --id ${CONTRACT_ID} \
  --source ${INVOKER_SK} \
  --network ${NETWORK_NAME} \
  --fee ${FEE} \
  -- \
  "${FUNCTION_NAME}" \
  ${ARGS}

echo -e "Contract invocation completed.\n"