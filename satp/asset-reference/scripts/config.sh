# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)



#admin
export ADMIN_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the account that administrates the CoD contract
export ADMIN_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the account that administrates the CoD contract

#Hub Contract
export SATP_REF_CONTRACT_WASM="../../../target/wasm32-unknown-unknown/release/satp_asset_reference.wasm"
export SATP_REF_DEPLOY_OUTPUT_FILE="satp_ref-deploy"
export SATP_REF_CONTRACT_ID=$(<"./data/${SATP_REF_DEPLOY_OUTPUT_FILE}-out")