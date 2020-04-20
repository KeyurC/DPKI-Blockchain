# DPKI
DPKI is a project aiming to completely decentralize the Public Key Infrastructure process using blockchain. The project merges the concept of blockchains decentralized storage with the PKI's ability to generate certificate and now uses each of the peers on a network as both a unique intermediate certificate authority as well as a validator of each peer. Any peer who joins the network will become an intermediate signing CA and in order to guarrantee security is constantly validated by other peers in order for certificates produced to be legitimate and unaltered.

##### Main Points
  - Hierachy Certificate Authority, where each CA is a peer in a decentralized distributed network 
  - Each Peer owns a seperate database validated by a decentralized, distributed blockhcain
  - Intermediate CA's can be revoked and replaced without much hassle
  - Revocation system has an easily accessible webpage to search and query, solving the lack of use bloated CRL
  - Registration Authority uses inspiration from letscrypt, client are required to produce a new page with a certain secret to prove ownership

### Installation

DPKI requires [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) to run and requires linux to run.

##### Step 1 - System setup
**Git clone and Library set up**
```sh
$ git clone https://github.com/RHUL-CS-Projects/FullUnit_1920_KeyurCanji.git
$ cd ./FullUnit_1920_KeyurCanji/basic-block/basic-network/
$ sh installLib.sh
```
**Set up docker-compose and hyperledger fabric binaries**
```sh
$ cd ../../../
$ sudo curl -sSL https://bit.ly/2ysbOFE | bash -s -- 1.4.3 1.4.3 0.4.15
```
##### Step 2 - Running the System
**Starting and setting up the network**
```sh
$ cd ./FullUnit_1920_KeyurCanji/basic-block/basic-network/basic-network
$ sh start.sh
```

##### Common fixes 
**Couldn't connect to Docker daemon at http+docker://localhost - is it running**
Requires relogging and potentially restarting
```sh
$ sudo usermod -aG docker $USER
$ sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
$ sudo service docker restart
```
**Only couchdb instances starting**
```sh
$ sudo setenforce 0 
```
**Single Peer exiting early**
Both secret keys can be found here /basic-network/crypto-config/peerOrganizations/org1.example.com/ca/ and /basic-network/crypto-config/peerOrganizations/org2.example.com/ca/
```sh
$ ./generate.sh
$ vi docker-compose.yml
change this line - FABRIC_CA_SERVER_TLS_KEYFILE=/etc/hyperledger/fabric-ca-server-config/{secret}
```

##### Step 3 - Starting the Server
Starting express server for clients to access the system from web apps
```sh
$ cd ./web/client
$ node app.js
$ gnome-terminal
$ cd ../admin
$ node app.js
```
##### Step 4 - Accessing the Web Apps
1. To open the client web app on device starting service IP is localhost:3000/index, to access from different device on the same
network ipaddress:3000/index
2. To open admin page the IP is localhost:4000/admin, admin page is only accessible from device starting the system to prevent clients from accessing admin pages

### Testing
To run these test the dependencies needed are [mocha](https://mochajs.org/)
**Selenium Tests**

```sh
$ cd ./Tests
$ mocha chaincodeTests.js --timeout 10000
```
**Chaincode Tests**

```sh
$ mocha chaincodeTests.js --timeout 5000
```
**Other Tests**

```sh
$ mocha filename.js
```


### Built With
The list below represent all the technologies used in this project

| Plugin | README |
| ------ | ------ |
| Hyperledger Fabric | [plugins/dropbox/README.md][PlDb] |
| Node js | [plugins/github/README.md][PlGh] |
| Docker | [plugins/googledrive/README.md][PlGd] |

License
----
Property of Royal Holloway University of London, Final Year Dissertation for Computer Science with Information Security