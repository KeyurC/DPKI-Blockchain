const utils = require('../../utilities/IBMUtils');
const {config} = require('../../utilities/config.js');

const CAChaincode =  new utils.orgClient(config.Org1.channel.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);

const RevChaincode = new utils.orgClient(config.Org2.channel.channelName,config.orderer0,config.Org2.peer,config.Org2.ca,config.Org2.admin);


class Queries {

    async queryCADB(domain) {
        let chaincode = config.Org1.chaincode;
        let response = await CAChaincode.login().then(() => {
            return CAChaincode.getOrgAdmin().then( () => {
                return CAChaincode.query(chaincode.chaincodeId,chaincode.chaincodeVersion,'query',domain).then( response => {
                    return response;
                });
            });
        })
        return response;
    }

    async queryRevocationsDB() {
        let chaincode = config.Org2.chaincode;
        let response = await RevChaincode.login().then(() => {
            return RevChaincode.getOrgAdmin().then( () => {
                return RevChaincode.query(chaincode.chaincodeId,chaincode.chaincodeVersion,'getAllRevokedCertificates').then( response => {
                    return response;
                });
            });
        })
        return response;
    }
 
}

module.exports = Queries;