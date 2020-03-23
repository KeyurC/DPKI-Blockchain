const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');

orgC2 = new utils.orgClient(config.Org2.channel.channelName,config.orderer0,config.Org2.peer,config.Org2.ca,config.Org2.admin);
let chaincode = config.Org2.chaincode;

class revocation {
    
    async getRevocations(certificate) {
        await orgC2.login();
        await orgC2.getOrgAdmin();
        return await orgC2.query(chaincode.chaincodeId,chaincode.chaincodeVersion,'getAllRevokedCertificates');

    }
}


module.exports = { revocation }

// async function query() {
//     const revoke = new revocation();
//     let response = await revoke.getRevocations();
//     console.log(JSON.parse(response.toString()));
// }
// query();