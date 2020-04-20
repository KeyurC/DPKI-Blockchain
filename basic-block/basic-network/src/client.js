"use strict";

const forge = require('node-forge');

/**
 * This class is responsible for generating a CSR based on
 * client information provided.
 */
class Client {
  constructor(keys = "", CN, country, state,
    locality, org, ou) {
    this.keys = keys;
    this.cn = CN;
    this.country = country;
    this.state = state;
    this.locality = locality;
    this.org = org;
    this.ou = ou;
  }

  /**
   * Function generates a CSR request
   */
  createRequest() {
    if (this.keys == "") {
      this.generateKeyPair()
    }
    let request = this.generateCSR();
    return request;
  }

  /**
   * Function generates a pair of private and public keys
   */
  generateKeyPair() {
    this.keys = forge.pki.rsa.generateKeyPair(1024);
  }

  /**
   * Returns the CSR 
   */
  getCertificateRequest() {
    return this.CSR;
  }

  /**
   * Function generates a CSR request
   */
  generateCSR() {
    var certificateReq = forge.pki.createCertificationRequest();
    certificateReq.publicKey = this.keys.publicKey;
    certificateReq.setSubject([{
      name: 'commonName',
      value: this.cn
    }, {
      name: 'countryName',
      value: this.country
    }, {
      shortName: 'ST',
      value: this.state
    }, {
      name: 'localityName',
      value: this.locality
    }, {
      name: 'organizationName',
      value: this.org
    }, {
      shortName: 'OU',
      value: this.ou
    }]);

    certificateReq.sign(this.keys.privateKey)

    this.CSR = {
      certreq: forge.pki.certificationRequestToPem(certificateReq),
      cn: certificateReq.subject.attributes[0].value
    };
    return this.CSR;
  }

}

module.exports = Client;