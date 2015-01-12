XML2JSON = ./node_modules/.bin/xml2json

.PHONY: all
all: rates
	@echo "Done."

#START_DATE=`date -v-1y +"%d/%m/%Y"`
START_DATE = 01/01/2014
END_DATE = `date +"%d/%m/%Y"`

define get-rates
curl "http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${START_DATE}&date_req2=${END_DATE}&VAL_NM_RQ=$1" -o $@
endef

data/usd-rates.xml:
	$(call get-rates,R01235)

data/eur-rates.xml:
	$(call get-rates,R01239)

data/%-rates.json: data/%-rates.xml
	$(XML2JSON) < $< > $@

.PHONY: rates
rates: data/usd-rates.json data/eur-rates.json

.PHONY: clean
clean:
	rm -fr data/*