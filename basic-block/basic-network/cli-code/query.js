'use strict';

const {config} = require('../utilities/config.js');
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname,'../', 'basic-network', 'connection.json');

class Query {
        async queryCC(key) {
                const wallet = new FileSystemWallet(config.walletPath);
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                const network = await gateway.getNetwork(config.channelName);
                const contract = network.getContract(config.chaincodeId);
                const result = await contract.evaluateTransaction('query', key);
                // console.log(result.toString());
                return result.toString();
        }
}

module.exports = {Query};

const query = new Query();
async function test() {
        let value = await query.queryCC("example1.org");
        console.log(value);
}

test();