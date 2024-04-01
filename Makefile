## run the service
.PHONY: run
run: build
	@echo "Running the program..."
	node dist/main.js

## build the service
.PHONY: build
build:
	@echo "Building the program..."
	tsc

## install the service dependencies
.PHONY: install
install:
	@echo "Installing the dependencies..."
	npm install

## build the docker image
.PHONY: image
image:
	@echo "Building the docker image..."
	docker build -t syncspot .

## Access the container
.PHONY: dev/image
dev/image: image
	@echo "Running the docker image..."
	docker run -it --rm syncspot /bin/bash

## Run the container locally
.PHONY: dev/run
dev/run:
	@echo "Running the docker image..."
	docker run --rm syncspot

## Display help for all targets
.PHONY: help
help:
	@awk '/^.PHONY: / { \
		msg = match(lastLine, /^## /); \
			if (msg) { \
				cmd = substr($$0, 9, 100); \
				msg = substr(lastLine, 4, 1000); \
				printf "  ${GREEN}%-30s${RESET} %s\n", cmd, msg; \
			} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)
