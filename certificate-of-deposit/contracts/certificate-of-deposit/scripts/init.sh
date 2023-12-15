#load variables
source ./config.sh

export DATA_DIR="./data"

STYLE='\e[1;37;44m'
STYLE2='\e[1;32m'
NS='\033[0m' # No Color

# for i in $(seq 1 50)
# do
#Wrap Classic Asset
echo -e "\n ${STYLE}WRAPPING ASSET TOKEN...${NS}"
./helpers/asset-wrap.sh
# ./helpers/asset-get.sh

echo -e "\n ${STYLE}Optimizing cod contract...${NS}"
soroban contract optimize --wasm ${COD_CONTRACT_WASM}" "

#Deploys the Certificates of deposit contract
echo -e "\n ${STYLE}DEPLOYING CERTIFICATES OF DEPOSIT CONTRACT...${NS}"
./helpers/deploy.sh ${COD_CONTRACT_WASM_OPTIMIZED} ${COD_DEPLOYER_SK} ${COD_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}zZzZzZzZzZzZzZz...${NS}"
# sleep 10

#Initialize the Certificates of Deposit contract
echo -e "\n ${STYLE}INITIALIZING CERTIFICATES OF DEPOSIT CONTRACT...${NS}"
./helpers/invoke-init.sh ${COD_CONTRACT_WASM_OPTIMIZED} ${COD_DEPLOYER_SK} ${COD_DEPLOY_OUTPUT_FILE}


#reloads the variable as the new id has just been written into the file
COD_CONTRACT_ID=$(<"./data/${COD_DEPLOY_OUTPUT_FILE}-out")

#Mint tokens to contract admin
echo -e "\n ${STYLE}MINTING TOKENS TO CERTIFICATES CONTRACT...${NS}"
./helpers/invoke-asset-mint.sh ${ADMIN_PK} ${COD_INITIAL_FUNDS}

#Mint tokens to user
echo -e "\n ${STYLE}MINTING TOKENS TO USER...${NS}"
./helpers/invoke-asset-mint.sh ${USER_PK} ${USER_INITIAL_FUNDS}


echo -e "\n ${STYLE}INITIALIZATION COMPLETE${NS}"

echo -e "\n ${STYLE2}Finished loop ${i} ${NS}"

# done