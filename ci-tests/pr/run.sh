#!/bin/bash

DOCKER_COMPOSE_COMMAND=${DOCKER_COMPOSE_COMMAND:='docker-compose'}
DOCKER_COMMAND=${DOCKER_COMMAND:='sudo docker'}

START=$(date +%s)

# Allows you to leave a .npmrc in your local working directory for Docker builds
# obviously you need to be careful not to commit this
if [[ -z "$NPM_TOKEN" && ! -f ../../.npmrc ]]; then
    echo -e "You must set your NPM token to the environment variable NPM_TOKEN"
    echo -e "export NPM_TOKEN=<TOKEN>"
    exit 1
fi

if [ ! -f ../../.npmrc  ]; then
    echo -e "//registry.npmjs.org/:_authToken=$NPM_TOKEN\n" > ../../.npmrc
fi

if [ -d coverage ]; then
    rm -rf coverage
fi

if [ -d coverage_temp ]; then
    rm -rf coverage_temp
fi

# Use coverage_temp and copy the results across at the end so when
# we use docker-compose to destroy volumes we don't lose our coverage
# output
mkdir coverage_temp && chmod 0770 coverage_temp

GIT_HASH=$(git log --pretty=format:'%h' -n 1)
# Overrides the project name (i.e. change it from the folder name 'docker')
# that we can run multiple tests at a time on the same slave
export COMPOSE_PROJECT_NAME=$GIT_HASH

echo -e '.git\nnode_modules' > ../../.dockerignore

# Doing this we ensure a user with the same UID/GID as our local user
# exists in the container, this will be the user the tests are run as
# and when the coverage report is output to coverage/ there shouldn't be
# any access issues.
# $UID and $GROUPS are BASH internal variable
# http://tldp.org/LDP/abs/html/internalvariables.html
if $DOCKER_COMPOSE_COMMAND -p "$GIT_HASH" build --pull --build-arg GID=$GROUPS --build-arg UID=$UID; then
    echo "Container built successfully, start tests"
    CURRENT_RUNTIME=$( (date +%s-START) )
    printf '\nTime taken so far: %dh %dm %ds\n\n' $((CURRENT_RUNTIME/3600)) $((CURRENT_RUNTIME%3600/60)) $((CURRENT_RUNTIME%60))
    # TODO: check if DB is up
    # start postgres before running the test
    $DOCKER_COMPOSE_COMMAND -p "$GIT_HASH" up -d postgres
    sleep 10
    echo "DBs up, start tests"
    $DOCKER_COMPOSE_COMMAND -p "$GIT_HASH" run -u $UID service-sherpa-tests
    RETURN_CODE=$?
    cp -R coverage_temp coverage
    $DOCKER_COMPOSE_COMMAND -p "$GIT_HASH" down -v
fi

END=$(date +%s)

echo "Return code: $RETURN_CODE"

RUNTIME=$((END-START))
printf 'Total time taken: %dh %dm %ds\n' $((RUNTIME/3600)) $((RUNTIME%3600/60)) $((RUNTIME%60))

# Throw the same return code as the tests did, that way Jenkins marks failed
# test runs as failures
exit $RETURN_CODE
