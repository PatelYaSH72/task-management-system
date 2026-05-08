const db = require("../config/db");


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

const getTasks = (req, res) => {
  try {
    const { id } = req.params;

    const project_id = id;

    console.log(project_id);
    

    // Check User Is Project Member
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

        // Get Tasks
        const taskQuery = `
          SELECT * FROM tasks
          WHERE project_id = ?
          ORDER BY created_at DESC
        `;

        db.query(
          taskQuery,
          [project_id],
          (err, tasks) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            res.status(200).json({
              success: true,
              total: tasks.length,
              tasks,
            });
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

const updateTaskStatus = (req, res) => {
  try {
    const { id } = req.params;

    const task_id = id

    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Check Task Assigned User
    const checkQuery = `
      SELECT * FROM tasks
      WHERE id = ?
      AND assigned_to = ?
    `;

    db.query(
      checkQuery,
      [task_id, req.user.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Not Assigned User
        if (result.length === 0) {
          return res.status(403).json({
            success: false,
            message:
              "Only Assigned User Can Update Status",
          });
        }

        // Update Status
        const updateQuery = `
          UPDATE tasks
          SET status = ?
          WHERE id = ?
        `;

        db.query(
          updateQuery,
          [status, task_id],
          (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            res.status(200).json({
              success: true,
              message: "Task Status Updated",
            });
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
  getTasks,
  updateTaskStatus
};