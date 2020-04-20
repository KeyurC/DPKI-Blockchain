const Queries = require('../../src/Interactions/Queries');
const Certificate = require('../../src/Interactions/Certificate')

const express = require('express')
const bodyParser = require('body-parser')
const hash = require('object-hash');
const forge = require('node-forge');
const path = require('path');

const app = express();
const queries = new Queries();


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


app.listen(3000,'0.0.0.0', function () {
    console.log('Example app listening on port 3000!')
})

//Post and Gets

app.post('/newRequest', async (req, res) => {
    let clientInfo = JSON.parse(JSON.stringify(req.body));
    console.log(clientInfo)
    const manager = new Certificate(clientInfo,"true");
    let cert = await manager.generateCertificate();
    res.send(cert);
})

app.post('/getHash', function (req, res) {
    console.log(req.body);
    let CSR = JSON.parse(JSON.stringify(req.body));
    CSR = forge.pki.certificationRequestFromPem(CSR.certreq);
    //Hashes the company information
    let subject = CSR.subject.attributes;
    let hasedSubject = hash(subject);

    res.send(hasedSubject);
})

app.post('/query', async (req,res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    let response = await queries.queryCADB(data.CN);
    console.log(data);
    res.send(response);
})

app.get('/getrevocations', async (req, res) => {
    let response = await queries.queryRevocationsDB();
    res.send(response.toString());
})

//Pages

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
})

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/search.html'));
})

app.get('/revocation', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/revocations.html'));
})

