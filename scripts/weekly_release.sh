#!/bin/sh
if [ -z "$1" ]; then
    echo "./weekly_release.sh 1.X"
    exit 1
else
    REL_BRANCH=PL-$1
fi

git checkout develop
git pull origin develop
git fetch --tags
LATEST_COMMIT=`git show --pretty=format:%s -s HEAD`
echo Latest Commit: $LATEST_COMMIT

CURRENT_VERSION=`jq -r .version < package.json`
IFS='. ' read -r -a versions <<< "$CURRENT_VERSION"
VERSION_INC=$((versions[1]%2==0?2:1))
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


git branch $REL_BRANCH
git checkout $REL_BRANCH
git push --set-upstream origin $REL_BRANCH

# rebase on master branch
git checkout master
git rebase develop
git push


# send out release notifiction and generate release note
TESTING=''
PROXY_URL=localhost:7999
PROJECT="${PWD##*/}"
PRE_VERSION=$CURRENT_VERSION
REL_VERSION=$NEW_VERSION
USER=$(git show -s --format='%an')
RELEASE_NOTES=""
PAYLOAD="*${TESTING}${PROJECT}* updated to ${REL_VERSION},published by $USER\n \`\`\`$PROJECT@$REL_VERSION\`\`\` *Release Notes($REL_BRANCH):*\n$RELEASE_NOTES"
echo $PAYLOAD
DATA={\"text\":\"$PAYLOAD\"}
curl -X POST -H 'Content-type: application/json' --data "${DATA}" https://hooks.slack.com/services/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
