// db/models/message.js
const pool = require('../db');

class Message {
  static async createMessage(content, senderId, postId) {
    try {
      const query = 'INSERT INTO messages (content, sender_id, post_id) VALUES ($1, $2, $3) RETURNING *';
      const values = [content, senderId, postId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getMessagesForPost(postId) {
    try {
      const query = 'SELECT * FROM messages WHERE post_id = $1';
      const values = [postId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async getMessagesBySender(senderId) {
    try {
      const query = 'SELECT * FROM messages WHERE sender_id = $1';
      const values = [senderId];
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Add other methods as needed
}

module.exports = Message;
