#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error, print all commands.
set -ev

# Shut down the Docker containers that might be currently running.
docker-compose -f /home/keyur/GitHub/kenny/FullUnit_1920_KeyurCanji/basic-block/basic-network/basic-network/docker-compose.yml stop
rm -f -r ../peer0.org1.example.com/
rm -f -r ../peer0.org2.example.com/
