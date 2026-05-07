const db = require("../config/db");

const createCommentModel = () => {

  const query = `
   CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,

      task_id INT NOT NULL,

      user_id INT NOT NULL,

      content TEXT NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (task_id)
      REFERENCES tasks(id)
      ON DELETE CASCADE,

      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
    )`;


    db.query(query,(err) => {
      if (err) {
        console.log("Comments Table Creation Failed", err.message);
        
      } else {
        console.log("Comments Table Ready");
        
      }
    })


}

module.exports = createCommentModel;