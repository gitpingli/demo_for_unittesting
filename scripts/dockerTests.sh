#!/bin/sh

# Runs inside the Docker container to run the tests and generate the coverage
# report

# https://github.com/koalaman/shellcheck/wiki/SC1090
# shellcheck source=/dev/null
#. /opt/npm/.envrc

# export PATH=$PATH:/opt/npm/node_modules/.bin

START=$(date +%s)

echo "NodeJS version:"
node -v
echo "NPM version:"
npm -v
echo "Yarn version:"
yarn -v

# This is the jest test command used to run the tests and output the coverage reports.
#jest --coverage --coverageDirectory=/opt/npm/coverage
npx sequelize db:migrate:undo:all
npx sequelize db:migrate

npx nyc --report-dir ./coverage -r json-summary -r json -r cobertura npm test

RETURN_CODE=$?

END=$(date +%s)

RUNTIME=$((END-START))

printf 'Test time taken: %dh %dm %ds\n' $((RUNTIME/3600)) $((RUNTIME%3600/60)) $((RUNTIME%60))

echo "Return code: $RETURN_CODE"

exit $RETURN_CODE
