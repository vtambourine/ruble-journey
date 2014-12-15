#!/usr/bin/env bash

CWD=$(cd `dirname "$0"`; pwd)
cd $CWD

./node_modules/.bin/gulp
#git clone https://github.com/vtambourine/ruble-journey.git tmp/
cd tmp/
git co master
git branch -D gh-pages
git co --orphan gh-pages
git rm -fr .
cp ../public/* .
git add .
git ci -m "Upadating page"
git push origin +gh-pages
