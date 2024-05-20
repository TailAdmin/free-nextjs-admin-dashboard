#!/bin/bash

rm -rf openapi-client
curl -H "Accept: application/json" http://localhost:2601/q/openapi > api.json
npx @openapitools/openapi-generator-cli generate -i api.json -g typescript-fetch -o ./openapi-client --additional-properties=usePromises=true

rm -f api.json
