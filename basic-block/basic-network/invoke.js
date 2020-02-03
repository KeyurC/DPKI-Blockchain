const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
const query = require('./query.js')
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {
    
    async invokeCC(from,to) {
        await orgC.login();
        await orgC.getOrgAdmin();
        const pem = await this.selectCA();
        await orgC.invoke(config.chaincodeId,config.chaincodeVersion,'invoke',from,to,pem);

    }

    async selectCA() {
        const query1 = new query.Query();
        var value = await query1.queryCC('SubCA1');
        var pem = JSON.parse(value);
        return pem;
    }
}

module.exports = {Invoke}