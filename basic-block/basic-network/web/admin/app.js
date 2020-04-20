const network_graph = require('../../src/Interactions/network-grapth')
const revocation = require('../../src/Interactions/revoke')
const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
const { Docker } = require('node-docker-api');
const shell = require('shelljs')
const app = express();


//Server configuration

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.use(express.static('./src/'));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.listen(4000, '127.0.0.1', function () {
    console.log('Example app listening on port 4000!')
})

app.get('/net_graph_JSON', function (req, res) {
    let net = new network_graph()
    res.send(net.networkToJson());
})

app.post('/getchaincode', function (req, res) {
    let chaincodeinfo = JSON.parse(JSON.stringify(req.body));
    console.log(chaincodeinfo);
    fs.readFile("../../chaincode/" + chaincodeinfo.address + ".js", function (err, data) {
        console.log(data.toString())
        res.send(data.toString());
    })
})

app.post('/uploadchaincode', function (req, res) {
    let chaincodeinfo = JSON.parse(JSON.stringify(req.body));
    console.log(chaincodeinfo.code);

    fs.writeFile("../../chaincode/" + chaincodeinfo.address + "new.js", chaincodeinfo.code, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });

})

app.post('/revoke', async (req, res) => {
    let revocationJson = JSON.parse(JSON.stringify(req.body));
    console.log(revocationJson);
    const rev = new revocation(revocationJson.domain,revocationJson.serial,revocationJson.reason);
    res.send(await rev.invokeChaincode());

})

app.get('/restart', function (req, res) {
    shell.exec(path.resolve(__filename,"../scripts/restart.sh"))
})

app.get('/start', function (req, res) {
    shell.exec(path.resolve(__filename,"../scripts/start.sh"))
})

app.get('/stop', function (req, res) {
    shell.exec(path.resolve(__filename,"../scripts/stop.sh"))
})

app.get('/peerInfo', function (req, res) {
    const docker = new Docker();
    let channelOne = [];
    channelOne.push("org1");
    let channelTwo = [];
    channelTwo.push("org2");

    docker.container.list()
        .then((containers) => {
            let containerList = containers;
            let keys = Object.keys(containerList);

            for (keys in containerList) {
                let data = containerList[keys].data;
                let name = data.Names;
                if (name.toString().includes('org1') || name.toString().includes('ca.')) {
                    channelOne.push(name)
                } else if (name.toString().includes('org2') || name.toString().includes('ca1.')) {
                    channelTwo.push(name)
                }
            }
            console.log(channelOne);
            console.log(channelTwo);
            let channels = JSON.stringify(channelOne + "," + channelTwo)
            res.send(channels)
        });

})

app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/admin.html'));
})