let express = require("express");
let app = express();
let port = 4020;
let mysql = require("mysql");
let fs = require("fs");

// konektar databas till server
let datorbas = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"inloggning",
});

datorbas.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  datorbas.query("SELECT * FROM users",function(err,result,fields){
    if(err)throw err;
    console.log(result)
  })
});

// startar servern på porten
let server = app.listen(port, function(){
  console.log(`Allt är lugnt, port körs på ${port}`);
})

// hämtar inloggningsidan
app.get("/", function(req,res){
  res.sendFile(__dirname + "/loggin.html")
})

// kopplar iphopp med statics mappen
app.use(express.static("filer"));

// för att kunna läsa post data
app.use(express.urlencoded({extended:true}));

// inloggning till huvud sida
app.post("/form", function(req,res){

  console.log(req.body);
  let anvandare = req.body.anvandare;
  let losen = req.body.losen;

  if(anvandare == datorbas.username && losen == datorbas.password){
    alert("hej");
  }

})
