const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
const query = require('./query.js')

/**
 * Class is responsible for communicating with the blockchain,
 * and send the CSR to the blockchain for it to be signed and verified.
 */
class ClientRequestHandler {
    
    constructor(CSR,domain) {
        this.request = CSR;
        this.domain = domain;
        this.invokeChaincode();
    }

    /**
     * Function invokes the chaincode in order for the request,
     * to be signed and stored in the blockchain.
     */
    async invokeChaincode() {
        const orgC = this.constructOrgClient();
        await orgC.login();
        await orgC.getOrgAdmin();
        await orgC.transaction(config.chaincodeId,config.chaincodeVersion,'invoke',this.domain,this.request);

    }

    /**
     * Constructs the organisation client in the Utils class, to use the built-in
     * methods.
     */
    constructOrgClient() {
        const orgC = new utils.orgClient(config.channelName,
            config.orderer0,config.Org1.peer
            ,config.Org1.ca,config.Org1.admin);
        return orgC;
    }
}

module.exports = {ClientRequestHandler}