#!/usr/bin/env bash

CWD=$(cd `dirname "$0"`; pwd)
DATA_PATH="$CWD/data"
mkdir $DATA_PATH
cd $CWD

START=`date -v-1y +"%d/%m/%Y"`
END=`date +"%d/%m/%Y"`

USD_CODE="R01235"
EUR_CODE="R01239"

USD_DYNAMIC="usd-${START//\//}-${END//\//}.xml"
EUR_DYNAMIC="eur-${START//\//}-${END//\//}.xml"

USD_DYNAMIC_URL="http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${START}&date_req2=${END}&VAL_NM_RQ=${USD_CODE}"
EUR_DYNAMIC_URL="http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${START}&date_req2=${END}&VAL_NM_RQ=${EUR_CODE}"

curl $USD_DYNAMIC_URL -o "$DATA_PATH/$USD_DYNAMIC"
curl $EUR_DYNAMIC_URL -o "$DATA_PATH/$EUR_DYNAMIC"

USD_CURRENT_PATH="$DATA_PATH/usd-current-dynamic.xml"
EUR_CURRENT_PATH="$DATA_PATH/eur-current-dynamic.xml"

ln -sf "$DATA_PATH/$USD_DYNAMIC" $USD_CURRENT_PATH
ln -sf "$DATA_PATH/$EUR_DYNAMIC" $EUR_CURRENT_PATH

node parse-dynamics.js $USD_CURRENT_PATH ${USD_CURRENT_PATH/xml/json}
node parse-dynamics.js $EUR_CURRENT_PATH ${EUR_CURRENT_PATH/xml/json}

./node_modules/.bin/gulp
echo "Hello"
