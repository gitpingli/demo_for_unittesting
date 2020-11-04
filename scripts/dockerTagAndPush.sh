#!/bin/sh

shopt -s expand_aliases # set expand_aliases option to true

source ~/.bashrc

DOCKER_REGISTRY=${DOCKER_REGISTRY:='quay.io/consoleconnect'}
DOCKER_IMAGE=${DOCKER_IMAGE:='console_core_service_sherpa'}
DOCKER_COMMAND=${DOCKER_COMMAND:='sudo docker'}

echo -e "Using $DOCKER_COMMAND to tag and push $DOCKER_REGISTRY/$DOCKER_IMAGE ..."

VERSION=$(git describe --tags | sed 's/[A-Za-z]*//g')
GIT_HASH=$(git log --pretty=format:'%h' -n 1)
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

$DOCKER_COMMAND push $DOCKER_REGISTRY/$DOCKER_IMAGE:$VERSION

if [ "$LATEST" = true ] ; then
  echo "Tag and push this build as the latest build"
  $DOCKER_COMMAND tag $DOCKER_REGISTRY/$DOCKER_IMAGE:$VERSION $DOCKER_REGISTRY/$DOCKER_IMAGE:latest
  $DOCKER_COMMAND push $DOCKER_REGISTRY/$DOCKER_IMAGE:latest
fi
