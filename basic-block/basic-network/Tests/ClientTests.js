const chai = require('chai');
const expect = chai.expect;
const Client = require('../src/client.js');
const forge = require('node-forge');

//Test checks if private key is not null and undefined
describe('KeyUndefinedTest', function () {
    it('Generate Keys should return a private and public key', function () {
        const client = new Client();
        client.generateKeyPair();
        let pass = client.keys.publicKey !== null && client.keys.privatekey !== null;
        expect(pass).to.true;
    })
})

//Test passes if certificate request returned is not null/undefined
describe('CSRUndefinedTest', function () {
    it('CSR should not be empty or undefined/null', function () {
        const client = new Client();
        client.generateKeyPair();
        let cert = forge.pki.certificationRequestFromPem(client.generateCSR().certreq);
        let pass = cert !== null;
        expect(pass).to.true;
    })
})

//Test checks if private key converted to pem format is not empty
describe('KeyLengthTest', function () {
    it('Keys returned should be valid and correct format', function () {
        const client = new Client();
        client.generateKeyPair();
        let privateKey = forge.pki.privateKeyToPem(client.keys.privateKey);
        expect(privateKey.length).greaterThan(0);
    })
})

//Test checks if csr contains the attributes initally used when created,
//ensuring integrity
describe('CertificateIntegrityTest', function () {
    it('Certificate request returned has wrong attributes', function () {
        const certValue = ['example1.org','UK','Middlesex','isleworth','DPKI','Test']
        const client = new Client();
        client.generateKeyPair();
        let cert = forge.pki.certificationRequestFromPem(client.generateCSR().certreq);
        let valid = true;
        for (let i = 0; i < certValue.length; i++) {
            if (certValue[i] != cert.subject.attributes[i].value) {
                valid = false;
                break;
            }
        }
        expect(valid).to.true;
    })
})
