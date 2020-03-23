const Client = require('../client');
const ClientRequestHandler = require('../ClientRequestHandler');
const Queries = require('./Queries');
const query = new Queries();

class Certificate {

    constructor(requestJson) {
        this.request = requestJson.certreq;
        this.commonName = requestJson.cn;
    }

    async generateCertificate() {
        const handler = new ClientRequestHandler(this.request,
            this.commonName);

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