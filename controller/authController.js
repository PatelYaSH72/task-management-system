const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Controller
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check Email Exists
    const checkQuery = `
      SELECT * FROM users WHERE email = ?
    `;

    db.query(checkQuery, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Hash Password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert User
      const insertQuery = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
      `;

      db.query(
        insertQuery,
        [name, email, hashedPassword],
        (err, data) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.status(201).json({
            success: true,
            message: "User Registered Successfully",
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login Controller
const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Check User
    const query = `
      SELECT * FROM users WHERE email = ?
    `;

    db.query(query, [email], async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      // User Not Found
      if (result.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }

      const user = result[0];

      // Compare Password
      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid Email or Password",
        });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};