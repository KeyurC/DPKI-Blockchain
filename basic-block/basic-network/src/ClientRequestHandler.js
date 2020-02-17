const utils = require('../utilities/IBMUtils.js');
const { config } = require('../utilities/config.js');

/**
 * Class is responsible for communicating with the blockchain,
 * and send the CSR to the blockchain for it to be signed and verified.
 */
class ClientRequestHandler {

    constructor(CSR, domain) {
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
        await orgC.transaction(config.Org1.chaincode.chaincodeId, config.Org1.chaincode.dchaincodeVersion, 'invoke', this.domain, this.request);

    }

    /**
     * Constructs the organisation client in the Utils class, to use the built-in
     * methods.
     */
    constructOrgClient() {
        const chaincode1 = new utils.orgClient(config.Org1.channel.channelName, config.orderer0,
            config.Org1.peer, config.Org1.ca, config.Org1.admin);
        return chaincode1;
    }
}

module.exports = { ClientRequestHandler }