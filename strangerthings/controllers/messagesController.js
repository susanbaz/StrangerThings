const pool = require('../db');

const messagesController = {
  sendMessage: async (req, res) => {
    const { content, sender_id, post_id } = req.body;

    try {
      const insertQuery = 'INSERT INTO messages (content, sender_id, post_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValues = [content, sender_id, post_id];
      const newMessage = await pool.query(insertQuery, insertValues);

      res.status(201).json(newMessage.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getMessagesForPost: async (req, res) => {
    const postId = req.params.postId;

    try {
      const query = 'SELECT * FROM messages WHERE post_id = $1';
      const values = [postId];
      const messages = await pool.query(query, values);

      res.json(messages.rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getMessagesForUser: async (req, res) => {
    const userId = req.params.userId;

    try {
      const query = 'SELECT * FROM messages WHERE sender_id = $1';
      const values = [userId];
      const messages = await pool.query(query, values);

      res.json(messages.rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = messagesController;
