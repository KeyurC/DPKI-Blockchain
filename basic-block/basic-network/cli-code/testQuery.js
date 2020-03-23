const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');

orgC = new utils.orgClient(config.Org1.channel.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);
let chaincode = config.Org1.chaincode;

class Query {
    async getCertificate(certificate) {
        await orgC.login();
        await orgC.getOrgAdmin();
        return await orgC.query(chaincode.chaincodeId,chaincode.chaincodeVersion,'query',certificate);

    }
}

module.exports = Query;

// async function verifyTest() {
//     const invoke = new Invoke();
//     let cert = "https://keyurc.github.io";
//     let response = await invoke.verify(cert);
//     console.log(response);
// }
// verifyTest();