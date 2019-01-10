// Express
var express = require("express");
var app = express();
var expressServer = app.listen(2525, console.log("Server is running on port 2525."));
/***********************************************************************************************/

// MySQL
var mysql = require("mysql");
var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gv"
});
conn.connect();
/***********************************************************************************************/

// Socket.io
var socketio = require("socket.io");
var server = socketio(expressServer);
var myID = 2;
var upgradingTime = {};
/***********************************************************************************************/

server.on("connection", function(client){ // keď sa niekto pripojí na server

  console.log("tu ešte funguje");

  client.on("upgrade-budovy", function(idBudovy){
    console.log("tu už nie");
    conn.query("SELECT 1 FROM upgrade WHERE idBudovy='"+ idBudovy +"'", (err, jeVDatabaze) => { // kontroluje či je v databaze riadok s idBudovy s idBudovy
      console.log("riadok sa nachádza v databáze.");

      if(jeVDatabaze[0]){
        conn.query("SELECT * FROM upgrade WHERE idBudovy='"+ idBudovy +"'", (err, budova) => {
          upgradingTime[idBudovy.toString()] = setTimeout(() => {
            var rozdelStanice = budova[0].stanice.split("_");
            var jeTamStanica = rozdelStanice.includes(myID.toString());

            console.log("Stanica sa nachádza v databáze.");

            if(jeTamStanica == true){
              var vymazatMaZoStanice = budova[0].stanice.replace("_"+ myID +"", "");
              conn.query("UPDATE upgrade SET stanice='"+ vymazatMaZoStanice +"' WHERE idBudovy='"+ idBudovy +"'");
              conn.query("SELECT budova, level, stanice, body FROM upgrade WHERE budova='"+ budova[0].budova +"' AND level='"+ (budova[0].level + 1) +"'", (err, novyLevel) => {
                conn.query("UPDATE upgrade SET stanice='"+ novyLevel[0].stanice +"_"+ myID +"' WHERE budova='"+ novyLevel[0].budova +"' AND level='"+ novyLevel[0].level +"'");

                conn.query("SELECT celkoveBody FROM stanice WHERE idStanice='"+ novyLevel[0].stanice +"'", (err, povodneBody) => {
                  var result = povodneBody[0].celkoveBody + novyLevel[0].body;
                  console.log(result);
                  conn.query("UPDATE stanice SET celkoveBody='"+ result +"' WHERE idStanice='"+ novyLevel[0].stanice +"'"); // TODO: zistiť či to funguje
                });

              });
              conn.query("DELETE FROM progress WHERE stanica='"+ myID +"' AND budova='"+ idBudovy +"'");

              console.log("Upgrade je úspešne dokončený.");
            }

            else{
              console.log("Neni tam stanica");
            }

          }, budova[0].time * 1000);
        });
      }

      else{
        console.log("riadok sa nenachádza v databáze");
      }

    });
  });

});
