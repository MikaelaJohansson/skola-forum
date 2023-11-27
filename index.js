let express = require("express");
let app = express();
let port = 4020;
let mysql = require("mysql");
let fs = require("fs");
let cookieParser = require('cookie-parser')
let session = require('express-session')

// kopplar iphopp med statics mappen
app.use(express.static("filer"));

// för att kunna läsa post data
app.use(express.urlencoded({extended:true}));

// databas uppe till server
let datorbas = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"inloggning",
});

datorbas.connect(function(err) {
  if (err) throw err;
  console.log("Du är ansluten till datorbas!");
});

app.get("/index", function(req,res){
  res.sendFile(__dirname + "/index.html");
})



app.get("table", function (req,res){

  datorbas.query("select * from posts", function (err, result){
    if (err) throw err;
    
    fs.readFile("index.html", "utf-8", function (err, data){
      if (err) throw err;

      let htmlArray = data.split("***NODE***");
      let output = htmlArray[0];

      for (let key in result[0]){
        output += `<th>${posts}<th>`;
      
      }

      output += htmlArray[1];

      for (let user of result){
        output += "<th>";
        for (key in user){
          output += `<th>${namn[key]}</th>`;
          output += `<th>${email[key]}</th>`;
          output += `<th>${amne[key]}</th>`;
          output += `<th>${post[key]}</th>`;
        }
        output += "</th>";
      }
    
      output += htmlArray[2];
      res.send(output);
    })   
      
  })  
      
  
})



// skickar över data till datorbasen från webbsida input
app.post("/posts", function(req,res){

  datorbas.connect(function(err){
    let sql = `INSERT INTO posts (namn,email,amne,post)
    VALUES ('${req.body.namn}', '${req.body.email}', '${req.body.amne}', '${req.body.posts}')`;
    
    datorbas.query(sql, function(err,result){
      if (err) console.log(err);
      res.redirect("/index")
    })
    process.on("sigint", function(){
      datorbas.end((err) =>{
        if (err) throw err;
        console.log("stänger uppkopplingen.")
        process.exit();
      })
    })
  })
})

app.listen(port,function(){
  console.log(`webbservern körs på port ${port}`);
}) 






  


