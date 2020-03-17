const shim = require('fabric-shim');
const fs = require('fs');
let template = "[]";

/**
 * The class handles the certificate revocation aspect
 * of the PKI system.
 */
var Revocation = class {

  /**
   * Instantiate function generates key file to store all keys
   * of the blockchain in.
   * @param {} stub 
   */
  async Init(stub) {
    fs.writeFile("keys", template, function (err) {
      if (err) throw err;
      console.log('key is created successfully.');
    });

    return shim.success();
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
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  /**
   * Invoke function adds relevent information about certificate
   * to the blockchain using the common name as the key.
   * @param {*} stub 
   * @param {*} args 
   */
  async invoke(stub, args) {
    let date = Date.now();
    let CN = args[0];
    let serial = args[1];
    let reason = args[2];

    let database = await new Promise((resolve, reject) => {
      fs.readFile("keys", 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let insert = '"' + CN + '"';
    let currentData = database.substring(0, database.length - 1);
    let newEntry = insert;
    let updated;

    if (template.length === database.length) {
      updated = currentData + newEntry + ']';
    } else {
      updated = currentData + ',' + newEntry + ']';
    }

    console.log(updated);

    let certificateRevocation = {
      serial: serial,
      date: date,
      reason: reason
    }

    fs.writeFile("keys", updated, function (err) {
      if (err) throw err;
      console.log('database is created successfully.');
    });

    await stub.putState(CN, Buffer.from(JSON.stringify(certificateRevocation)));
  }

  /**
   * The function uses the key file to retrieve all revoked certificates
   * within the chaincode.
   * @param {*} stub 
   * @param {*} args 
   */
  async getAllRevokedCertificates(stub, args) {
    let filter = args[0];

    let keys = await new Promise((resolve, reject) => {
      fs.readFile("keys", 'utf8', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let db = JSON.parse(keys);

    let list = [];

    for (let i = 0; i < db.length; i++) {
      console.log(db[i]);
      let tmp = await stub.getState(db[i]);
      let revoke = JSON.parse(tmp.toString());
      let tmpList = {
        domain: db[i],
        reocation: tmp.toString()
      };

      if (typeof filter != 'undefined') {
        if (revoke.reason == filter) {
          list.push(tmpList);
        }
      } else {
        list.push(tmpList);
      }
    }

    return Buffer.from(JSON.stringify(list));

  }

  /**
   * Queries a singular revoked certificate 
   */
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let A = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
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

shim.start(new Revocation());
