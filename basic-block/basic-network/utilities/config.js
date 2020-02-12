const { readFileSync } = require('fs');
const path = require('path');



// const basePath = resolve(__dirname, '../../certs');
// const readCryptoFile =
  // filename => readFileSync(resolve(basePath)).toString();
const config = {
  isCloud: false,
  channelName: 'mychannel',
  channelConfig: readFileSync(path.resolve(__dirname,'../' ,'basic-network/config/channel.tx')),
  chaincodeId: 'abstore',
  chaincodeVersion: 'v45',
  chaincodePath: '../chaincode/certchain/javascript/',
  walletPath: path.resolve(__dirname,'wallet'),
  orderer0: {
    hostname: 'orderer.example.com',
    url: 'grpc://localhost:7050'
  },
  Org1: {
    peer: {
      peer0: {
        hostname: 'peer0.org1.example.com',
        url: 'grpc://localhost:7051',
        eventHubUrl: 'grpc://localhost:7053',
        // pem: readFileSync(path.resolve(__dirname,'basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt')).toString()
      },
      peer1: {
        hostname: 'peer1.org1.example.com',
        url: 'grpc://localhost:8051',
        // pem: readFileSync(path.resolve(__dirname,'basic-network/crypto-config/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt')).toString()
      },
      
    },
    ca: {
      hostname: 'ca.example.com',
      url: 'http://localhost:7054',
      mspId: 'Org1MSP'
    },
    admin: {
      cert: readFileSync(path.resolve(__dirname,'../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/admincerts/Admin@org1.example.com-cert.pem')),
      key: readFileSync(path.resolve(__dirname,'../basic-network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/1ffefeae975e50ac514bddbc9c488549699f1b1fc098bc1fae7c1a0b903647e7_sk'))
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


module.exports = {config,DEFAULT_CONTRACT_TYPES}
