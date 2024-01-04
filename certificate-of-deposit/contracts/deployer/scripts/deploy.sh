#load variables
source ./config.sh

export DATA_DIR="./data"

STYLE='\e[1;37;44m'
NS='\033[0m' # No Color


#Deploys the Certificates of deposit contract
echo -e "\n ${STYLE}DEPLOYING THE CoD CONTRACT...${NS}"
./helpers/invoke-deploy.sh

echo -e "\n ${STYLE}FINISHED!${NS}"