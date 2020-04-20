const fs = require('fs');
const shim = require('fabric-shim');
const forge = require('node-forge');
const crypto = require("crypto");
const os = require('os');
const request = require("request-promise");

const ra = new RegistrationAuthority();
const ca = new CertificateAuthority();
const file = new Utilities();
const databaseTemplate = '[]';
const hostname = os.hostname[Symbol.toPrimitive]("String");

var ABstore = class {

  /**
   * Chaincode Init function sets up certificate database and
   * generates a new certificate for the peer alongside private key
   * to be used for CA responsibilities.
   * @param {*} stub 
   */
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let args = ret.params;
    let CAList = args[0];
    let tmpList = JSON.parse(CAList);
    let hostname = os.hostname;

    let keys = forge.pki.rsa.generateKeyPair(1024);
    let privateKey = forge.pki.privateKeyToPem(keys.privateKey);
    let publicKey = forge.pki.publicKeyToPem(keys.publicKey);

    try {
      file.writeFile('database.json', databaseTemplate);
      file.writeFile('public.pem', publicKey);
      file.writeFile('private.pem', privateKey);
    } catch (err) {
      console.log("creation of core files failed");
      throw (err);
    }

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

    file.writeFile('certificate.pem', pemFormatCert);

    try {
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }

  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  /**
   * Function determines if the peer has the right to sign a 
   * certificate request and if so generates a certificate and
   * updates the database and adds the serial to the chaincode.
   * The serial is a hash of the certificate subject so any modification
   * of the subject causes the process to fail.  
   * @param {*} stub 
   * @param {*} args 
   */
  async invoke(stub, args) {
    let peer = args[0];
    let hashed = args[2];
    let enabled = args[3];
    console.log("TEST" + enabled);
    let domain = "";

    try {
      let certreq = forge.pki.certificationRequestFromPem(args[1])
      domain = certreq.subject.attributes[0].value.toString();
      let verify = await stub.getState(domain);
      console.log(enabled);
      ra.setValues(domain, hashed, enabled);
      let RAResponse = await ra.validateCSR();

      if (!RAResponse) {
        return Buffer.from("Please generate a page with the correct name and context");
      }

      if (peer == hostname && verify.toString() == "") {
        let privateKey = await file.readFile('private.pem');
        let certificate = await file.readFile('certificate.pem')

        ca.setAllValues(domain, certreq, hashed, privateKey, certificate);
        let cert = ca.sign();

        await file.updateDatabase(hashed, cert);

        // return Buffer.from(forge.pki.certificateToPem(cert));
      }
    } catch (err) {
      console.log(err);
      return Buffer.from("Unable to complete transaction for certificate generation");
    }

    await stub.putState(domain, Buffer.from(hashed));
  }

  /**
   * Function uses the serial retrieved from the chaincode as a key
   * in order to query the database and return the certificate.
   * Using the serial from the chaincode validates the certificate
   * Any database lacking the serial will return the serial as not
   * all peers will have every certificate. 
   * @param {*} stub 
   * @param {*} args 
   */
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let A = args[0];

    let Avalbytes = await stub.getState(A);

    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + A;
      throw new Error(JSON.stringify(jsonResp));
    }

    let database = await file.readFile("database.json")

    let db = JSON.parse(database);
    let keys = Object.keys(db);

    for (keys in db) {
      let payload = Avalbytes.toString().trim();
      let serial = db[keys].Serial.trim();

      if (serial == payload) {
        return Buffer.from(db[keys].Certificate);
      }
    }

    jsonResp.name = A;
    jsonResp.amount = Avalbytes.toString();
    console.info('Query Response:');
    console.info(jsonResp);
    return Avalbytes;
  }

};


function CertificateAuthority() {

  this.setDomain = function (domain) {
    this.domain = domain;
  }

  this.setRequest = function (CSR) {
    this.request = CSR;
  }

  this.setHash = function (hash) {
    this.hash = hash;
  }

  this.setPrivateKey = function (privateKey) {
    this.privateKey = forge.pki.privateKeyFromPem(privateKey);
  }

  this.setSigningCert = function (certificate) {
    this.signCert = forge.pki.certificateFromPem(certificate);
  }

  this.setAllValues = function (domain, CSR, hash, privateKey, certificate) {
    this.setDomain(domain);
    this.setRequest(CSR);
    this.setHash(hash);
    this.setPrivateKey(privateKey);
    this.setSigningCert(certificate);
  }

  this.sign = function () {
    let cert = forge.pki.createCertificate();
    cert.publicKey = this.request.publicKey;
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.serialNumber = Buffer(this.hash).toString('hex');
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    cert.setSubject(this.request.subject.attributes);
    cert.setIssuer(this.signCert.subject.attributes);
    cert.sign(this.privateKey);

    return cert;
  }


}

function RegistrationAuthority() {
  this.divider = 4;

  this.setDomain = function (domain) {
    let tag = domain.substr(domain.length - 1, domain.length);
    if (tag == '/') {
      return domain;
    } else {
      return domain + "/";
    }
  };

  this.setHash = function (domain) {
    return objectHash(domain);
  }

  this.setValues = function (domain, hash, enabled) {
    this.enabled = enabled;
    this.hash = hash;
    this.domain = this.setDomain(domain);
  }

  this.getPage = function () {
    return this.hash.substr(0, this.divider);
  }

  this.getSecret = function () {
    return this.hash.substr(this.divider, this.hash.length);
  }

  this.validateCSR = async function () {
    let validated = false;
    let secret = this.getSecret();
    let page = this.getPage()
    await request({
      uri: this.domain + page + ".html",
    }, function (err, response, body) {
      let content = (typeof body != 'undefined') ? body.toString() : "";
      validated = (content.includes(secret)) ? true : false;
    }).catch(err => {
      validated = false;
    })

    console.log("ENABLING " + this.enabled.toString());

    if (this.enabled.toString() == "true") {
      return validated;
    } else {
      return true;
    }
  }

}


/**
 * The class contains basic functions used by 
 * the chaincode numerous times.
 */
function Utilities() {
  this.password = crypto.randomBytes(64).toString('hex');;

  /** 
   * Generates a new file
   * @param name name of the file created
   * @param input input of the file
  */
  this.writeFile = function (name, input, encrypt) {
    let e = this.encrypt(input);
    fs.writeFile(name.toString(), e, function (err) {
      if (err) throw err;
      console.log(name + ' is created successfully.');
    });

  }

  /**
   * Ecrypts sensitive data using AES-CBC
   * @param data plaintext
   */
  this.encrypt = function (data) {
    try {
      var cipher = crypto.createCipher('aes-256-cbc', this.password);
      var encrypted = cipher.update(data);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return encrypted.toString('hex');
    } catch (exception) {
      throw new Error(exception.message);
    }

  }

  /**
  * Decrypts sensitive data using AES-CBC
  * @param data ciphertext
  */
  this.decrypt = function (data) {
    try {
      let encryptedText = Buffer.from(data, 'hex');
      var decipher = crypto.createDecipher("aes-256-cbc", this.password);
      var decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return decrypted.toString();
    } catch (exception) {
      throw new Error(exception.message);
    }
  }

  /** 
   * reads exisiting file
   * @param name name of the file
  */
  this.readFile = async function (name) {
    let read = await new Promise((resolve, reject) => {
      fs.readFile(name, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let data = this.decrypt(read);
    return data;
  }

  /**
   * The function reads and updates the existing database
   * @param hashed serial
   * @param cert certificate generated from certificate request.
   */
  this.updateDatabase = async function (hashed, cert) {
    let database = await this.readFile("database.json")

    let insert = '{ "Serial":" ' + hashed + '","Certificate":"' + forge.pki.certificateToPem(cert).replace(/\n|\r/g, '') + '"}';
    let currentData = database.substring(0, database.length - 1);
    let newEntry = insert;
    let updated;

    if (databaseTemplate.length === database.length) {
      updated = currentData + newEntry + ']';
    } else {
      updated = currentData + ',' + newEntry + ']';
    }

    this.writeFile('database.json', updated);

  }

}

shim.start(new ABstore());

