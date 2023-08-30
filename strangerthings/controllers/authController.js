const pool = require('../db');
const bcrypt = require('bcrypt');

const authController = {
  register: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the username already exists
      const checkQuery = 'SELECT * FROM users WHERE username = $1';
      const checkValues = [username];
      const existingUser = await pool.query(checkQuery, checkValues);

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the database
      const insertQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
      const insertValues = [username, hashedPassword];
      const newUser = await pool.query(insertQuery, insertValues);

      res.status(201).json(newUser.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      // Check if the user exists
      const query = 'SELECT * FROM users WHERE username = $1';
      const values = [username];
      const user = await pool.query(query, values);

      if (user.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // TODO: Create and send a JWT token for authentication

      res.json({ message: 'Login successful' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: async (req, res) => {
    // Clear the authentication token or session here
    // Example for token-based authentication (JWT)
    // Clear the token from client-side storage
    // You might also want to implement token blacklist for better security

    // For session-based authentication (express-session)
    req.logout(); // Clear session data
    req.session.destroy(); // Destroy the session

    res.json({ message: 'Logged out successfully' });
  }
};

module.exports = authController;
