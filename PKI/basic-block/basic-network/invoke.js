const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {
    
    async invokeCC(from,to,ammount) {
        await orgC.login();
        await orgC.getOrgAdmin();
        orgC.invoke(config.chaincodeId,config.chaincodeVersion,'invoke',from,to,ammount);
        
    }
}

module.exports = {Invoke}

const invoke = new Invoke();
invoke.invokeCC('a','b',1);