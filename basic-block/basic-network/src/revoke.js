const utils = require('../utilities/IBMUtils.js');
const { config } = require('../utilities/config.js');

/**
 * Class is responsible for communicating with the blockchain,
 * and send the CSR to the blockchain for it to be signed and verified.
 */
class revocation {

    constructor(domain,serial,reason) {
        this.domain = domain;
        this.serial = serial;
        this.reason = reason;
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
        await orgC.transaction(config.Org2.chaincode.chaincodeId, config.Org2.chaincode.dchaincodeVersion, 'invoke', this.domain, this.serial, this.reason);

    }

    /**
     * Constructs the organisation client in the Utils class, to use the built-in
     * methods.
     */
    constructOrgClient() {
        const chaincode1 = new utils.orgClient(config.Org2.channel.channelName, config.orderer0,
            config.Org2.peer, config.Org2.ca, config.Org2.admin);
        return chaincode1;
    }

}

module.exports = { revocation }

revoke = new revocation("example1.org","eff36db759de424bd696361afdccfd14a2a92a26","keyCompromise")