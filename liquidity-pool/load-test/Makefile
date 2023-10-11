#!make

help:
	@echo "Usage: make [run]"
	@echo ""
	@echo "Usage:"
	@echo "  make init  	        Initialize liquidity pool load tests"
	@echo "  make run  	        	Run liquidity pool tests"
	@echo "  make deposit  	        Run deposit load tests"
	@echo "  make swap  	        Run swap load tests"
	@echo "  make withdraw  	    Run withdraw load tests"
	@echo ""

default: run

run:
	for number in {1..50}; do \
    	./run.sh test;\
	done

deposit:
	for number in {1..50}; do \
    	./run.sh deposit; \
	done

swap:
	for number in {1..50}; do \
    	./run.sh swap; \
	done

withdraw:
	for number in {1..50}; do \
    	./run.sh withdraw;\
	done	

init:
	./initialize.sh
