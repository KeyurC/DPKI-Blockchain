"use strict";

const forge = require('node-forge');
const CA = require('./CA.js');
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
    this.main();
  }

  main() {
    this.generateKeyPair();
    let request = this.generateCSR();
    new clientHandler.ClientRequestHandler(request.certreq, request.cn);
  }

  generateKeyPair() {
    this.keys = forge.pki.rsa.generateKeyPair(1024);
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

    var CSR = {
      certreq: forge.pki.certificationRequestToPem(certificateReq),
      cn: certificateReq.subject.attributes[0].value
    };
    return CSR;
  }

}

module.exports = {Client};
const client = new Client();