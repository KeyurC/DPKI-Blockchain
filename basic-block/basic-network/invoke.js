const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
const query = require('./query.js')
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {
    
    async invokeCC(from,to) {
        await orgC.login();
        await orgC.getOrgAdmin();
        await orgC.invoke(config.chaincodeId,config.chaincodeVersion,'invoke',from,to,pem);

    }
}

module.exports = {Invoke}