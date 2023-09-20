#!/bin/bash

source ./config.sh
export DATA_DIR="./data"

export MAIN_HELP='\033[1;37;44m'
export TITLE_STYLE='\e[1;33;40m'
export SUBTITLE_STYLE='\e[1;36;40m'

export HELP_STYLE='\e[1;32;40m' # Bold green text on a black background
export STYLE='\033[1;37;44m' 
export NS='\033[0m' # No Color


# if [ "$WRITE_TO_LOG_FILE" ]; then
#   echo "CONTRACT ID,FUNCTION NAME,INVOKER SK,ELAPSED TIME(seconds),ARGS,OUTPUT" > ${DATA_DIR}/${INVOKE_LOG_OUTPUT_FILE}
# fi


ACTION=$1
case "$ACTION" in
  load)
    ./helpers/load-accounts.sh "$@"
    ;;
  test)
    ./helpers/test.sh
    shift
    # ./helpers/admin-actions.sh "$@"
    ;;
  
  *)
    echo "Error: Invalid Action: $ACTION" >&2 # Print to stderr
    exit 1 # Exit the script
    ;;
esac


