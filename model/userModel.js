const db = require("../config/db")

const createUserTable = () => {
  const query = `
  
    CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(100) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(query,(error) => {
    if (error) {
        console.log("User Table Creation Failed:", error.message);      
    }
    else {
      console.log("User table Ready");
    };
  });


}

module.exports = createUserTable;