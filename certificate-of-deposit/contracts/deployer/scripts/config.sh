# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)

#OTHER
export SALT=$((1 + RANDOM % 100))
export DEFAULT_DECIMAL=7
export FEE=$((10 * 10**DEFAULT_DECIMAL)) # Base fee in XLM 

#
# ACCOUNTS
#
# Important: The admin and user accounts must have a trustline created and active
# for the classic asset before running the scripts as the trustline is 
# not created automatically.
#
export DEP_ADMIN_PK="GCFKGTFT6I4ITPRUYGKF3CBUM6PA2V2NJFVUUG6MN5ZXYOHZKTKQ2OO6"  #The Public key of the account that administrates the CoD contract
export DEP_ADMIN_SK="SBW7LJ6MIIQ4XR6P7YIQU6QJIHYWJEF3PRMZMSUUBXUYS3IC6SS5GJT7"  #The Secret key of the account that administrates the CoD contract
export COD_ADMIN_PK="GDH5AOZUARF5ZVO2RYY6WKMNJBIFZJ553PKTR3U66MULGGOY7RIFFJUZ"   #The Public key of the account that represents a user
export COD_ADMIN_SK="SDWDDEYYZGMEBRDKFU37TY4DCVOAMAWE43PXXCJABJMJQP4D4URBN5U4"   #The Secret key of the account that represents a user

#DEPLOYER
export DEP_CONTRACT_WASM="../../../../target/wasm32-unknown-unknown/release/deployer.wasm"
export DEP_DEPLOY_OUTPUT_FILE="dep-deploy"
export DEP_CONTRACT_ID=$(<"./data/${DEP_DEPLOY_OUTPUT_FILE}-out")



#Certificates of deposit contract
export COD_CONTRACT_WASM="../../../../target/wasm32-unknown-unknown/release/certificates_of_deposit.wasm"
export COD_WASM_FILE="cod-wasm"
export COD_WASM_HASH=$(<"./data/${COD_WASM_FILE}-out")
export COD_DEPLOY_OUTPUT_FILE="cod-deploy"
export COD_CONTRACT_ID=$(<"./data/${COD_DEPLOY_OUTPUT_FILE}-out")


#CoD Rules
export COD_TERM="600"               #The term used in the contract in seconds
export COD_YIELD_RATE="150"         #The yield rate used in the contract. 1 unit = 0.01%
export COD_MIN_DEPOSIT="100"        #The minimum deposit amount accepted. 1 unit = 1 stroop
export COD_PENALTY_RATE="5000"      #The penalty rate used in the contract. 1 unit = 0.01%
export COD_COMPOUND_STEP="10"        #Compounds every x seconds or uses a flat rate if coumpound is 0

export COD_INITIAL_FUNDS=$((10000000 * 10**DEFAULT_DECIMAL))       #The initial funds minted and sent to the contract.
export USER_INITIAL_FUNDS=$((1000 * 10**DEFAULT_DECIMAL))          #The initial funds minted and sent to the user.

#Classic Asset
export ASSET_ISSUER_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the Issuer account that controls the classic asset
export ASSET_ISSUER_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the Issuer account that controls the classic asset
export ASSET_CODE="FIFO"                                                           #The Asset Code.                                         #The Asset Code.
export CLASSIC_ASSET="${ASSET_CODE}:${ASSET_ISSUER_PK}"                            #The asset identifier. 
export ASSET_DEPLOYER_SK=${ASSET_ISSUER_SK}
export ASSET_DEPLOY_OUTPUT_FILE="asset-deploy"
export ASSET_CONTRACT_ID=$(<"./data/${ASSET_DEPLOY_OUTPUT_FILE}-out")

