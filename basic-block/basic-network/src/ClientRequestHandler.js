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

    constructor(CSR, domain) {
        this.request = CSR;
        this.domain = domain;
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
        await orgC.transaction(config.Org1.chaincode.chaincodeId, config.Org1.chaincode.dchaincodeVersion, 'invoke', peer, this.request, hashedSubject);
    }

    async SelectPeer() {
        let peers = await new Promise((resolve, reject) => {
            fs.readFile('../utilities/Containers.json', 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });

        let peerList = JSON.parse(peers);
        return peerList["Container1"].ID;

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

    generateHashOfCSR() {
        let CSR = forge.pki.certificationRequestFromPem(this.request);
        let subject = CSR.subject.attributes;
        let hasedSubject = hash(subject);
        console.log(hasedSubject);
        return hasedSubject;
    }
}
module.exports = ClientRequestHandler