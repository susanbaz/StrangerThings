// db/models/post.js
const pool = require('../db');

class Post {
  static async getAllPosts() {
    try {
      const query = 'SELECT * FROM posts';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createPost(title, content) {
    try {
      const query = 'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *';
      const values = [title, content];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Post;
