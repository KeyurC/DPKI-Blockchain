const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');
orgC = new utils.orgClient(config.Org2.channel.channelName,config.orderer0,config.Org2.peer,config.Org2.ca,config.Org2.admin);
let chaincode = config.Org2.chaincode;

class revocation {
    
    async getRevocations(certificate) {
        await orgC.login();
        await orgC.getOrgAdmin();
        return await orgC.transaction(chaincode.chaincodeId,chaincode.chaincodeVersion,'getAllRevokedCertificates');

    }
}

async function query() {
    const revoke = new revocation();
    let response = await revoke.getRevocations();
    console.log(JSON.parse(response.toString()));
}
query();