const network_graph = require('../../src/Interactions/network-grapth')

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path');
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


app.listen(4000,'127.0.0.1', function () {
    console.log('Example app listening on port 4000!')
})

app.get('/net_graph_JSON', function (req, res) {
    let net = new network_graph()
    res.send(net.networkToJson());
})

app.get('/admin', function (req, res) {
    res.sendFile(path.join(__dirname + '/src/admin.html'));
})