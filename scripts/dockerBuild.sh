#!/bin/sh

shopt -s expand_aliases # set expand_aliases option to true

source ~/.bashrc

DOCKER_REGISTRY=${DOCKER_REGISTRY:='quay.io/consoleconnect'}
DOCKER_IMAGE=${DOCKER_IMAGE:='console_core_service_sherpa'}
DOCKER_COMMAND=${DOCKER_COMMAND:='sudo docker'}

echo -e "Using $DOCKER_COMMAND to build $DOCKER_REGISTRY/$DOCKER_IMAGE ..."
QUAY_IMAGE_EXPIRATION=${QUAY_IMAGE_EXPIRATION:='24w'}

# Allows you to leave a .npmrc in your local working directory for Docker builds
# obviously you need to be careful not to commit this
if [[ -z "$NPM_TOKEN" && ! -f .npmrc ]]; then
    echo -e "You must set your NPM token to the environment variable NPM_TOKEN"
    echo -e "export NPM_TOKEN=<TOKEN>"
    exit 1
fi

if [ ! -f .npmrc  ]; then
    echo -e "//registry.npmjs.org/:_authToken=$NPM_TOKEN\n" > .npmrc
fi

VERSION=$(git describe --tags | sed 's/[A-Za-z]*//g')
GIT_HASH=$(git log --pretty=format:'%h' -n 1)

echo "Building Docker container for console-core-service-sherpa:$VERSION"

LATEST_VERSION=$(git tag -l | sort -V | tail -n 1 | sed 's/[A-Za-z]*//g')
echo "Latest version - $LATEST_VERSION"

LATEST=false
if [[ "$VERSION" == "$LATEST_VERSION" ]]; then
  echo "This is the latest version!"
  echo "We're on $VERSION, Latest version is $LATEST_VERSION"
  echo "$VERSION = $LATEST_VERSION"
  LATEST=true
fi

if [[ "$VERSION" != "$LATEST_VERSION" ]]; then
  echo "This is the not latest version!"
  echo "We're on $VERSION, Latest version is $LATEST_VERSION"
  echo "$VERSION != $LATEST_VERSION"
fi

#echo 'npm install && npm run build'
#npm install && npm run build && npm audit fix

if ! $DOCKER_COMMAND build --pull --no-cache \
    --label "commit-hash=$GIT_HASH" \
    --label "built-on=$(hostname)" \
    --label "built-by=$(whoami)" \
    --label "version=$VERSION" \
    --label "build-date=$(date +"%Y%m%d")" \
    --label "quay.expires-after=$QUAY_IMAGE_EXPIRATION" \
    -t $DOCKER_REGISTRY/$DOCKER_IMAGE:$VERSION .; then

  echo "Build failed!"
  exit 1
fi
