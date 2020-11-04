#!/bin/sh

git checkout develop
git pull origin develop
git fetch --tags
LATEST_COMMIT=`git show --pretty=format:%s -s HEAD`
echo Latest Commit: $LATEST_COMMIT

MSG=`echo $LATEST_COMMIT | tr a-z A-Z`

CURRENT_VERSION=`jq -r .version < package.json`
IFS='. ' read -r -a versions <<< "$CURRENT_VERSION"
VERSION_INC=$((versions[1]%2==1?2:1))
NEW_VERSION=${versions[0]}.$[versions[1]+VERSION_INC].0

echo $CURRENT_VERSION"==>"$NEW_VERSION

npm version $NEW_VERSION -m "RELEASE:$NEW_VERSION"
if [ $? -eq 0 ]
then
  echo "npm version $NEW_VERSION successfully"
else
  echo "npm version $NEW_VERSION failed"
  exit 1
fi
git push
git push --tags


# send out release notifiction and generate release note
TESTING=''
PROXY_URL=localhost:7999
PROJECT="${PWD##*/}"
PRE_VERSION=$CURRENT_VERSION
REL_VERSION=$NEW_VERSION
USER=$(git show -s --format='%an')


RELEASE_NOTES=$(curl -s ${PROXY_URL}/github/repos/${PROJECT}/releasenotes?fromTag=${PRE_VERSION})
if [ $? -eq 0 ]
then
  echo "generate release from console-core-service-dev"
else
  RELEASE_NOTES=$(git log $PRE_VERSION..HEAD --pretty=format:"• %s (%an)")
fi

PAYLOAD="*${TESTING}${PROJECT}* updated to ${REL_VERSION},published by $USER\n \`\`\`$PROJECT@$REL_VERSION\`\`\` *Release Notes:*\n$RELEASE_NOTES"
echo $PAYLOAD
DATA={\"text\":\"$PAYLOAD\"}
curl -X POST -H 'Content-type: application/json' --data "${DATA}" https://hooks.slack.com/services/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

#foreach JIRA issue, add comment, set published field, move status to TO_TEST
PROXY_DATA={\"fromTag\":\"${PRE_VERSION}\",\"version\":\"${REL_VERSION}\"}
curl -X POST -H 'Content-type: application/json' --data "${PROXY_DATA}" ${PROXY_URL}/github/repos/${PROJECT}/jira/sync

if [ $? -eq 0 ]
then
  echo "Update Jira issues done"
else
  echo "Update Jira issues failed, You need to update them manually"
fi
