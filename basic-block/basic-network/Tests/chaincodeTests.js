const chai = require('chai');
var expect = chai.expect;
const CA = require('./../CA.js');
const utils = require('../IBMUtils.js');
const query = require('../query.js')
const { config } = require('../config.js');
const query1 = new query.Query();
orgC = new utils.orgClient(config.channelName, config.orderer0, config.Org1.peer, config.Org1.ca, config.Org1.admin);


//Test checks certificate is signed by a CA belonging to root CA,
//using a certificate chain.
//Test should pass as certificate is generated by sub CA.
describe('chaincodeVerificationTest', function () {
    it('Verification should be true as certificate was generated by PKI', async () => {
        let str = "Certificate belongs to us";
        let cert = await query1.queryCC("example1.org");
        let response = await verify(cert);
        let pass = false;
        if (response.toString() === str) {
            pass = true;
        }
        expect(pass).to.be.true;

    })
})

//Test checks certificate is signed by a CA belonging to root CA,
//using a certificate chain.
//Test should fail as certificate is not generated by sub CA.
describe('chaincodeVerificationFailingTest', function () {
    it('Verification should be false as certificate is not created by PKI', async () => {
        let str = "Certificate belongs to us";
        let cert = "-----BEGIN CERTIFICATE-----MIICMzCCAZygAwIBAgIJALiPnVsvq8dsMA0GCSqGSIb3DQEBBQUAMFMxCzAJBgNVBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNVBAcTA2ZvbzEMMAoGA1UEChMDZm9vMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2ZvbzAeFw0xMzAzMTkxNTQwMTlaFw0xODAzMTgxNTQwMTlaMFMxCzAJBgNVBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNVBAcTA2ZvbzEMMAoGA1UEChMDZm9vMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2ZvbzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAzdGfxi9CNbMf1UUcvDQh7MYBOveIHyc0E0KIbhjK5FkCBU4CiZrbfHagaW7ZEcN0tt3EvpbOMxxc/ZQU2WN/s/wPxph0pSfsfFsTKM4RhTWD2v4fgk+xZiKd1p0+L4hTtpwnEw0uXRVd0ki6muwV5y/P+5FHUeldq+pgTcgzuK8CAwEAAaMPMA0wCwYDVR0PBAQDAgLkMA0GCSqGSIb3DQEBBQUAA4GBAJiDAAtY0mQQeuxWdzLRzXmjvdSuL9GoyT3BF/jSnpxz5/58dba8pWenv3pj4P3w5DoOso0rzkZy2jEsEitlVM2mLSbQpMM+MUVQCQoiG6W9xuCFuxSrwPISpAqEAuV4DNoxQKKWmhVv+J0ptMWD25Pnpxeq5sXzghfJnslJlQND-----END CERTIFICATE-----";
        let response = await verify(cert);
        let pass = false;
        if (response.toString() === str) {
            pass = true;
        }
        expect(pass).to.be.false;

    })
})

async function verify(certificate) {
    await orgC.login();
    await orgC.getOrgAdmin();
    return await orgC.transaction(config.chaincodeId, config.chaincodeVersion, 'verify', certificate);
}