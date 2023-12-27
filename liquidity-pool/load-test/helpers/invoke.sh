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
echo "NETWORK: ${NETWORK_NAME}"
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
start_time_formated=$(date +%H:%M:%S)
OUTPUT="SUCCESS"
INVOKE_LOG_ERROR_FILE="error-log"
OUTPUT_ERROR_MSG=""

# Invoke the Contract  
result=$(soroban contract invoke \
  --id ${CONTRACT_ID} \
  --source ${INVOKER_SK} \
  --network ${NETWORK_NAME} \
  --fee ${DEFAULT_FEE} \
  -- \
  "${FUNCTION_NAME}" \
  ${ARGS} 2> >(cat))

if [ $? -eq 1 ]; then
  echo "Contract: ${FUNCTION_NAME} fail"
  # if [[ $result =~ "error: transaction" ]]; then
  #   result=$(echo "$result" | grep -o "error: transaction.*")
  # fi
  OUTPUT="ERROR"
fi

echo "Results: ${result}"
if [ $FUNCTION_NAME = "get_rsrvs" ]  || [ $FUNCTION_NAME = "withdraw" ]; then
  result="${result//,/;}"
fi

echo -e "Contract: ${FUNCTION_NAME} invocation completed."
if [ "$LOG_TIME" ]; then
  end_time=$(date +%s)
  elapsed_time=$((end_time - start_time))
  echo -e "Elapsed Time ${elapsed_time} seconds \n"
fi

if [ "$WRITE_TO_LOG_FILE" ]; then
  end_time_formated=$(date +%H:%M:%S)
  echo "${CONTRACT_ID},${FUNCTION_NAME},${INVOKER_SK},${elapsed_time},${ARGS},${OUTPUT},${result},${start_time_formated},${end_time_formated},${OUTPUT_ERROR_MSG}" >> ${DATA_DIR}/${INVOKE_LOG_OUTPUT_FILE}
fi
