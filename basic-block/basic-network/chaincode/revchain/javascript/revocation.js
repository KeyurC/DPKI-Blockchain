/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const forge = require('node-forge');

var Revocation = class {

  // Initialize the chaincode
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    let args = ret.params;
    let Hash = args[0];
    let CN = args[1];

    try {
      await stub.putState(CN, Buffer.from(Hash));
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
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

  async invoke(stub, args) {
    let CN = args[0];
    let Hash = args[1];

    await stub.putState(CN, Buffer.from(Hash));
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
