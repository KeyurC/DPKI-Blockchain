const path = require('path');
const queries = require("./Queries");
const utils = require('../../utilities/IBMUtils');
const { config } = require('../../utilities/config.js');

/**
 * Class is responsible for communicating with the blockchain,
 * and send the CSR to the blockchain for it to be signed and verified.
 */
class revocation {

    constructor(domain,serial,reason) {
        this.domain = domain;
        this.serial = serial;
        this.reason = reason;
    }

    /**
     * Function invokes the chaincode in order for the request,
     * to be signed and stored in the blockchain.
     */
    async invokeChaincode() {
        let query = new queries();
        const orgC = this.constructOrgClient();
        await orgC.login();
        await orgC.getOrgAdmin();

        let response = await query.queryCADB(this.domain);
        if (typeof response != 'undefined') {
            await orgC.transaction(config.Org2.chaincode.chaincodeId, config.Org2.chaincode.dchaincodeVersion, 'invoke', this.domain, this.serial, this.reason);
            return "Success";
        } else {
            return "Failed";
        }
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

module.exports = revocation

// revoke = new revocation("example1.org","eff36db759de424bd696361afdccfd14a2a92a26","keyCompromise")