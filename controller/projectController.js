const db = require("../config/db");

// Create Project
const createProject = (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    // Login User ID
    const owner_id = req.user.id;

    // Insert Project
    const projectQuery = `
      INSERT INTO projects (name, description, owner_id)
      VALUES (?, ?, ?)
    `;

    db.query(
      projectQuery,
      [name, description, owner_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Project ID
        const project_id = result.insertId;

        // Add Owner In project_members
        const memberQuery = `
          INSERT INTO project_members
          (project_id, user_id, role)
          VALUES (?, ?, ?)
        `;

        db.query(
          memberQuery,
          [project_id, owner_id, "owner"],
          (err) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            res.status(201).json({
              success: true,
              message: "Project Created Successfully",
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

// Get All Projects
const getProjects = (req, res) => {
  try {
    const user_id = req.user.id;

    const query = `
      SELECT 
        projects.id,
        projects.name,
        projects.description,
        projects.owner_id,
        projects.created_at,
        project_members.role
      FROM project_members
      JOIN projects
      ON project_members.project_id = projects.id
      WHERE project_members.user_id = ?
    `;

    db.query(query, [user_id], (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        total: result.length,
        projects: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Project Member
const addProjectMember = (req, res) => {
  try {
    const { project_id, user_id } = req.body;

    // Validation
    if (!project_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Project ID and User ID are required",
      });
    }

    // Check Owner
    const ownerQuery = `
      SELECT * FROM project_members
      WHERE project_id = ?
      AND user_id = ?
      AND role = 'owner'
    `;

    db.query(
      ownerQuery,
      [project_id, req.user.id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        // Not Owner
        if (result.length === 0) {
          return res.status(403).json({
            success: false,
            message: "Only Owner Can Add Members",
          });
        }

        // Check Already Member
        const checkMemberQuery = `
          SELECT * FROM project_members
          WHERE project_id = ?
          AND user_id = ?
        `;

        db.query(
          checkMemberQuery,
          [project_id, user_id],
          (err, memberResult) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            if (memberResult.length > 0) {
              return res.status(400).json({
                success: false,
                message: "User Already Added",
              });
            }

            // Add Member
            const insertQuery = `
              INSERT INTO project_members
              (project_id, user_id, role)
              VALUES (?, ?, ?)
            `;

            db.query(
              insertQuery,
              [project_id, user_id, "member"],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: err.message,
                  });
                }

                res.status(201).json({
                  success: true,
                  message: "Member Added Successfully",
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
  createProject,
  getProjects,
  addProjectMember
};