const fs = require('fs');
const path12 = require('path');
const chaincodeName = 'abstore';
const chaincodeVersion = '2.9';
const chaincodePath = "chaincode/certchain/javascript/"
// const chaincodePath = path12.resolve(__dirname, 'chaincode', 'certchain','javascript','lib');
const envelope = fs.readFileSync(path12.resolve(__dirname, 'basic-network', 'config','channel.tx'));
const ccpPath = path12.resolve(__dirname, 'basic-network', 'connection.json');
const admincert = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','msp','admincerts','Admin@org1.example.com-cert.pem'))
const adminkey = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','users','Admin@org1.example.com','msp','keystore','cd96d5260ad4757551ed4a5a991e62130f8008a0bf996e4e4b84cd097a747fec_sk'))
const {FileSystemWallet,Gateway,X509WalletMixin} = require("fabric-network")

module.exports = {
  chaincodeInstall: function() {
    install();
  },
  chaincodeInstantiate: function() {
    instantiate();
  }
}

const peercert = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','peers','peer0.org1.example.com','tls','ca.crt'))

// async function instantiate() {
//   const walletPath = path12.join(process.cwd(), 'wallet');
//   const wallet = new FileSystemWallet(walletPath);
//   const gateway = new Gateway();
//   await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });


//   const client = gateway.getClient();

//   client.setAdminSigningIdentity(adminkey,admincert,'Org1MSP')

//   const defaultPeer = client.newPeer('grpc://localhost:7051', {
//         pem: peercert.toString(),
//         'ssl-target-name-override': 'peer0.org1.example.com'
//       });
//   let tx_id = await client.newTransactionID(true);
//   const channelName = await client.queryChannels(defaultPeer)
//   const channel = await client.getChannel('mychannel');
//   // console.log(channel);
//   const endorsepol = {
//     identities: [
//       { role: { name: "member", mspId: "org1" }}
//     ],
//     policy: {
//       "1-of": [{ "signed-by": 0 }]
//     }
//   };  
//   const instantiateRequest = {
//     targets: [defaultPeer],
//     chaincodeId: chaincodeName,
//     chaincodeVersion: '2.1',
//     args: ['a','1','b','2'],
//     "endorsement-policy": endorsepol,
//     txId: tx_id,
//     orderer: 'orderer.example.com'
// };
// // console.log(await channel.getEndorsementPlan);
// let instantiateResults = await channel.sendInstantiateProposal(instantiateRequest);
// console.log(instantiateResults[0][0]);
//   const transactionrequest = {
//     proposalResponses: instantiateResults[0],
//     proposal: instantiateResults[1],
//     txID: client.newTransactionID(true)
//   }

//   //console.log("Valid Result?",channel.verifyProposalResponse(instantiateResults))
// instantiateTransaction = await channel.sendTransaction(transactionrequest);
// console.log(instantiateTransaction)

// }

async function install() {

    const walletPath = path12.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);
    const gateway = new Gateway();
    await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });


    const client = gateway.getClient();
    const channel = client.getChannel("mychannel");

    // console.log(channel);
    // const client = new Client()
    const defaultPeer = client.newPeer('grpc://localhost:7051', {
        pem: peercert.toString(),
        'ssl-target-name-override': 'peer0.org1.example.com'
      });
    
    client.setAdminSigningIdentity(adminkey,admincert,'Org1MSP')
    // console.log(chaincodePath);
    const request = {
        targets: [defaultPeer],
        chaincodePath: chaincodePath,
        //metadataPath: metadata_path,
        chaincodeId: chaincodeName,
        chaincodeType: 'node',
        fcn: 'init',
        args: ['a','1','b','2'],
        chaincodeVersion: chaincodeVersion
      };
    // console.log(typeof request.chaincodePath)
    let results;
    
    // console.log(tx_id)
    results = await client.installChaincode(request);
    console.log(results);
    

    // let instantiateResults = await channel.sendInstantiateProposal(instantiateRequest);
  const transactionrequest = {
    proposalResponses: results[0],
    proposal: results[1],
    txID: client.newTransactionID(true)
  }

  //console.log("Valid Result?",channel.verifyProposalResponse(instantiateResults))
  // let instantiateTransaction = await channel.sendTransaction(transactionrequest);
  // console.log(instantiateTransaction);
  await gateway.disconnect();
    
    
  }
  install();