/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Certchain extends Contract {

    async initLedger(ctx) {
        const certificates = [];
        await ctx.stub.putState(0, Buffer.from(JSON.stringify(certificates[0])));
    }

    async queryCertificates(ctx, certNo) {

        const certAsBytes = await ctx.stub.getState(certNo); // get the certificate from chaincode state
        if (!certAsBytes || certAsBytes.length === 0) {
            throw new Error(`${certNo} does not exist`);
        }
        console.log(certAsBytes.toString());
        return certAsBytes.getS.toString();
    }

    async createCert(ctx, certNo, certificateName, certificateHash) {
        
        const certData = {
            certificateName,
            docType: 'certificate',
            certificateHash,
        };

        await ctx.stub.putState(certNo, Buffer.from(JSON.stringify(certData)));
    }

    async deleteCert(ctx,key) {
   

        await ctx.stub.deleteState(key); 
        
        console.log('Student Marks deleted from the ledger Succesfully..');
        
    }

    async queryAllCertificate(ctx) {
        const startKey = 'CERT0';
        const endKey = 'CERT999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

}

module.exports = Certchain;
