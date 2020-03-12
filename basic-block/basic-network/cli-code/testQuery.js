const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');
const forge = require('node-forge');
orgC = new utils.orgClient(config.Org1.channel.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);
// orgC = new utils.orgClient(config.Org2.channel.channelName,config.orderer0,config.Org2.peer,config.Org2.ca,config.Org2.admin);
let chaincode = config.Org1.chaincode;

class Invoke {


    async verify(certificate) {
        await orgC.login();
        await orgC.getOrgAdmin();
        return await orgC.query(chaincode.chaincodeId,chaincode.chaincodeVersion,'query',certificate);

    }
}

async function verifyTest() {
    const invoke = new Invoke();
    let cert = "example1.org";
    let response = await invoke.verify(cert);
    console.log(response);
}
verifyTest();