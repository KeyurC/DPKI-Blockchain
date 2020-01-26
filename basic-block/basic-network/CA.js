"use strict";

const forge = require('node-forge');

class CA {
    constructor(keys = "") {
        this.keys = keys;
        this.CA = null;
    }

    generateKeyPair() {
        this.keys = forge.pki.rsa.generateKeyPair(1024);
    }

    selfsign() {
        var cert = forge.pki.createCertificate();
        cert.publicKey = this.keys.publicKey;
        cert.serialNumber = '01';
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        cert.setSubject([{
            name: 'commonName',
            value: 'CA'
          }, {
            name: 'organizationName',
            value: "CertificateAuthority"
          }, {
            shortName: 'C',
            value: 'UK'
          }]);
          cert.setIssuer([{
            name: 'commonName',
            value: 'CA'
          }, {
            name: 'organizationName',
            value: "CertificateAuthority"
          }, {
            shortName: 'C',
            value: 'UK'
          }]);

          cert.sign(this.keys.privateKey);

         
          this.CA = {
              privateKey: forge.pki.privateKeyToPem(this.keys.privateKey),
              certificate: forge.pki.certificateToPem(cert)
          };

          // could encrypt private key
          return this.CA;
    }


}

module.exports = CA

// const ca = new CA();
// ca.generateKeyPair();
// ca.selfsign();