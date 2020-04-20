const path = require('path');
const utils = require('../utilities/IBMUtils.js');
const { config } = require('../utilities/config.js');
const forge = require('node-forge');
const hash = require('object-hash');
const fs = require('fs');

/**
 * Class is responsible for communicating with the blockchain,
 * and send the CSR to the blockchain for it to be signed and verified.
 */
class ClientRequestHandler {

    constructor(CSR, domain, enabled) {
        this.request = CSR;
        this.domain = domain;
        this.RAEnabled = enabled;
    }

    /**
     * Function invokes the chaincode in order for the request,
     * to be signed and stored in the blockchain.
     */
    async invokeChaincode() {
        const orgC = this.constructOrgClient();
        await orgC.login();
        await orgC.getOrgAdmin();
        let hashedSubject = this.generateHashOfCSR();
        let peer = await this.SelectPeer();
        await orgC.transaction(config.Org1.chaincode.chaincodeId, config.Org1.chaincode.dchaincodeVersion, 'invoke', peer, this.request, hashedSubject, this.RAEnabled);
    }

    /**
     * Function chooses a random peer which will be responsible for signing
     * certificates
     */
    async SelectPeer() {
        let peers = await new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname,'../utilities/Containers.json'), 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
        let selected = Math.floor(Math.random() * 2) + 1
        let peerList = JSON.parse(peers);
        let join = "Container"+selected.toString();
        console.log(join);
        return peerList[join].ID;

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

    /**
     * The Function generates a hash of the company information within the
     * CSR.
     */
    generateHashOfCSR() {
        let CSR = forge.pki.certificationRequestFromPem(this.request);
        let subject = CSR.subject.attributes;
        let hasedSubject = hash(subject);
        return hasedSubject;
    }
}
module.exports = ClientRequestHandler