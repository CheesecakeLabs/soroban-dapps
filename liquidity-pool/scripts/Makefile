#!make

help:
	@echo "Usage: make [run]"
	@echo ""
	@echo "Usage:"
	@echo "  make run  	        Run tests in paralel"
	@echo ""

default: run

run:
	$(MAKE) run-test-one $(MAKE) run-test-two $(MAKE) run-test-three

run-test-one:
	./run.sh test | tee -a test-one

run-test-two:
	./run.sh test | tee -a test-two

run-test-three:
	./run.sh test | tee -a test-three		
