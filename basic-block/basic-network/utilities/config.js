const { readFileSync } = require('fs');
const path = require('path');
const fs = require('fs');

const config = {
  orderer0: {
    hostname: 'orderer.example.com',
    url: 'grpcs://localhost:7050',
    pem: readFileSync(path.resolve(__dirname, '../', 'basic-network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt')).toString()
  },
  Org1: {
    channel: {
      channelName: 'mychannel',
      channelConfig: readFileSync(path.resolve(__dirname, '../', 'basic-network/config/channel.tx')),
      node: 'true'
    },
    chaincode: {
      chaincodeId: 'abstore',
      chaincodeVersion: 'v16',
      chaincodePath: '../chaincode/certchain/javascript/'
    },
    peer: {
      peer0: {
        hostname: 'peer0.org1.example.com',
        url: 'grpcs://localhost:7051',
        eventHubUrl: 'grpc://localhost:7053',
        pem: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt')).toString(),

      },
      peer1: {
        hostname: 'peer1.org1.example.com',
        url: 'grpcs://localhost:9051',
        eventHubUrl: 'grpc://localhost:9053',
        pem: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt')).toString(),
      },
      node: "multiple"
    },
    ca: {
      hostname: 'ca0.example.com',
      url: 'https://localhost:7054',
      mspId: 'Org1MSP'
    },
    admin: {
      cert: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem')),
      key: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/8b5734a38bc5545a0ffd79fddad44dd2832396b2f8fdb50f8d21f045125e0370_sk'))
    }
  },

  Org2: {
    channel: {
      channelName: 'mychannel2',
      channelConfig: readFileSync(path.resolve(__dirname, '../', 'basic-network/config/channel2.tx')),
      node: 'true'
    },
    chaincode: {
      chaincodeId: 'revocation',
      chaincodeVersion: 'v1',
      chaincodePath: '../chaincode/revchain/javascript/'
    },
    peer: {
      peer0: {
        hostname: 'peer0.org2.example.com',
        url: 'grpcs://localhost:8051',
        eventHubUrl: 'grpc://localhost:8053',
        pem: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt')).toString()
      },
      node: "multiple"
    },
    ca: {
      hostname: 'ca1.example.com',
      url: 'https://localhost:8054',
      mspId: 'Org2MSP'
    },
    admin: {
      cert: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/admincerts/Admin@org2.example.com-cert.pem')),
      key: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/8bc29a28c4d4efc1b2837f64e1d6518070cfeb6387d70df8702aa9ad53685519_sk'))
    }
  }
};

const DEFAULT_CONTRACT_TYPES = [];

module.exports = { config, DEFAULT_CONTRACT_TYPES }
