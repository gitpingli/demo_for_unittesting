#!/bin/sh

git config --local core.editor "vim"

git config --local commit.template `pwd`/scripts/githooks/gitmessage.txt
