# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)



#admin
export ADMIN_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the account that administrates the CoD contract
export ADMIN_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the account that administrates the CoD contract

#Hub Contract
export GH_CONTRACT_WASM="../../target/wasm32-unknown-unknown/release/governance_hub.wasm"
export GH_DEPLOY_OUTPUT_FILE="cod-deploy"
export GH_CONTRACT_ID=$(<"./data/${GH_DEPLOY_OUTPUT_FILE}-out")