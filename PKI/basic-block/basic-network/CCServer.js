let express = require('express');
let parser = require('body-parser');
let CCSetup = require('./CCSetUp.js');
let app = express();

app.use(parser.json());
let IP = parser.urlencoded({extended:false});

app.post("/postroot", (req,res) => {
    let hash = req.body.Hash;
    let CN = req.body.CommonName;
    console.log(hash);
    console.log(CN);
    CCSetup.setUP(hash,CN);
    res.send("process complete");
});

app.post("/postnewentry", (req,res) => {
    let hash = req.body.Hash;
    let CN = req.body.CommonName;
    console.log(hash);
    console.log(CN);
    res.send("process complete");
});

app.listen(3000);