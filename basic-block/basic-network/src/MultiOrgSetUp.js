const utils = require('../utilities/IBMUtils.js');
const { config } = require('../utilities/config.js');
const CA = require('./CA.js');
const fs = require('fs-extra');
const chalk = require('chalk');

let channelConfig = [];
let channelName = [];;
let chaincode = [];

for (let key in config) {
    if (config.hasOwnProperty(key)) {
        if (key.includes('Org')) {
            channelConfig.push(config[key].channel.channelConfig);
            channelName.push(config[key].channel.channelName);
            chaincode.push(config[key].chaincode);
        }
    }
}

chaincode1 = new utils.orgClient(channelName[0], config.orderer0,
    config.Org1.peer, config.Org1.ca, config.Org1.admin);

chaincode2 = new utils.orgClient(channelName[1], config.orderer0,
    config.Org2.peer, config.Org2.ca, config.Org2.admin);

async function getAdminOrgs() {
    return Promise.all([
        chaincode1.getOrgAdmin(),
        chaincode2.getOrgAdmin()
    ]);
}

async function Login() {
    await Promise.all([
        chaincode1.login(),
        chaincode2.login()
    ]);
}

async function setUP() {
    await Login();
    await getAdminOrgs();


    let channelCreation = await chaincode1.createChannel(channelConfig[0]).then(value1 => {
        return chaincode2.createChannel(channelConfig[1]).then(value => {
            if (value1.status == "SUCCESS" && value.status == "SUCCESS") {
                console.log('Successfully created a new default channel.');
                console.log('Joining peers to the default channel.');
                return true;
            } else {
                let error = value.info.toString();
                let error1 = value1.info.toString();
                if (error.includes('existing') && error1.includes('existing')) {
                    console.log("Channels already exist");
                    return true;
                } else {
                    console.log("failed " + value.info.toString());
                    return false;
                }
            }
        }).catch(err => {
            console.log("Failed to create channel for " + channelName[1] + " " + err);
            return false;
        })
    }).catch(err => {
        console.log("Failed to create channel for " + channelName[0] + " " + err);
        return false;
    });

    if (channelCreation) {
        let channelJoined = chaincode1.joinChannel().then(result1 => {
            return chaincode2.joinChannel().then(result2 => {
                console.log("Peers have joined successfully");
                return true;
            }).catch(err => {
                console.log("Failed to join" + channelName[1] + " " + err);
                return false;
            })
        }).catch(err => {
            console.log("Failed to join" + channelName[0] + " " + err);
            return false;
        })
    }

    await new Promise(resolve => {
        setTimeout(resolve, 10000);
    });

    try {
        console.log('Connecting and Registering Block Events');
        chaincode1.connectAndRegisterBlockEvent();
        chaincode2.connectAndRegisterBlockEvent();
    } catch (e) {
        console.log('Fatal error register block event!');
        console.log(e);
        process.exit(-1);
    }

    let channelInit = chaincode1.initialize().then(() => {
        return chaincode2.initialize().then(() => {
            return true;
        }).catch(err => {
            console.log("Failed to initialise " + channelName[1]);
            console.log(err);
            return false
        });
    }).catch(err => {
        console.log("Failed to initialise " + channelName[0]);
        console.log(err);
        return false
    });

    if (channelInit) {
        let install = await chaincode1.install(chaincode[0].chaincodeId,
            chaincode[0].chaincodeVersion, chaincode[0].chaincodePath, 'node').then(() => {
                return chaincode2.install(chaincode[1].chaincodeId,
                    chaincode[1].chaincodeVersion, chaincode[1].chaincodePath, 'node').then(() => {
                        console.log("Chaincodes installed sucessfully");
                        return true;
                    }).catch(err => {
                        console.log("Failed to install " + channelName[1]);
                        console.log(err);
                        return false
                    });
            }).catch(err => {
                console.log("Failed to install " + channelName[0]);
                console.log(err);
                return false
            });
        console.log(install);

    }

    if (!await chaincode1.checkInstantiated(chaincode[0].chaincodeId,
        chaincode[0].chaincodeVersion,
        chaincode[0].chaincodePath)) {
        const ca = new CA();
        ca.generateKeyPair();
        let pem = ca.selfsign();
        let CaList = ca.generateSubCA(3);
        CaList.push(pem);
        await chaincode1.instantiate(chaincode[0].chaincodeId, chaincode[0].chaincodeVersion, CaList, 'ROOTCA');
    }
    if (!await chaincode2.checkInstantiated(chaincode[1].chaincodeId,
        chaincode[1].chaincodeVersion,
        chaincode[1].chaincodePath)) {
        await chaincode2.instantiate(chaincode[1].chaincodeId, chaincode[1].chaincodeVersion, "2232313123", 'revoked.org');
    }

    process.exit(0);
}

setUP();