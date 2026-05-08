const db = require("../config/db");

// Add Comment
const addComment = (req, res) => {
  try {
    const { task_id, content } = req.body;

    // Validation
    if (!task_id || !content) {
      return res.status(400).json({
        success: false,
        message: "Task ID and Content required",
      });
    }

    // Get Task
    const taskQuery = `
      SELECT * FROM tasks
      WHERE id = ?
    `;

    db.query(
      taskQuery,
      [task_id],
      (err, taskResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Task Not Found
        if (taskResult.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Task Not Found",
          });
        }

        const project_id = taskResult[0].project_id;

        // Check Project Member
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
                message: "Access Denied",
              });
            }

            // Add Comment
            const commentQuery = `
              INSERT INTO comments
              (task_id, user_id, content)
              VALUES (?, ?, ?)
            `;

            db.query(
              commentQuery,
              [
                task_id,
                req.user.id,
                content,
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
                  message: "Comment Added Successfully",
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
  addComment,
};