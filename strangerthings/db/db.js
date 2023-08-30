// db/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'strangerthings',
  password: 'Tsq83226$',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
