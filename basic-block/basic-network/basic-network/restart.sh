#!/bin/bash
clear
./stop.sh 
wait 
echo 'Blockchain has been stopped'
./teardown.sh
wait
echo 'Docker instances have been removed'
rm -f -r ../peer0.org1.example.com/
rm -f -r ../peer0.org2.example.com/
wait
echo 'Wallets have been removed'
docker-compose -f docker-compose.yml up -d ca.example.com ca1.example.com orderer.example.com peer0.org1.example.com couchdb peer1.org1.example.com couchdb0 peer0.org2.example.com couchdb1
docker ps -a
export FABRIC_START_TIMEOUT=10
sleep ${FABRIC_START_TIMEOUT}
wait
echo 'Blockchain has started'
echo 'Currently started docker instances'
docker ps
sleep 2
echo 'Setting up Network'
node ../src/MultiOrgSetUp.js