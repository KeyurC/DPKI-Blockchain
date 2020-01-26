const chai = require('chai');
var expect = chai.expect;
chai.expect.tr
const CA = require('./../CA.js');
const forge = require('node-forge');

//Test checks if private key is not null and undefined
describe('KeyUndefinedTest', function () {
    it('Generate Keys should return a private and public key', function () {
        const ca = new CA();
        ca.generateKeyPair();
        var pass = ca.keys.publicKey !== null && ca.keys.privatekey !== null;
        expect(pass).to.true;
    })
})

//Test checks if private key converted to pem format is not empty
describe('KeyLengthTest', function () {
    it('Keys returned should be valid and correct format', function () {
        const ca = new CA();
        ca.generateKeyPair();
        var privateKey = forge.pki.privateKeyToPem(ca.keys.privateKey);
        expect(privateKey.length).greaterThan(0);
    })
})

//Test passes if certificate returned is not null/undefined
describe('CertificateUndefinedTest', function () {
    it('Certificate should not be empty or undefined/null', function () {
        const ca = new CA();
        ca.generateKeyPair();
        var cert = forge.pki.certificateFromPem(ca.selfsign().certificate);
        var pass = cert !== null;
        expect(pass).to.true;
    })
})

//Test checks if data has been retained and can be retrieved
describe('CertificateConfidentialityTest', function () {
    it('Keys returned should be valid and correct format', function () {
        const caValue = ['CA','CertificateAuthority','UK']
        const ca = new CA();
        ca.generateKeyPair();
        var cert = forge.pki.certificateFromPem(ca.selfsign().certificate);
        let valid = true;
        for (let i = 0; i < caValue.length; i++) {
            if (caValue[i] != cert.subject.attributes[i].value) {
                valid = false;
                break;
            }
        }
        expect(valid).to.true;
    })
})


