const utils = require('./IBMUtils.js');
const {config} = require('./config.js');

// console.log(config.Org1);
//Fills in values of IBMUtils constructor, which uses these for all following methods
const orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);

async function install() {
    await orgC.login();
    await orgC.getOrgAdmin();
    console.log("test");
    console.log(await orgC.install(config.chaincodeId,config.chaincodeVersion,config.chaincodePath,'node'));
    console.log("test");
    // orgC.checkInstalled()
}

install();
