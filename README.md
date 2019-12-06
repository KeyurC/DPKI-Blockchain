# PKI-using-Blockchain
Public key infrastructure which implements blockchain technology in order to deal with the centralization issues

## Dependencies
### Python-PKI
The PKI requires the following to be installed first in order to run the program.
To install the following use pip install example

unittest=preinstalled
pyOpenSSL=19.1.0
requests=2.22.0
pyjks=19.0.0

### Blockchain
In order to use the blockchain program with the PKI, the hyperledger binaries need to be installed
This can be done by doing
		curl -sSL http://bit.ly/2ysbOFE | bash -s
followed by
		export PATH=<path to download location>/bin:$PATH

## How to run
1. Navigate to the basic-network folder and start the script using ./start.sh
2. run CCServer.js using node CCServer.js
3. Navigate to controller in PKI
4. run Controller.py in a second terminal



## Common fixes

### Docker containers exiting early in start script
1. run sudo setenforce 0
2. redownload the basic-network, to revert any corrupted containers
### Initialization of blockchain failes
1. run teardown.sh using ./teardown.sh
remove peer0.org1.example.com using rm -r peer0.org1.example.com
### Controller won't run
1. Make sure all dependencies are installed correctly
2. Use pycharm and import the project and install the dependencies in settings->Project:PKI->Project Interpreter. Run controller after

