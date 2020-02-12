"use strict";

const forge = require('node-forge');
const clientHandler = require('./ClientRequestHandler.js')

class Client {
  constructor(keys = "", CN = "example1.org", country = "UK", state = "Middlesex",
    locality = "isleworth", org = "DPKI", ou = "Test") {
    this.keys = keys;
    this.cn = CN;
    this.country = country;
    this.state = state;
    this.locality = locality;
    this.org = org;
    this.ou = ou;
  }

  main() {
    this.generateKeyPair();
    let request = this.generateCSR();
    new clientHandler.ClientRequestHandler(request.certreq, request.cn);
  }

  generateKeyPair() {
    this.keys = forge.pki.rsa.generateKeyPair(1024);
  }

  get CertificateRequest() {
    return this.CSR;
  }

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