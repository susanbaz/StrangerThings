// db/models/user.js
const pool = require('../db');

class User {
  static async getAllUsers() {
    try {
      const query = 'SELECT * FROM users';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
