const network = require('./network-grapth.js')
const express = require('express')
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/input', function (req, res) {
    let net = new network.network_graph()
    res.send(net.networkToJson());
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})