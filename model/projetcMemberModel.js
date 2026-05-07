const db = require("../config/db");

const createProjectMembersTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS project_members (
      id INT AUTO_INCREMENT PRIMARY KEY,

      project_id INT NOT NULL,
      user_id INT NOT NULL,

      role ENUM('owner', 'member') DEFAULT 'member',

      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (project_id)
      REFERENCES projects(id)
      ON DELETE CASCADE,

      FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.log("Project Members Table Creation Failed:", err.message);
    } else {
      console.log("Project Members Table Ready");
    }
  });
};

module.exports = createProjectMembersTable;