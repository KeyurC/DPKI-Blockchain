const chai = require('chai');
var expect = chai.expect;
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
describe('CertificateIntegrityTest', function () {
    it('Certificate returned has wrong attributes', function () {
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

//Test checks if number of sub CA's returned is equal to requested amount
describe('SubCALengthTest', function () {
    it('Certificate returned has wrong attributes', function () {
        let CANumber = 3;
        const ca = new CA();
        ca.generateKeyPair();
        ca.selfsign();
        let subCaList = ca.generateSubCA(CANumber);
        expect(subCaList.length).to.equal(CANumber);
    })
})

//Test checks if the sub ca's have been issued by the root ca using certificate path
//verification. 
describe('CertificateChainVerificationTest', function () {
    it('Certificate returned has not been issued by the root CA', function () {
        let CANumber = 3;
        const ca = new CA();
        ca.generateKeyPair();
        let caCert = forge.pki.certificateFromPem(ca.selfsign().certificate);
        let subCaList = ca.generateSubCA(CANumber);
        let caStore = forge.pki.createCaStore([caCert]);
        let verified = false;
        for (let i = 0; i < subCaList.length; i++) {
            let subCert = forge.pki.certificateFromPem(subCaList[i].certificate);
            verified = forge.pki.verifyCertificateChain(caStore,[subCert]);
            if (verified !== true) {
                break;
            }
        }
        expect(verified).to.true;
    })
})

//Test checks if the attributes set in the sub ca certificates are correct
describe('SubCertificateIntegrityTest', function () {
    it('Certificate returned has wrong attributes', function () {
        let CANumber = 3
        const caValue = ['SubCA','SubCertificateAuthority','UK']
        const ca = new CA();
        ca.generateKeyPair();
        ca.selfsign();
        let subCaList = ca.generateSubCA(CANumber);
        let valid = true;
        for (let i = 0; i < CANumber; i++) {
            caValue[0] = 'SubCA' + i.toString();
            let subcert = forge.pki.certificateFromPem(subCaList[i].certificate);
            for (let x = 0; x < caValue.length; x++)
            if (caValue[i] != subcert.subject.attributes[i].value) {
                valid = false;
                break;
            }
        }
        expect(valid).to.true;
    })
})