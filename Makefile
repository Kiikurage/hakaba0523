.PHONY: db

default:
	DEBUG=hakaba0523:* ./bin/www

setup:
	npm install

watch-js:
	fswatch-run js/ "make build-js"

watch-style:
	fswatch-run style/ "make build-style"

build-js:
	./node_modules/browserify/bin/cmd.js js/main.js -o public/javascripts/script.js

build-style:
	sass style/style.scss public/stylesheets/style.css
	./node_modules/autoprefixer/autoprefixer public/stylesheets/style.css

db:
	mongod --dbpath ./db
