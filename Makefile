# GNU Make 3.8.2 and above

PATH := $(PWD)/node_modules/.bin:$(PATH)
SHELL := /bin/bash

# .SILENT:

all: clean
	make assets js
	babel dist/index.js --presets=env | uglifyjs -o dist/index.js -c
	postcss src/style.scss -u autoprefixer -o dist/style.css -m
	cleancss dist/style.css -o dist/style.css --source-map --source-map-inline-sources
	html-minifier --collapse-whitespace src/index.html -o dist/index.html

clean:
	rm -rf dist
	mkdir -p dist/tmp

html:
	cp src/index.html dist/index.html

css:
	node-sass src/style.scss -o dist --source-map true --source-map-contents

js:
	rollup src/index.js -o dist/index.js -f iife -c -m

assets:
	bin/sprites.js $(shell find src/assets/ -type f -name '*.png')

serve: all
	serve dist

deploy: all
	gh-pages -d dist -m "updates"
