"use strict";

const forge = require('node-forge');

/**
 * The class is responsible for generating signing certificates responsible
 * for the PKI hierarchy. 
 */
class CA {
    constructor(keys = "") {
        this.keys = keys;
        this.CA = null;
    }

    /**
     * The function generates public and private key pair
     */
    generateKeyPair() {
        this.keys = forge.pki.rsa.generateKeyPair(1024);
    }

    /**
     * Function creates a self signed certificate, which will act
     * as the ROOT Certificate.
     */
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

          return this.CA;
    }

    /**
     * Function generates intermediate certificates based on a Self-Signed ROOT
     * Certificate, 
     * @param {integer} number 
     */
    generateSubCA(number) {
      let subCaList = [];

      for (let i = 0; i < number; i++) {
        let commonName = "SubCA" + i.toString();
        let keys = forge.pki.rsa.generateKeyPair(1024);

        //Root CertificateAuthority certificate and private key
        let CA = forge.pki.certificateFromPem(this.CA.certificate);
        let PK = forge.pki.privateKeyFromPem(this.CA.privateKey);

        //Create new certificate
        let cert = forge.pki.createCertificate();
        cert.publicKey = keys.publicKey;
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        cert.setSubject([{
            name: 'commonName',
            value: commonName
          }, {
            name: 'organizationName',
            value: "SubCertificateAuthority"
          }, {
            shortName: 'C',
            value: 'UK'
          }]);
          //Set issuer as root certificate and sign using root pk
          cert.setIssuer(CA.issuer.attributes);
          cert.sign(PK);
          
          let serial = "S"+ i + "0000";

          let pem = {
            certificate: forge.pki.certificateToPem(cert),
            privateKey: forge.pki.privateKeyToPem(keys.privateKey),
            serial : serial
          }
          subCaList.push(pem);

      }
      return subCaList;
    }


}

module.exports = CA