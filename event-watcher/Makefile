#!make

help:
	@echo "Usage: make [build|run"]
	@echo ""
	@echo "Usage:"
	@echo "  make build  	    Builds and install dependencies to frontend, backend and events."
	@echo "  make run  	        Runs frontend, backend and events togethers."
	@echo ""

default: build

build:
	cd backend && cargo build \
	&& cd ../events && cargo build \
	&& cd ../frontend && npm i

run:
	$(MAKE) run-backend $(MAKE) run-frontend $(MAKE) run-events

run-backend:
	cd backend && cargo run

run-frontend:
	cd frontend && npm run start:dev

run-events:
	cd events && cargo run
