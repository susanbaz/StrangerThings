const pool = require('../db');

const postsController = {
  getAllPosts: async (req, res) => {
    try {
      const query = 'SELECT * FROM posts';
      const posts = await pool.query(query);

      res.json(posts.rows);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createPost: async (req, res) => {
    const { title, content, author_id } = req.body;

    try {
      const insertQuery = 'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *';
      const insertValues = [title, content, author_id];
      const newPost = await pool.query(insertQuery, insertValues);

      res.status(201).json(newPost.rows[0]);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deletePost: async (req, res) => {
    const postId = req.params.id;

    try {
      // Check if the post exists
      const checkQuery = 'SELECT * FROM posts WHERE id = $1';
      const checkValues = [postId];
      const existingPost = await pool.query(checkQuery, checkValues);

      if (existingPost.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Delete the post
      const deleteQuery = 'DELETE FROM posts WHERE id = $1';
      const deleteValues = [postId];
      await pool.query(deleteQuery, deleteValues);

      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = postsController;
