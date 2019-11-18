'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'basic-network', 'connection.json');

async function main(wpath) {
        // Create a new file system based wallet for managing identities.
        const walletPath = wpath + 'wallet';
        const wallet = new FileSystemWallet(walletPath);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('abstore');

        // Evaluate the specified transaction, in order to query from chaincode
        const result = await contract.evaluateTransaction('query','a');
    
        console.log('Result is: '+ result.toString());
}

main("");
