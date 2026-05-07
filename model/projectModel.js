const  db = require("../config/db")

const createProjectTable = () => {

    const query = `
    CREATE TABLE IF NOT EXISTS projects(
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       owner_id INT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (owner_id)
       REFERENCES users(id)
       ON DELETE CASCADE
    )
    `;

    db.query(query,(err) => {
      if (err) {
        console.log("Project Connection Failed",err.message);
      } else {
        console.log("Databse Connected");
      }
    })

}

module.exports = createProjectTable;