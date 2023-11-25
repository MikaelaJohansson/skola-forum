let express = require("express");
let app = express();
let port = 4020;
let mysql = require("mysql");
let fs = require("fs");
const { constrainedMemory } = require("process");

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
    console.log()
  
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



// inloggning till huvud sida INLOGGNINGSIDAN start
app.post("/form", function(req,res){
  

})

// INDEX.HTML huvud sidan där allt ska hamna
app.get("/index", function(req,res){
  res.sendFile(__dirname + "/index.html")
})



// skickar över data till datorbasen från input
app.post("/posts", function(req,res){

  let datorbas = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"inloggning",
  });

  datorbas.connect(function(err){
    let sql = `INSERT INTO posts (namn,email,amne,post)
    VALUES ('${req.body.namn}', '${req.body.email}', '${req.body.amne}', '${req.body.posts}')`;
    
    datorbas.query(sql, function(err,result){
      if (err) console.log(err);
      res.redirect("/index")
    })
    console.log()
  })
  
})


  
// klistrar mina värden till html

    
  


