#!make

help:
	@echo "Usage: make [run]"
	@echo ""
	@echo "Usage:"
	@echo "  make run  	        Run tests in paralel"
	@echo ""

default: run

run:
	for number in {1..50}; do \
    	./run.sh test;\
	done

run-deposit:
	for number in {1..50}; do \
    	./run.sh deposit; \
	done

run-swap:
	for number in {1..100}; do \
    	./run.sh swap; \
	done

run-withdraw:
	for number in {1..50}; do \
    	./run.sh withdraw;\
	done	
