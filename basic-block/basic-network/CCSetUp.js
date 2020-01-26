const utils = require('./IBMUtils.js');
const {config} = require('./config.js');
const enroll = require('./enrollAdmin.js');
const register = require('./registerUser.js');
const CA = require('./CA.js');
const fs = require('fs-extra');
const path = require('path');

// console.log(config.Org1);
//Fills in values of IBMUtils constructor, which uses these for all following methods

orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);

/**
 * SetUP function
 */
async function setUP() {
    await orgC.login();
    await orgC.getOrgAdmin();
    if(!await orgC.checkChannelMembership()){
        await channelManager();
    }
    await install();
    await instantiate();
    if (fs.existsSync(config.walletPath)) {
        fs.removeSync(config.walletPath);
    } 
    await enroll.enrollAdmin();
    await register.register();
    process.exit(1);
}

/**
 * Creates the channels and adds peers to it
 */
async function channelManager() {
    if(!await orgC.checkChannelMembership()){
        const channelResponse = await orgC.createChannel(config.channelConfig);
        console.log("test");
        if (channelResponse.status == "SUCCESS") {
            console.log("New channel created");
        } else {
            console.log("Failed to create channel");
        }
        await orgC.joinChannel();
        orgC.connectAndRegisterBlockEvent();
        orgC.initialize();

    }
}

/**
 * Installs the chaincode
 */
async function install() {
    console.log("Installing");
    console.log(await orgC.install(config.chaincodeId,config.chaincodeVersion,config.chaincodePath,'node'));
    // orgC.checkInstalled()
}

/**
 * Instantiates the chaincode
 */
async function instantiate() {
    if (!await orgC.checkInstantiated(config.chaincodeId,
        config.chaincodeVersion,
        config.chaincodePath)) {
            console.log("Instantiating");
            const ca = new CA();
            ca.generateKeyPair();
            var pem = ca.selfsign();
            await orgC.instantiate(config.chaincodeId,config.chaincodeVersion,pem,'ROOTCA');
        }
    
}
setUP();
