#!/bin/bash

source ./config.sh

DIRECTORY="../../../frontend/cod-demo-react/src/data/"
FILE_NAME="contract-data.json"

# Create JSON object
cat << EOF > "$DIRECTORY$FILE_NAME"
{
  "network_name": "$NETWORK_NAME",
  "asset": {
    "asset_code": "$ASSET_CODE",
    "asset_contract_id": "$ASSET_CONTRACT_ID",
    "asset_issuer_pk": "$ASSET_ISSUER_PK"
  },
  "cod": {
    "cod_contract_id": "$COD_CONTRACT_ID",
    "cod_term": $COD_TERM,
    "cod_yield_rate": $COD_YIELD_RATE,
    "cod_min_deposit": $COD_MIN_DEPOSIT,
    "cod_penalty_rate": $COD_PENALTY_RATE
  }
}
EOF

echo "JSON data generated successfully under $DIRECTORY$FILE_NAME"
