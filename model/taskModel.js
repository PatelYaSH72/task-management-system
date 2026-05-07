const db = require("../config/db");

const createTasksTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,

      title VARCHAR(255) NOT NULL,
      description TEXT,

      project_id INT NOT NULL,

      assigned_to INT NOT NULL,

      created_by INT NOT NULL,

      status ENUM(
        'pending',
        'in_progress',
        'completed'
      ) DEFAULT 'pending',

      priority ENUM(
        'low',
        'medium',
        'high'
      ) DEFAULT 'medium',

      due_date DATE,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (project_id)
      REFERENCES projects(id)
      ON DELETE CASCADE,

      FOREIGN KEY (assigned_to)
      REFERENCES users(id)
      ON DELETE CASCADE,

      FOREIGN KEY (created_by)
      REFERENCES users(id)
      ON DELETE CASCADE
    )
  `;

  db.query(query, (err) => {
    if (err) {
      console.log("Tasks Table Creation Failed:", err.message);
    } else {
      console.log("Tasks Table Ready");
    }
  });
};

module.exports = createTasksTable;