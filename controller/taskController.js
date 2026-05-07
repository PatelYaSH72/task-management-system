const db = require("../config/db");

// Create Task
const createTask = (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      assigned_to,
      priority,
      due_date,
    } = req.body;

    // Validation
    if (!title || !project_id || !assigned_to) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Check Login User Is Project Member
    const memberQuery = `
      SELECT * FROM project_members
      WHERE project_id = ?
      AND user_id = ?
    `;

    db.query(
      memberQuery,
      [project_id, req.user.id],
      (err, memberResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Not Member
        if (memberResult.length === 0) {
          return res.status(403).json({
            success: false,
            message: "You Are Not Project Member",
          });
        }

        // Check Assigned User Is Member
        const assignedQuery = `
          SELECT * FROM project_members
          WHERE project_id = ?
          AND user_id = ?
        `;

        db.query(
          assignedQuery,
          [project_id, assigned_to],
          (err, assignedResult) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            // Assigned User Not Member
            if (assignedResult.length === 0) {
              return res.status(400).json({
                success: false,
                message:
                  "Assigned User Is Not Project Member",
              });
            }

            // Create Task
            const taskQuery = `
              INSERT INTO tasks
              (
                title,
                description,
                project_id,
                assigned_to,
                created_by,
                priority,
                due_date
              )
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
              taskQuery,
              [
                title,
                description,
                project_id,
                assigned_to,
                req.user.id,
                priority,
                due_date,
              ],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: err.message,
                  });
                }

                res.status(201).json({
                  success: true,
                  message: "Task Created Successfully",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
};