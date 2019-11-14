const fs = require('fs');
const path12 = require('path');
const chaincodeName = 'certchain';
const chaincodeVersion = '1.3';
const chaincodePath = "chaincode/certchain/javascript/lib"
// const chaincodePath = path12.resolve(__dirname, 'chaincode', 'certchain','javascript','lib');
const envelope = fs.readFileSync(path12.resolve(__dirname, 'basic-network', 'config','channel.tx'));
const ccpPath = path12.resolve(__dirname, 'basic-network', 'connection.json');
const admincert = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','msp','admincerts','Admin@org1.example.com-cert.pem'))
const adminkey = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','users','Admin@org1.example.com','msp','keystore','cd96d5260ad4757551ed4a5a991e62130f8008a0bf996e4e4b84cd097a747fec_sk'))
const {FileSystemWallet,Gateway,X509WalletMixin} = require("fabric-network")

const peercert = fs.readFileSync(path12.resolve(__dirname,'basic-network','crypto-config','peerOrganizations','org1.example.com','peers','peer0.org1.example.com','tls','ca.crt'))
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
        chaincodeVersion: chaincodeVersion
      };
    // console.log(typeof request.chaincodePath)
    let results;
    // Make install proposal to all peers
    let tx_id = client.newTransactionID(true);
    // console.log(tx_id)
    results = await client.installChaincode(request);
    console.log(results);
    const instantiateRequest = {
        targets: [defaultPeer],
        chaincodeId: chaincodeName,
        chaincodeVersion: chaincodeVersion,
        fcn: 'init',
        args: '',
        txId: tx_id
    };

    // let instantiateResults = await channel.sendInstantiateProposal(instantiateRequest);
    // console.log(instantiateResults);
    // instantiateTransaction = channel.sendTransaction(instantiateRequest).then(console.log(instantiateTransaction));
    
    // let chaincodes = await channel.queryInstantiatedChaincodes();
    // if (!Array.isArray(chaincodes)) {
    //     console.log("false");
    // } else {
    //     console.log("true" + chaincodes.values);
    // }

    // console.log(results);
    await gateway.disconnect();
    
    
  }

install()