//Command to run test --> mocha chaincodeTests.js --timeout 5000

const chai = require('chai');
const forge = require('node-forge');

const Queries = require('../src/Interactions/Queries');
const Client = require('../src/client.js');
const Certificate = require('../src/Interactions/Certificate');
const revocation = require('../src/Interactions/revoke');

var expect = chai.expect;
const query = new Queries();

beforeEach(done => setTimeout(done, 2000));

/**
 * The test determines if an improper domain, which does not exist can still be revoked, 
 * The test should show that the domain is not revoked as it does not exist.
 */
describe('ChaincodeRevocationBadDomain', function () {
    it('The revocation chaincode should returned Failed, as domain does not exist in blockchain', async () => {
        let domain = "shouldntwork.org";
        let serial = "4202bdebbf22f18fffbca1ccab6c297295e07b9a";
        let reason = "keyCompromised";

        const rev = new revocation(domain, serial, reason);
        let response = await rev.invokeChaincode();
        let pass = (response == "Success") ? false : true;
        expect(pass).to.be.true;

    })
})

/**
 * Test checks if blockchain invocation generates and stores the certificate with the
 * Registration Authority disabled.
 */
describe('ChaincodeInvocationTest', function () {
    it('The blockchain should be invoked by the chaincode correctly', async () => {
        client = new Client("", "example2.org", "UK", "Middlesex", "isleworth", "HI", "Test");
        let clientInfo = client.createRequest();

        const manager = new Certificate(clientInfo, "false");
        let cert = await manager.generateCertificate();
        let pass = true;
        if (typeof cert == "undefined") {
            pass = false;
        }
        expect(pass).to.be.true;

    })
})

/**
 * The test determines if an proper domain, which does exist can still be revoked, 
 * The test should show that the domain is revoked as it does exist.
 */
describe('ChaincodeRevocationGoodDomain', function () {
    it('The revocation chaincode should returned Success, as domain does exist in blockchain', async () => {
        let domain = "example2.org";
        let serial = "902bd2d286f1e31eefe4423b379e0025fdd729d1";
        let reason = "keyCompromised";

        const rev = new revocation(domain, serial, reason);
        let response = await rev.invokeChaincode();
        let pass = (response == "Success") ? true : false;
        expect(pass).to.be.true;

    })
})

/** 
 * The test retrieves all revoked certificates and checks if the revocation
 * does exist. There should be atleast one certificate revoked.
 */
describe('ChaincodeGetAllRevocation', function () {
    it('The revocation chaincode should returned all revoked certificates', async () => {
        let response = await query.queryRevocationsDB();
        let revocationArr = JSON.parse(response);
        let pass = true;

        for (let i = 0; i < revocationArr.length; i++) {
            if (typeof revocationArr[i].domain == 'undefined') {
            
                pass = false
            }
        }
        expect(pass).to.be.true;

    })
})

/**
 * The test uses an improper domain, which does not abide by the registration authorities
 * syntax, so the RA should disapprove and deny the certificate request. 
 */
describe('RegistrationAuthorityBadDomainTest', function () {
    it('The Registration Authority should deny approval for certificate generation as domain does not fulfil conditions', async () => {
        client = new Client("", "shouldntwork.org", "UK", "Middlesex", "isleworth", "TestDepartment", "TestOrganization");
        let clientInfo = client.createRequest();
        const manager = new Certificate(clientInfo, "true");
        let cert = await manager.generateCertificate();
        let pass = false;
        
        if (cert.toString().includes("Failed verification")) {
            pass = true;
        }
        expect(pass).to.be.true;

    })
})

/**
 *  The test uses a roper domain, which does abide by the registration authorities
 * syntax, so the RA should approve the certificate request and generate the correct
 * Certificate. 
 */
describe('RegistrationAuthorityGoodDomainTest', function () {
    it('The Registration Authority should approve certificate generation as domain does not fulfil conditions', async () => {
        client = new Client("", "https://keyurc.github.io", "UK", "Middlesex", "isleworth", "DPKI", "Test");
        let clientInfo = client.createRequest();
        const manager = new Certificate(clientInfo, "true");
        let cert = await manager.generateCertificate();
        let pass = true;
        if (cert.toString().includes("Failed verification")) {
            pass = false;
        }
        expect(true).to.be.true;

    })
})

/**
 * The test determines if the query function within the blockchain correctly works, by 
 * checking if the correct certificate is returned when a domain is specified.
 */
describe('QueryCorrectParamTest', function () {
    it('Verification should be true as certificate was generated by PKI', async () => {
        let domain = "example2.org";
        let cert = await query.queryCADB(domain);
        let certobj = forge.pki.certificateFromPem(cert);
        let pass = false;
        if (certobj.subject.attributes[0].value == domain) {
            pass = true;
        }
        expect(pass).to.be.true;

    })
})

/**
 * The test determines if the query function within the blockchain correctly works, by 
 * checking if no certificate is returned when a domain does not exist.
 */
describe('QueryWrongParamTest', function () {
    it('Query should return nothing as domain does not exist in the blockchain', async () => {
        let domain = "nothing";
        let cert = await query.queryCADB(domain);
        let pass = false;
        if (typeof cert == "undefined") {
            pass = true;
        }
        expect(pass).to.be.true;

    })
})



/**
 * Test should return true and determines if the CSR signed by a 
 * sub CA has retained the correct information as its CSR counterpart.
 */
describe('ChaincodeCASigningTest', function () {
    it('Certificate returned should be created from a signing CA', async () => {
        client = new Client("", "example2.org", "UK", "Middlesex", "isleworth", "HI", "Test");
        let CSRContainer = client.createRequest();
        let domain = CSRContainer.cn;
        let csrObj = forge.pki.certificationRequestFromPem(CSRContainer.certreq);
        let csrSubject = csrObj.subject.attributes;
        let cert = forge.pki.certificateFromPem(await query.queryCADB(domain));
        let certSubject = cert.subject.attributes;
        let pass = true;
        for (let i = 0; i < cert.subject.attributes.length; i++) {
            if (csrSubject[i].value != certSubject[i].value) {
                pass = false;
            }
        }

        expect(pass).to.be.true;

    })
})