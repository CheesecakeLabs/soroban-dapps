source ./config.sh
export DATA_DIR="./data"

STYLE='\e[1;37;44m'
STYLE2='\e[1;32m'
NS='\033[0m' # No Color

echo -e "\n ${STYLE}DEPLOYING CERTIFICATION HUB CONTRACT...${NS}"
./helpers/deploy.sh ${PR_CONTRACT_WASM} ${ADMIN_SK} ${PR_DEPLOY_OUTPUT_FILE}
