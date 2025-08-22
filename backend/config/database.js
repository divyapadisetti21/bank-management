const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();

let sslConfig = {};

// ✅ Add SSL only if CA file exists
if (process.env.DB_CA_PATH) {
  sslConfig = {
    ssl: {
      ca: fs.readFileSync(process.env.DB_CA_PATH)
    }
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000 || 5000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...sslConfig
});

pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL (TiDB) Database connected successfully!');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection error:', error);
  });

module.exports = pool;
