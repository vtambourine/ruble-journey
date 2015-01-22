NPM_BIN = ./node_modules/.bin
XML2JSON = $(NPM_BIN)/xml2json
HTML_MINIFIER = $(NPM_BIN)/html-minifier

.PHONY: all
all: build
	@echo "Done."

#START_DATE=`date -v-1y +"%d/%m/%Y"`
START_DATE = 01/01/2014
END_DATE = $(shell date -v+1d +"%d/%m/%Y")

define get-rates
curl "http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${START_DATE}&date_req2=${END_DATE}&VAL_NM_RQ=$1" -o $@
endef

data/usd-rates.xml:
	$(call get-rates,R01235)

data/eur-rates.xml:
	$(call get-rates,R01239)

data/%-rates.json: data/%-rates.xml
	@$(XML2JSON) < $< > $@

data/%-rates.normalized.json: data/%-rates.json
	@node tools/normalize-rates.js $^ $@

.PHONY: rates
rates: data/usd-rates.normalized.json data/eur-rates.normalized.json

build/index.html: rates
	@jade pages/index.jade --out build
	@$(HTML_MINIFIER) --minify-js --minify-css --remove-comments-from-cdata $@ -o $@

.PHONY: build
build: build/index.html
	@cp CNAME build
	@echo "Build done."

REPO = $(shell git config --get remote.origin.url)
PAGES_DIR := build
.PHONY: release
release:
	@echo "Releasing"
	@if [ ! -d $(PAGES_DIR) ]; then mkdir $(PAGES_DIR); fi
	@$(MAKE) -C $(PAGES_DIR) -f $(CURDIR)/$(lastword $(MAKEFILE_LIST)) gh-pages

.PHONY: gh-pages
gh-pages:
	@echo "Pages"
	@if [ ! -d ".git" ]; \
	then \
		git init; \
		git remote add --fetch origin "$(REPO)"; \
	fi;

	@if git rev-parse --verify origin/gh-pages > /dev/null 2>&1; \
	then \
		git checkout gh-pages; \
	else \
		git checkout --orphan gh-pages; \
	fi;

	@git add .
	@git commit -m "Build pages"
	@git push origin +gh-pages
	@echo "Done"

.PHONY: clean
clean:
	@rm -fr data/*
	@rm -fr build/*
