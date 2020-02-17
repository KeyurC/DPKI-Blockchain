const { readFileSync } = require('fs');
const path = require('path');



// const basePath = resolve(__dirname, '../../certs');
// const readCryptoFile =
// filename => readFileSync(resolve(basePath)).toString();
const config = {
  isCloud: false,
  orderer0: {
    hostname: 'orderer.example.com',
    url: 'grpc://localhost:7050'
  },
  Org1: {
    channel: {
      channelName: 'mychannel',
      channelConfig: readFileSync(path.resolve(__dirname, '../', 'basic-network/config/channel.tx')),
    },
    chaincode: {
      chaincodeId: 'abstore',
      chaincodeVersion: 'v1',
      chaincodePath: '../chaincode/certchain/javascript/'
    },
    peer: {
      peer0: {
        hostname: 'peer0.org1.example.com',
        url: 'grpc://localhost:7051',
        eventHubUrl: 'grpc://localhost:7053',
        // pem: readFileSync(path.resolve(__dirname,'basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt')).toString()
      }
    },
    ca: {
      hostname: 'ca0.example.com',
      url: 'http://localhost:7054',
      mspId: 'Org1MSP'
    },
    admin: {
      cert: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem')),
      key: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/4929cb1245650670c1b7a4018a8a5c37c8cdaf62084d612fe0df432098602901_sk'))
    }
  },

  Org2: {
    channel: {
      channelName: 'mychannel2',
      channelConfig: readFileSync(path.resolve(__dirname, '../', 'basic-network/config/channel2.tx')),
    },
    chaincode: {
      chaincodeId: 'revocation',
      chaincodeVersion: 'v1',
      chaincodePath: '../chaincode/revchain/javascript/'
    },
    peer: {
      peer0: {
        hostname: 'peer0.org2.example.com',
        url: 'grpc://localhost:8051',
        eventHubUrl: 'grpc://localhost:8053',
        // pem: readFileSync(path.resolve(__dirname,'basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt')).toString()
      }
    },
    ca: {
      hostname: 'ca1.example.com',
      url: 'http://localhost:8054',
      mspId: 'Org2MSP'
    },
    admin: {
      cert: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/admincerts/Admin@org2.example.com-cert.pem')),
      key: readFileSync(path.resolve(__dirname, '../basic-network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp/keystore/e1f979bfea9c93d87954112f27b7e36ea4590d9edbb36d7d1d0b99825ae78023_sk'))
    }
  }
};

// if (process.env.LOCALCONFIG) {
//   config.orderer0.url = 'grpcs://localhost:7050';

//   config.insuranceOrg.peer.url = 'grpcs://localhost:7051';
//   config.shopOrg.peer.url = 'grpcs://localhost:8051';
//   config.repairShopOrg.peer.url = 'grpcs://localhost:9051';
//   config.policeOrg.peer.url = 'grpcs://localhost:10051';

//   config.insuranceOrg.peer.eventHubUrl = 'grpcs://localhost:7053';
//   config.shopOrg.peer.eventHubUrl = 'grpcs://localhost:8053';
//   config.repairShopOrg.peer.eventHubUrl = 'grpcs://localhost:9053';
//   config.policeOrg.peer.eventHubUrl = 'grpcs://localhost:10053';

//   config.insuranceOrg.ca.url = 'https://localhost:7054';
//   config.shopOrg.ca.url = 'https://localhost:8054';
//   config.repairShopOrg.ca.url = 'https://localhost:9054';
//   config.policeOrg.ca.url = 'https://localhost:10054';
// }

const DEFAULT_CONTRACT_TYPES = [];


module.exports = { config, DEFAULT_CONTRACT_TYPES }
