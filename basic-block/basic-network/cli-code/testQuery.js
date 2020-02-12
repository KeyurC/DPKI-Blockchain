const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');
const forge = require('node-forge');
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {


    async verify(certificate) {
        await orgC.login();
        await orgC.getOrgAdmin();
        return await orgC.query(config.chaincodeId,config.chaincodeVersion,'query',certificate);

    }
}

async function verifyTest() {
    const invoke = new Invoke();
    let cert = "example1.org";
    let response = await invoke.verify(cert);
    console.log(response);
}
verifyTest();