source ./config.sh

STYLE='\033[1;37;44m' 
NS='\033[0m' # No Color


echo -e "\n ${STYLE}BUILDING CONTRACTS...${NS}"
cd ..
soroban contract build
cd scripts

echo -e "\n ${STYLE}OPTIMIZING CONTRACTS...${NS}"
soroban contract optimize --wasm ${AMM_WASM_RAW}
soroban contract optimize --wasm ${ASSET_WASM_RAW}

echo -e "\n ${STYLE}DEPLOYING ASSET A CONTRACT...${NS}"
./helpers/deploy.sh ${ASSET_WASM} ${A_DEPLOYER_ACCOUNT_SK} ${A_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING ASSET A CONTRACT...${NS}"
./helpers/initialize-asset.sh ${A_DEPLOY_OUTPUT_FILE} ${A_ADMIN_PK} ${A_ADMIN_SK} ${A_SYMBOL} ${A_DECIMAL} ${A_NAME}


echo -e "\n ${STYLE}DEPLOYING ASSET B CONTRACT...${NS}"
./helpers/deploy.sh ${ASSET_WASM} ${B_DEPLOYER_ACCOUNT_SK} ${B_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING ASSET B CONTRACT...${NS}"
./helpers/initialize-asset.sh ${B_DEPLOY_OUTPUT_FILE} ${B_ADMIN_PK} ${B_ADMIN_SK} ${B_SYMBOL} ${B_DECIMAL} ${B_NAME}


echo -e "\n ${STYLE}DEPLOYING AMM CONTRACT...${NS}"
./helpers/deploy.sh ${AMM_WASM} ${AMM_DEPLOYER_ACCOUNT_SK} ${AMM_DEPLOY_OUTPUT_FILE}

echo -e "\n ${STYLE}INITIALIZING AMM CONTRACT...${NS}"
./helpers/initialize-amm.sh


