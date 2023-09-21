#!make

help:
	@echo "Usage: make [run]"
	@echo ""
	@echo "Usage:"
	@echo "  make run  	        Run tests in paralel"
	@echo ""

default: run

run:
	for number in 1; do \
    $(MAKE) run-test-one $(MAKE) run-test-two $(MAKE) run-test-three; \
	done
	

run-test-one:
	./run.sh test

run-test-two:
	./run.sh test

run-test-three:
	./run.sh test
