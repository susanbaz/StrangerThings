import pool from './db';
const express = require('express');
const pool = require('./db'); // Make sure this path is correct
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const messagesRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Use the routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/messages', messagesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

