"use strict";

const forge = require('node-forge');
const clientHandler = require('./ClientRequestHandler.js')
const Invoke = require('../cli-code/testQuery')

class Client {
  constructor(keys = "", CN , country, state,
    locality, org, ou) {
    this.keys = keys;
    this.cn = CN;
    this.country = country;
    this.state = state;
    this.locality = locality;
    this.org = org;
    this.ou = ou;
  }

  async main() {
    if (this.keys == "") {
      this.generateKeyPair();
    }
    let request = this.generateCSR();
    const Handler = new clientHandler.ClientRequestHandler(request.certreq, request.cn);
    await Handler.invokeChaincode();

    let query = new Invoke.Invoke();
    let response = await query.verify(request.cn);
    if (typeof response == 'undefined') {
      return "Failed verification, Please ensure that you have generated a new page, with the correct secret value";
    } else {
      return response;
    }
  }

  getResponse() {
    return this.response;
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
// const client  = new Client();
// client.main();