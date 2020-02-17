/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const forge = require('node-forge');
const CADomain = "SubCA";

var ABstore = class {

  // Initialize the chaincode
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let args = ret.params;
    let CAList = args[0];
    let CN = args[1];
    let tmpList = JSON.parse(CAList);
    console.log(tmpList[1]);
    try {
      for (let i = 0; i < tmpList.length - 1; i++) {
        let cn = "SubCA" + i;
        console.log(tmpList[i]);
        let tmp = JSON.stringify(tmpList[i]);
        await stub.putState(cn, Buffer.from(tmp));
      }

      await stub.putState(CN, Buffer.from(JSON.stringify(tmpList[tmpList.length - 1])));
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }

  }
  /**
   * 
   * @param {Certificate and Private Key list to parse and separate} value 
   */
  parse(value) {
    let CAList = [];
    for (let i = 1; CAList.length < 4; i++) {
      if (value[i] == '{') {
        let starttmp = i;
        let found = false;
        let end = 0;
        for (let x = i + 1; found == false; x++) {
          if (value[x] == '}') {
            end = x + 1;
            found = true;
          }
        }
        let tmp = value.substring(starttmp, end);
        CAList.push(tmp);
      }
    }
    return CAList;
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      console.log("PAYLOAD " + payload);
      console.log(await stub.getState('example1.org'));
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async invoke(stub, args) {
    let CN = args[0];
    let certreq;
    try {
      certreq = forge.pki.certificationRequestFromPem(args[1])
    } catch (error) {
      console.error("Failed to obtain/convert CSR" + error)
    }
    let randomInt = Math.floor(Math.random() * 3);
    let chosenCA = CADomain.concat('', randomInt);
    console.log(chosenCA);
    let test = await stub.getState(chosenCA);
    console.log("TEST HERE " + test);

    let pem = JSON.parse(test);

    let privateKey = forge.pki.privateKeyFromPem(pem.private_key);
    let rootCA = forge.pki.certificateFromPem(pem.certificate);
    let serial = pem.serial;
    let value = serial.substring(2, serial.length);
    let serialNo = parseInt(value) + 1;
    let defaultPadding = "0000";
    let padding = value.length - serialNo.toString().length
    let serialP2 = defaultPadding.substring(0, padding-1) + serialNo;
    let newSerial = serial.substring(0,2) + serialP2;

    let CA = {
      certificate: pem.certificate,
      private_key: pem.private_key,
      serial: newSerial
    }

    await stub.putState(chosenCA,Buffer.from(JSON.stringify(CA)));

    let cert = forge.pki.createCertificate();
    cert.publicKey = certreq.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.serialNumber = Buffer(serial).toString('hex');
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    cert.setSubject(certreq.subject.attributes);
    cert.setIssuer(rootCA.subject.attributes);
    cert.sign(privateKey);
    console.log(forge.pki.certificateToPem(cert));
    
    await stub.putState(CN, Buffer.from(forge.pki.certificateToPem(cert)));
  }


  async verify(stub, args) {
    let rootObj = JSON.parse(await stub.getState("ROOTCA"));
    let rootcert = forge.pki.certificateFromPem(rootObj.certificate);

    let cert = forge.pki.certificateFromPem(args[0]);

    let issuer = cert.issuer.attributes[0].value;
    let issuerObj = null;
    try {
      issuerObj = JSON.parse(await stub.getState(issuer));
    } catch (err) {
      console.log("Issuer does not exist or JSON Parsing fault");
      return Buffer.from("Certificate does not belong to us");
    }

    let issuerCert = forge.pki.certificateFromPem(issuerObj.certificate);

    let certVerified = issuerCert.verify(cert);
    if (certVerified) {
      if (!rootcert.verify(issuerCert)) {
        return Buffer.from("Certificate does not belong to us");
      }
    } else {
      return Buffer.from("Certificate does not belong to us");
    }
    return Buffer.from("Certificate belongs to us");
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let A = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);

    // Prevents any private keys being retrieved outside the blockchain

    let privatekey;

    try {
      privatekey = JSON.parse(Avalbytes).private_key;
    } catch(e) {
      console.log("Not a intermediate CA" + e);
    }
    if (typeof privatekey != 'undefined') {
      Avalbytes = Buffer.from(JSON.parse(Avalbytes).certificate);
    }

    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + A;
      throw new Error(JSON.stringify(jsonResp));
    }

    jsonResp.name = A;
    jsonResp.amount = Avalbytes.toString();
    console.info('Query Response:');
    console.info(jsonResp);
    return Avalbytes;
  }
};

shim.start(new ABstore());
