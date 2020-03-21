const network = require('../utilities/network-grapth')
const Client = require('../src/client');
const Invoke = require('../cli-code/testQuery');
const express = require('express')
var bodyParser = require('body-parser')
const hash = require('object-hash');
const app = express()
const forge = require('node-forge');
const path = require('path');
// const revocationObj = require('../cli-code/getrevocations')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/newRequest', async (req, res) => {
    let CSRData = JSON.parse(JSON.stringify(req.body));
    const client = new Client(CSRData.PK, CSRData.CN, CSRData.C,
        CSRData.S, CSRData.L, CSRData.O, CSRData.OU);
    let test = await client.main();
    res.send(test);
})

app.post('/getHash', function (req, res) {
    let CSRData = JSON.parse(JSON.stringify(req.body));
    const client = new Client(CSRData.keys, CSRData.CN, CSRData.C,
        CSRData.S, CSRData.L, CSRData.O, CSRData.OU);
    client.generateKeyPair();
    let result = client.generateCSR()
    let CSR = forge.pki.certificationRequestFromPem(result.certreq);
    let subject = CSR.subject.attributes;
    let hasedSubject = hash(subject);
    console.log(hasedSubject);
    res.send(hasedSubject);
})

app.post('/query', async (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    const query = new Invoke.Invoke();
    let response = await query.verify(data.CN);
    res.send(response);
})

app.get('/getrevocations', async (req, res) => {
    const revoke = new revocationObj.revocation();
    let response = await revoke.getRevocations();
    res.send(response.toString());
})


app.get('/input', function (req, res) {
    let net = new network.network_graph()
    res.send(net.networkToJson());
})

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
})

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/search.html'));
})

app.get('/revocation', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/revocations.html'));
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})