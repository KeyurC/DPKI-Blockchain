const ClientRequestHandler = require('../ClientRequestHandler');
const Queries = require('./Queries');

const query = new Queries();

/**
 * Function manages the creation of certificates,
 * The function acts as an Adapter as it uses different functions
 * and classes.
 */
class Certificate {

    constructor(requestJson, enabled) {
        this.request = requestJson.certreq;
        this.commonName = requestJson.cn;
        this.RAEnabled = enabled;
    }

    /**
     * Function handles generation and retrieval of certificate
     */
    async generateCertificate() {
        const handler = new ClientRequestHandler(this.request,
            this.commonName, this.RAEnabled);

        await handler.invokeChaincode();
        //Sleep needed for new chaincode to invoke
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        let response = await query.queryCADB(this.commonName);
        console.log(response)
        if (typeof response == 'undefined') {
            return "Failed verification, Please ensure that you have generated a new page, with the correct secret value";
        } else {
            return response;
        }
    }

}
module.exports = Certificate;