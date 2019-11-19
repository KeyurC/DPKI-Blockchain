const utils = require('./IBMUtils.js');
const {config} = require('./config.js');

// console.log(config.Org1);
//Fills in values of IBMUtils constructor, which uses these for all following methods

orgC = new utils.orgClient(config.channelName,config.orderer0,config.Org1.peer,config.Org1.ca,config.Org1.admin);

async function setUP() {
    await orgC.login();
    await orgC.getOrgAdmin();
    await install();
    await instantiate();
    
}

async function install() {
    
    console.log("Installing");
    console.log(await orgC.install(config.chaincodeId,config.chaincodeVersion,config.chaincodePath,'node'));
    // orgC.checkInstalled()
}

async function instantiate() {
    if (!await orgC.checkInstantiated(config.chaincodeId,
        config.chaincodeVersion,
        config.chaincodePath)) {
            console.log("Instantiating");
            await orgC.instantiate(config.chaincodeId,config.chaincodeVersion,'a',3,'b',6);
        }
    
}
setUP();
