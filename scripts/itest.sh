#!/bin/bash

STACKNAME=$(npx @cdk-turnkey/stackname@1.2.0)
APP_URL=https://$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "loadBalancerDnsName"))[0].OutputValue' | \
  tr -d \")
CANARY_PATH=ok
BACKEND_CANARY_URL=${APP_URL}/${CANARY_PATH}
CANARY_STATUS=$(curl --include ${BACKEND_CANARY_URL} | awk 'NR == 1 {print $2}')
EXPECTED_CANARY_STATUS="200"
if [[ "${CANARY_STATUS}" != "${EXPECTED_CANARY_STATUS}" ]]
then
  echo "expected status from ${BACKEND_CANARY_URL} to be ${EXPECTED_CANARY_STATUS}"
  echo "got:"
  echo "${CANARY_STATUS}"
  echo "failing"
  exit 1
fi
echo -n "got expected canary status of ${CANARY_STATUS} from ${BACKEND_CANARY_URL},"
echo " integration test successful"
