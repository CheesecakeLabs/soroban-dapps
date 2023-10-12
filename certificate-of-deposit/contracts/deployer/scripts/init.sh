#load variables
source ./config.sh

export DATA_DIR="./data"

STYLE='\e[1;37;44m'
NS='\033[0m' # No Color

#Wrap Classic Asset
echo -e "\n ${STYLE}WRAPPING ASSET TOKEN...${NS}"
./helpers/asset-wrap.sh

#Deploys the Certificates of deposit contract
echo -e "\n ${STYLE}DEPLOYING THE DEPLOYER CONTRACT...${NS}"
./helpers/deploy.sh ${DEP_CONTRACT_WASM} ${DEP_ADMIN_SK} ${DEP_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}STORE WASM HASH FOR COD...${NS}"
./helpers/soroban-install.sh ${COD_ADMIN_SK}
