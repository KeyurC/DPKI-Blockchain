const utils = require('../utilities/IBMUtils.js');
const { config } = require('../utilities/config.js');
const CA = require('./CA.js');
const fs = require('fs-extra');
const chalk = require('chalk');

// console.log(config.Org1);
//Fills in values of IBMUtils constructor, which uses these for all following methods

orgC = new utils.orgClient(config.channelName, config.orderer0, config.Org1.peer, config.Org1.ca, config.Org1.admin);

/**
 * SetUP function
 */
async function setUP() {
    let tick = chalk.green("✔");
    let cross = chalk.red("✖");
    orgC.login().then(value => {
        console.log(chalk.bold.white("Login ") + tick);
        orgC.getOrgAdmin().then(value => {
            orgC.checkChannelMembership().then(value => {
                if (!value) {
                    channelManager().then(value => {
                        install().then(value => {
                            console.log(chalk.bold.white("Chaincode installed " + tick))
                            instantiate().then(value => {
                                console.log(chalk.bold.white("Chaincode Instantiated " + tick))
                                if (fs.existsSync(config.walletPath)) {
                                    fs.removeSync(config.walletPath);
                                }
                                process.exit(1);

                            }).catch(error => {
                                console.log("Chaincode Instantiation " + cross + error)
                            });
                        }).catch(error => {
                            console.log("Chaincode Installion " + cross + error)
                        });
                    }).catch(error => {
                        console.log(chalk.bold.white("Channel creation " + cross))
                        console.log(chalk.bold.white("Peers added " + cross))
                        console.log(error);
                    });
                }
            })
        }).catch(err => {
            console.log(chalk.red.bold("Failed to get admin crypto material and create user " + cross + err))
        })
    }).catch(err => {
        console.log(chalk.red("login " + cross + err))
    });
}


/**
 * Creates the channels and adds peers to it
 */
async function channelManager() {
    if (!await orgC.checkChannelMembership()) {
        const channelResponse = await orgC.createChannel(config.channelConfig);
        if (channelResponse.status == "SUCCESS") {
            console.log(chalk.white("channel created: " + config.channelName));
            await orgC.joinChannel();
            orgC.connectAndRegisterBlockEvent();
            orgC.initialize();
        } else {
            throw error(chalk.red("Error generating channel"));
        }
    }
}

/**
 * Installs the chaincode
 */
async function install() {
    let response = await orgC.checkInstalled();
    if (!response) {
        await orgC.install(config.chaincodeId,
            config.chaincodeVersion, config.chaincodePath, 'node');
    }


}

/**
 * Instantiates the chaincode
 */
async function instantiate() {
    if (!await orgC.checkInstantiated(config.chaincodeId,
        config.chaincodeVersion,
        config.chaincodePath)) {
        const ca = new CA();
        ca.generateKeyPair();
        let pem = ca.selfsign();
        let CaList = ca.generateSubCA(3);
        CaList.push(pem);
        console.log(CaList);
        await orgC.instantiate(config.chaincodeId, config.chaincodeVersion, CaList, 'ROOTCA');
        
    }

}
setUP();
