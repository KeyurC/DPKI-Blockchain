/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const fs = require('fs');
const shim = require('fabric-shim');
const crypto = require('crypto');
const forge = require('node-forge');
const hash = require('object-hash');
const os = require('os');

const CADomain = "SubCA";
const databaseTemplate = '{"Certificates":[]}';

var ABstore = class {

  // Initialize the chaincode
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let args = ret.params;
    let CAList = args[0];
    let CN = args[1];
    let tmpList = JSON.parse(CAList);
    let hostname = os.hostname;

    let keys = forge.pki.rsa.generateKeyPair(1024);
    let privateKey = forge.pki.privateKeyToPem(keys.privateKey);
    let publicKey = forge.pki.publicKeyToPem(keys.publicKey);

    fs.writeFile('database.json', databaseTemplate, function (err) {
      if (err) throw err;
      console.log('Database is created successfully.');
    });

    fs.writeFile('public.pem', publicKey, function (err) {
      if (err) throw err;
      console.log('Public Key File has bean created.');
    });

    fs.writeFile('private.pem', privateKey, function (err) {
      if (err) throw err;
      console.log('Private Key File has been created.');
    });

    let certificate = forge.pki.certificateFromPem(tmpList[1].certificate);
    let pk = forge.pki.privateKeyFromPem(tmpList[1].private_key);


    let cert = forge.pki.createCertificate();
    cert.publicKey = certificate.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    cert.setSubject([{
      name: 'commonName',
      value: hostname
    }, {
      name: 'countryName',
      value: 'UK'
    }, {
      shortName: 'ST',
      value: 'MS'
    }, {
      name: 'organizationName',
      value: 'PKI'
    }, {
      shortName: 'OU',
      value: 'PKI-Blockchain'
    }]);

    cert.setIssuer(certificate.subject.attributes);
    cert.sign(pk);

    let pemFormatCert = forge.pki.certificateToPem(cert);


    fs.writeFile('certificate.pem', pemFormatCert, function (err) {
      if (err) throw err;
      console.log('certificate has been created.');
    });

    try {
      // for (let i = 0; i < tmpList.length - 1; i++) {
      //   let cn = "SubCA" + i;
      //   // console.log(tmpList[i]);
      //   let tmp = JSON.stringify(tmpList[i]);
      //   await stub.putState(cn, Buffer.from(tmp));
      // }

      // await stub.putState(CN, Buffer.from(JSON.stringify(tmpList[tmpList.length - 1])));
      console.log(hostname[Symbol.toPrimitive]("String"));
      let payload = Buffer.from(hostname[Symbol.toPrimitive]("String"));
      console.log(payload)
      return shim.success(payload);
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
    let hashed = args[2];
    try {
      certreq = forge.pki.certificationRequestFromPem(args[1])
    } catch (error) {
      console.error("Failed to obtain/convert CSR" + error)
    }

    let privateKey = await new Promise((resolve, reject) => {
      fs.readFile('private.pem', 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let certificate = await new Promise((resolve, reject) => {
      fs.readFile('certificate.pem', 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let signCert = forge.pki.certificateFromPem(certificate);

    let pk = forge.pki.privateKeyFromPem(privateKey);
    let cert = forge.pki.createCertificate();
    cert.publicKey = certreq.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.serialNumber = Buffer(hashed).toString('hex');
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    cert.setSubject(certreq.subject.attributes);
    cert.setIssuer(signCert.subject.attributes);
    cert.sign(pk);

    console.log(forge.pki.certificateToPem(cert));

    let database = await new Promise((resolve, reject) => {
      fs.readFile('database.json', 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let insert = '{"SerialNo":"' + hash + '","Certificate":"' + forge.pki.certificateToPem(cert) + '"}';

    let currentData = database.substring(0, database.length - 2);
    let newEntry = insert;
    let updated;

    if (databaseTemplate.length === database.length) {
      updated = currentData + newEntry + ']}';
    } else {
      updated = currentData + ',' + newEntry + ']}';
    }

    console.log(updated);

    fs.writeFile('database.json', updated, function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    });


    await stub.putState(CN, Buffer.from(hashed));
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
    } catch (e) {
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
