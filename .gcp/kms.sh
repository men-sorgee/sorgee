#!/usr/bin/env bash
set -e

FILES=( "packages/server/config/staging.json" "packages/server/config/production.json" )

for FILE in "${FILES[@]}"
do
  gcloud kms $1 \
    --plaintext-file=$FILE \
    --ciphertext-file=$FILE.enc \
    --location=global \
    --keyring=my-project-keyring \
    --key=cloudbuild
done