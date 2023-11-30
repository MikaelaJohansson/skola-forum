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
      let output = htmlArray[0]; 
     
      for (let key in result[0]){
        output += `<th>${key}</th><br><br>`;
      }

      output += htmlArray[1]; 

      for (let user of result){
        output += "<tr><br><br>";
        for (key in user){
          output += `<td>${user[key]}</td><br><br>`;  
        }
        output += "</tr><br><br>";
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



// inloggning med json, för jag lyckas inte logga in med min dator bas

app.get('/', function(request, response) {
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



// jag lyckas inte logga in med datorbasen vet inte vad det är för fel på koden.

// app.get('/', function(request, response) {
// 	// Render login template
// 	response.sendFile(path.join(__dirname + '/login.html'));
// });
// app.post("/checklogin", function (req, res) {

//   datorbas.query("select * from users WHERE username = ? AND password = ?", function (err, result){
//     if (err) throw err;
   
//     fs.readFile("/index", "utf-8", function (err, data){

//       for (i in result) {
//         if (result[i].username == req.body.user && result[i].password == req.body.pass) {
//           res.redirect("/index")
//           return;
//         }
//       }
      
//     });

//   })
// }) 
  




app.listen(port,function(){
  console.log(`webbservern körs på port ${port}`);
}) 

