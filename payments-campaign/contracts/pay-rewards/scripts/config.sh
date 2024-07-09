# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)



#admin
export ADMIN_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the account that administrates the CoD contract
export ADMIN_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the account that administrates the CoD contract

#Hub Contract
export PR_CONTRACT_WASM="../../../target/wasm32-unknown-unknown/release/pay_rewards.wasm"
export PR_DEPLOY_OUTPUT_FILE="pr-deploy"
export PR_CONTRACT_ID=$(<"./data/${PR_DEPLOY_OUTPUT_FILE}-out")


export PR_ASSET="CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA"
export END_TIME=20000
export REWARD=5
export AMOUNT_REQUIRED=10
export START_NOW=false
