NPM_BIN = ./node_modules/.bin
XML2JSON = $(NPM_BIN)/xml2json
HTML_MINIFIER = $(NPM_BIN)/html-minifier

#START_DATE=`date -v-1y +"%d/%m/%Y"`
START_DATE = 01/01/2014

OS_NAME = $(shell uname -o)
ifeq ($OS_NAME, "GNU/Linux")
  END_DATE = $(shell date --date="now")
else
  END_DATE = $(shell date -v+1d +"%d/%m/%Y")
endif
DATE_FILE_MARK = $(subst /,,$(END_DATE))

define get-rates
curl "http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${START_DATE}&date_req2=${END_DATE}&VAL_NM_RQ=$1" -o $@
endef

.PHONY: all
all: build

data/$(DATE_FILE_MARK).usd.xml:
	$(call get-rates,R01235)

data/$(DATE_FILE_MARK).eur.xml:
	$(call get-rates,R01239)

data/%.json: data/$(DATE_FILE_MARK).%.xml
	@$(XML2JSON) < $< > $@

data/%.normalized.json: data/%.json
	@node tools/normalize-rates.js $^ $@

.PHONY: rates
rates: data/usd.normalized.json data/eur.normalized.json

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
	@git commit --allow-empty -m "Build pages"
	@git push origin +gh-pages
	@echo "Done"

.PHONY: clean
clean:
	@rm -fr data/*
	@rm -fr build/*
