#! /bin/bash

source .env.types

npx typeorm-model-generator -h $DB_HOST -d $DB_NAME -u $DB_USER -x $DB_PASSWORD -e postgres -o ./lib/services/db -s public