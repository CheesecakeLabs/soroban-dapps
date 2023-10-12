#!/bin/bash

source ./config.sh
export DATA_DIR="./data"

CONTRACT_ID=$(<"${DATA_DIR}/${COD_DEPLOY_OUTPUT_FILE}-out")
INVOKER_SK=""

ACTOR=$1
shift 

ACTION=$1
shift

FUNCTION_NAME=""
ARGS=""

if [[ "$ACTOR" == "user" ]]; then
  INVOKER_SK=${USER_SK}

  if [[ "$ACTION" == "d" ]]; then
  FUNCTION_NAME="deposit"
  AMOUNT=$1
  ARGS="--amount ${AMOUNT} --address ${USER_PK}"


  elif [[ "$ACTION" == "w" ]]; then
  FUNCTION_NAME="withdraw"
  PREMATURE=${1:"false"}
  
  
  if [[ "$PREMATURE" == "true" ]];then
    PREMATURE="--accept_premature_withdraw"
  # else
    # PREMATURE=""
  fi
  
  ARGS="--address ${USER_PK} ${PREMATURE}"

  elif [[ "$ACTION" == "get" ]]; then
    GET=${1:-pos}
    ARGS="--address ${USER_PK}"
    case "$GET" in
      "pos")
        FUNCTION_NAME="get_position"
          ;;
      "yield")
          FUNCTION_NAME="get_estimated_yield"
          ;;
      "premature")
          FUNCTION_NAME="get_estimated_premature_withdraw"
          ;;
      "time")
          FUNCTION_NAME="get_time_left"
          ;;
      *)
     esac

  fi
 
elif [[ "$ACTOR" == "admin" ]]; then
  INVOKER_SK=${ADMIN_SK}
  
  if [[ "$ACTION" == "w" ]]; then
    FUNCTION_NAME="admin_withdraw"
    AMOUNT=$1
    ADDRESS=$2
    ARGS="--amount ${AMOUNT} --address ${ADDRESS}"
  fi

elif [[ "$ACTOR" == "asset" ]]; then
  INVOKER_SK=${ASSET_ISSUER_SK}
  CONTRACT_ID=$(<"${DATA_DIR}/${ASSET_DEPLOY_OUTPUT_FILE}-out")

  if [[ "$ACTION" == "m" ]]; then
    FUNCTION_NAME="mint"
    TO=$1
    AMOUNT=$2
    case "$TO" in
      "cod")
        TO="${COD_CONTRACT_ID}"
          ;;
      "user")
          TO="${USER_PK}"
          ;;
      *)
     esac


    ARGS="--to ${TO} --amount ${AMOUNT}"
  fi
  

elif [[ "$ACTOR" == "auth" ]]; then
  INVOKER_SK=${ASSET_ISSUER_SK}
  CONTRACT_ID=$(<"${DATA_DIR}/${ASSET_DEPLOY_OUTPUT_FILE}-out")

    FUNCTION_NAME="authorized"
    ADDRESS=${ADMIN_PK}
    

    ARGS="--id ${ADDRESS}"
  
  


elif [[ "$ACTOR" == "allow" ]]; then
  INVOKER_SK=${ADMIN_SK}
  CONTRACT_ID=$(<"${DATA_DIR}/${ASSET_DEPLOY_OUTPUT_FILE}-out")

    FUNCTION_NAME="approve"
    FROM=${ADMIN_PK}
    SPENDER=${COD_CONTRACT_ID}
    AMOUNT=200
    EXPIRATION=2000000

    

    ARGS="--from ${FROM} --spender ${SPENDER} --amount ${AMOUNT} --expiration_ledger ${EXPIRATION}"
  
  
fi

./helpers/invoke.sh \
${CONTRACT_ID} \
${FUNCTION_NAME} \
${INVOKER_SK} \
${ARGS}