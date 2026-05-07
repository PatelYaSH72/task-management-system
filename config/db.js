const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host:process.env.DB_HOST,
  user:process.env.DB_USER,
  password:process.env.DB_PASSWORD
})

connection.query(
  `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`,
  (err) => {
    if (err) {
      console.log("Database Creation Failed.", err.message);
    }
    else {

      console.log("Databse Connected")
    }
    
  }
)

 const db = mysql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME
      })

      db.connect((err)=>{
        if (err) {
          console.log("Databse connection Failed", err.message);
          
        } else {
          console.log("MySQL Connected Successfully");
        }
      })

module.exports = db;