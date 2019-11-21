let express = require('express');
let parser = require('body-parser');

let app = express();

app.use(parser.json());
let IP = parser.urlencoded({extended:false});
app.use(IP);
console.log(IP);

app.post("/postdata", (req,res) => {
    let hash = req.body.Hash;
    let CN = req.body.CommonName;
    console.log(hash);
    console.log(CN);
    res.send("process complete");
});

// app.get("/getdata", (req, res) => {
//     var data = { // this is the data you're sending back during the GET request
//         data1: "mee",
//         data2: "po"
//     }
//     res.status(200).json(data)
// });

app.listen(3000);