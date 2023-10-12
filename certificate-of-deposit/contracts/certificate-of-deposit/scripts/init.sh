#load variables
source ./config.sh

export DATA_DIR="./data"

STYLE='\e[1;37;44m'
NS='\033[0m' # No Color

#Wrap Classic Asset
echo -e "\n ${STYLE}WRAPPING ASSET TOKEN...${NS}"
./helpers/asset-wrap.sh
# ./helpers/asset-get.sh

#Deploys the Certificates of deposit contract
echo -e "\n ${STYLE}DEPLOYING CERTIFICATES OF DEPOSIT CONTRACT...${NS}"
./helpers/deploy.sh ${COD_CONTRACT_WASM} ${COD_DEPLOYER_SK} ${COD_DEPLOY_OUTPUT_FILE}


#Initialize the Certificates of Deposit contract
echo -e "\n ${STYLE}INITIALIZING CERTIFICATES OF DEPOSIT CONTRACT...${NS}"
./helpers/invoke-init.sh ${COD_CONTRACT_WASM} ${COD_DEPLOYER_SK} ${COD_DEPLOY_OUTPUT_FILE}

#reloads the variable as the new id has just been written into the file
COD_CONTRACT_ID=$(<"./data/${COD_DEPLOY_OUTPUT_FILE}-out")

#Mint tokens to contract admin
echo -e "\n ${STYLE}MINTING TOKENS TO CERTIFICATES CONTRACT...${NS}"
./helpers/invoke-asset-mint.sh ${ADMIN_PK} ${COD_INITIAL_FUNDS}

#Mint tokens to user
echo -e "\n ${STYLE}MINTING TOKENS TO USER...${NS}"
./helpers/invoke-asset-mint.sh ${USER_PK} ${USER_INITIAL_FUNDS}


echo -e "\n ${STYLE}INITIALIZATION COMPLETE${NS}"