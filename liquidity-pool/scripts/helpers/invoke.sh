#!/bin/bash


# Get the function name and args from command-line arguments
CONTRACT_ID=$1
FUNCTION_NAME=$2
INVOKER_SK=$3
ARGS="${*:4}"

# Check if the directory exists and create it if it doesn't
mkdir -p ${DATA_DIR}

# Debug statements
echo "---------------------------------------"
echo "Invoking Contract with following Params"
echo "CONTRACT_ID: ${CONTRACT_ID}"
echo "INVOKER_SK: ${INVOKER_SK}"
echo "FUNCTION_NAME: ${FUNCTION_NAME}"
echo "ARGS: ${ARGS}"
echo "---------------------------------------"
# echo "Calculated Cost:"

# soroban contract invoke \
#   --id ${CONTRACT_ID} \
#   --source ${INVOKER_SK} \
#   --cost \
#   -- \
#   "${FUNCTION_NAME}" \
#   ${ARGS}

# echo "---------------------------------------"

start_time=$(date +%s)

# Invoke the Contract
output=$(soroban contract invoke \
  --id ${CONTRACT_ID} \
  --source ${INVOKER_SK} \
  --network ${NETWORK_NAME} \
  --fee ${DEFAULT_FEE} \
  -- \
  "${FUNCTION_NAME}" \
  ${ARGS})

end_time=$(date +%s)
elapsed_time=""

echo -e "Contract invocation completed."
if [ "$LOG_TIME" ]; then
    elapsed_time=$((end_time - start_time))
    echo -e "Elapsed Time ${elapsed_time} seconds \n"
fi


if [ "$WRITE_TO_LOG_FILE" ]; then
  echo "${CONTRACT_ID},${FUNCTION_NAME},${INVOKER_SK},${elapsed_time},${ARGS},${output}" >> ${DATA_DIR}/${INVOKE_LOG_OUTPUT_FILE}
fi