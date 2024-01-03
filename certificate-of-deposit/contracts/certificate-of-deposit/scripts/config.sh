# Environment Variables
export NETWORK_NAME="testnet" # Name of the Stellar network to deploy the contract (e.g., public, testnet, futurenet)

# OTHER
export DEFAULT_DECIMAL=7
export DEFAULT_FEE=$((100 * 10**DEFAULT_DECIMAL)) # Base fee in XLM 
export CURRENT_LEDGER_NUMBER=2621437


#
# ACCOUNTS
#
# Important: The admin and user accounts must have a trustline created and active
# for the classic asset before running the scripts as the trustline is 
# not created automatically.
#

#issuer
export ADMIN_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the account that administrates the CoD contract
export ADMIN_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the account that administrates the CoD contract

# export ADMIN_PK="GDH5AOZUARF5ZVO2RYY6WKMNJBIFZJ553PKTR3U66MULGGOY7RIFFJUZ"  #The Public key of the account that administrates the CoD contract
# export ADMIN_SK="SDWDDEYYZGMEBRDKFU37TY4DCVOAMAWE43PXXCJABJMJQP4D4URBN5U4"  #The Secret key of the account that administrates the CoD contract

export USER_PK="GDNG5OBGQFGWWG5UQXLFQLXOH5BA3GIXQO6YNZFDUFBYSHVUX7BUU6RT"   #The Public key of the account that represents a user
export USER_SK="SBBMN3QPHH7UYPHEPXXVTLAIYLOIPDGRNW65TTN2ANBWSLNW6NYH2OZW"   #The Secret key of the account that represents a user


#Certificates of deposit contract
export COD_CONTRACT_WASM="../../../../target/wasm32-unknown-unknown/release/certificates_of_deposit.wasm"
export COD_CONTRACT_WASM_OPTIMIZED="../../../../target/wasm32-unknown-unknown/release/certificates_of_deposit.optimized.wasm"
# export COD_CONTRACT_WASM="../../../../target/wasm32-unknown-unknown/release/certificates_of_deposit.optimized.wasm" # optmized
export COD_DEPLOYER_SK=${ADMIN_SK}
export COD_DEPLOY_OUTPUT_FILE="cod-deploy"
export COD_CONTRACT_ID=$(<"./data/${COD_DEPLOY_OUTPUT_FILE}-out")

#Classic Asset
# export ASSET_CODE="FIFO"                                                           #The Asset Code.
export ASSET_CODE="CAKE"                                                           #The Asset Code.
export ASSET_ISSUER_PK="GCL3QOGZXUN4OSP35ZR6MZHIZPFJNSCT2XPX227HFTDF7DE526FBDZV6"  #The Public key of the Issuer account that controls the classic asset
export ASSET_ISSUER_SK="SC7QP27MA524VRVSBOWQ3TKWAWR27WADFMKPIT4IFSXSKAYCTCBNCECZ"  #The Secret key of the Issuer account that controls the classic asset

export CLASSIC_ASSET="${ASSET_CODE}:${ASSET_ISSUER_PK}"                            #The asset identifier. 
export ASSET_DEPLOYER_SK=${ASSET_ISSUER_SK}
export ASSET_DEPLOY_OUTPUT_FILE="asset-deploy"
export ASSET_CONTRACT_ID=$(<"./data/${ASSET_DEPLOY_OUTPUT_FILE}-out")

#CoD Rules
export COD_TERM="432000" #600               #The term used in the contract in seconds
export COD_YIELD_RATE="5000"  #150       #The yield rate used in the contract. 1 unit = 0.01%
export COD_MIN_DEPOSIT="100"        #The minimum deposit amount accepted. 1 unit = 1 stroop
export COD_PENALTY_RATE="7000" #5000      #The penalty rate used in the contract. 1 unit = 0.01%
export COD_COMPOUND_STEP="0"        #Compounds every x seconds or uses a flat rate if coumpound is 0
export COD_ALLOWANCE_PERIOD=$((CURRENT_LEDGER_NUMBER + 535000))

export COD_INITIAL_FUNDS=$((10000000 * 10**DEFAULT_DECIMAL))       #The initial funds minted and sent to the contract.
export USER_INITIAL_FUNDS=$((1000 * 10**DEFAULT_DECIMAL))          #The initial funds minted and sent to the user.



