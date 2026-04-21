const db = require('./db');

//created by using npm install pg dotenv

async function testConnection() {
  try {
    // A simple query to get the current time from Postgres
    const res = await db.query('SELECT NOW()');
    console.log('Successfully connected! Server time:', res.rows[0].now);
  } catch (err) {
    console.error('Connection error:', err.stack);
  }
}

testConnection();