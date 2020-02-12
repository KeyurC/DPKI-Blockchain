#!/bin/bash
clear
./stop.sh 
wait 
echo 'Blockchain has been stopped'
./teardown.sh
wait
echo 'Docker instances have been removed'
rm -f -r ../wallet
rm -f -r ../peer0.org1.example.com/
rm -f -r ../Tests/..peer0.org1.example.com/
wait
echo 'Wallets have been removed'
./start.sh
wait
echo 'Blockchain has started'
echo 'Currently started docker instances'
docker ps