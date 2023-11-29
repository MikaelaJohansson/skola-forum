let express = require("express");
let app = express();
let port = 4020;
let mysql = require("mysql");
let fs = require("fs");
let cookieParser = require('cookie-parser')
let session = require('express-session')
let path = require('path');

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
datorbas.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Du är ansluten till datorbas!');
});




// skriver ut databasen till html sidan
app.get("/index", function (req,res){
 
  datorbas.query("select * from posts", function (err, result){
    if (err) throw err;
    
    fs.readFile("index.html", "utf-8", function (err, data){
      if (err) throw err;

      let htmlArray = data.split("***NODE***");
      let output = htmlArray[0];  // SKRIVER UT ALL HTML FRAM TILL RAD 39

      // LOOPA IGENOM RESULTATET OCH SKRIV IN MELLAN RAD 39 OCH 41
      for (let key in result[0]){
        output += `<th>${key}</th>`;
      }

      output += htmlArray[1]; // SKRIV UT HTML-DOKUMENTET RAD 41

      // LOOPA IGENOM RESULTATET OCH SKRIV IN MELLAN RAD 41 OCH 43
      for (let user of result){ // för varje rad i databastabellen
        output += "<tr>";
        for (key in user){
          output += `<td>${user[key]}</td>`;  // för varje kolumn i raden
        }
        output += "</tr>";
      }
    
      output += htmlArray[2]; // SKRIVER UT HTML-DOKUMENTET FRÅN RAD 43 TILL SLUT
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






// inloggning med json

app.get('/', function(request, response) {
	// Render login template
	response.sendFile(__dirname + '/login.html');
});

app.post("/checklogin", function (req, res) {
  let users = JSON.parse(fs.readFileSync("users.json").toString()); // läs in JSON-fil och konvertera till en array med JavaScript-objekt
  console.log(users);
  for (i in users) {
    if (users[i].user == req.body.user && users[i].pass == req.body.pass) {
      let output = fs.readFileSync("index.html").toString();
      output = output.replace("***NAMN***", users[i].name);
      res.send(output);
      return;
    }
  }
  let output = fs.readFileSync("login.html").toString();
  output = output.replace(
    "<body>",
    "<body>LOGIN FAILED! PLEASE TRY AGAIN!<br>"
  );
  res.send(output);
});





app.listen(port,function(){
  console.log(`webbservern körs på port ${port}`);
}) 

