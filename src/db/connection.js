const mysql = require("mysql2");


var mysqlConnection = mysql.createConnection({
  
  host: "localhost",
  user: "root",
  password: "root",
  database: "book_store",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log("Erron in db connection: " + JSON.stringify(err, undefined, 2));
  } else {
    console.log("DB cionnected successfully");
  }
});

module.exports = mysqlConnection
