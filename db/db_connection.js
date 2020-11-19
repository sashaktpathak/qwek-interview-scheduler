var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Password@123",
  database: 'qwek'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("DB Connected!");
});

module.exports = con;