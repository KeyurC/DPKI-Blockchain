const utils = require('../../utilities/IBMUtils');
const {config} = require('../../utilities/config.js');

const CAChaincode =  new utils.orgClient(config.Org1.channel.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);
const RevChaincode = new utils.orgClient(config.Org2.channel.channelName,config.orderer0,config.Org2.peer,config.Org2.ca,config.Org2.admin);

/**
 * The class is responsible for querying data from both the existing 
 * blockchains
 */
class Queries {

    /**
     * Function queries the Certificate Chaincode for Certificates
     * @param {String} domain domain name of website
     */
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

    /**
     * Function queries the Revocation Chaincode for Certificate Data
     */
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