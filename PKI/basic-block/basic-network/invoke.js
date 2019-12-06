const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {
    constructor() {

    }

    async invokeCC(hash,CN) {
        await orgC.login();
        await orgC.getOrgAdmin();
        console.log("hash:",hash);
        console.log("CN:",CN);
        orgC.invoke(config.chaincodeId,config.chaincodeVersion,'invoke',hash,CN);
        
    }
}

module.exports = {Invoke};