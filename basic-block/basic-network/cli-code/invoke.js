const utils = require('../utilities/IBMUtils.js');
const {config} = require('../utilities/config.js');
const query = require('./query.js')
const forge = require('node-forge');
orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);


class Invoke {


    async verify(certificate) {
        await orgC.login();
        await orgC.getOrgAdmin();
        return await orgC.transaction(config.chaincodeId,config.chaincodeVersion,'verify',certificate);

    }
}

module.exports = {Invoke}

async function verifyTest() {
    // let cert = "-----BEGIN CERTIFICATE-----MIICMzCCAZygAwIBAgIJALiPnVsvq8dsMA0GCSqGSIb3DQEBBQUAMFMxCzAJBgNVBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNVBAcTA2ZvbzEMMAoGA1UEChMDZm9vMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2ZvbzAeFw0xMzAzMTkxNTQwMTlaFw0xODAzMTgxNTQwMTlaMFMxCzAJBgNVBAYTAlVTMQwwCgYDVQQIEwNmb28xDDAKBgNVBAcTA2ZvbzEMMAoGA1UEChMDZm9vMQwwCgYDVQQLEwNmb28xDDAKBgNVBAMTA2ZvbzCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAzdGfxi9CNbMf1UUcvDQh7MYBOveIHyc0E0KIbhjK5FkCBU4CiZrbfHagaW7ZEcN0tt3EvpbOMxxc/ZQU2WN/s/wPxph0pSfsfFsTKM4RhTWD2v4fgk+xZiKd1p0+L4hTtpwnEw0uXRVd0ki6muwV5y/P+5FHUeldq+pgTcgzuK8CAwEAAaMPMA0wCwYDVR0PBAQDAgLkMA0GCSqGSIb3DQEBBQUAA4GBAJiDAAtY0mQQeuxWdzLRzXmjvdSuL9GoyT3BF/jSnpxz5/58dba8pWenv3pj4P3w5DoOso0rzkZy2jEsEitlVM2mLSbQpMM+MUVQCQoiG6W9xuCFuxSrwPISpAqEAuV4DNoxQKKWmhVv+J0ptMWD25Pnpxeq5sXzghfJnslJlQND-----END CERTIFICATE-----"
    const invoke = new Invoke();
    const query1 = new query.Query();
    let cert = await query1.queryCC("example1.org");
    let pem = forge.pki.certificateFromPem(cert);
    // console.log(pem);
    // let pem = forge.pki.certificateFromPem(cert);
    // cert = forge.pki.certificateToPem(pem);
    // console.log(pem.issuer.attributes[0].value);
    let response = await invoke.verify(cert);
    console.log(response.toString());
}
verifyTest();