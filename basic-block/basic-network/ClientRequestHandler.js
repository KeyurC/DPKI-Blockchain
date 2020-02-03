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
        let SubCACrypto = await this.CASelectionAlgo();
        await orgC.invoke(config.chaincodeId,config.chaincodeVersion,'invoke',this.domain,this.request,SubCACrypto);

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

    /**
     * Function determines what signing CA, should be used for 
     * the signing of the request. Random for now, but will use a 
     * better algorithm in future iterations.
     */
    async CASelectionAlgo() {
        const queryObj = new query.Query();

        let CADomain = "SubCA";
        let randomInt = Math.floor(Math.random() * 3);
        console.log(randomInt);
        let chosenCA = CADomain.concat('',randomInt);
        
        let cryptoMaterial = await queryObj.queryCC(chosenCA);
        let pem = JSON.parse(cryptoMaterial);
        return pem;
    }
}

module.exports = {ClientRequestHandler}