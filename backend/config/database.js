const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// ✅ SSL CA cert path (local file OR Render secret file)
const caCertPath = process.env.CA_CERT_PATH || path.join(__dirname, 'isrgrootx1.pem');

// ✅ Create pool with SSL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 4000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(caCertPath, 'utf8'),
  },
});

// ✅ Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL (TiDB) Database connected successfully!');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Database connection error:', error);
  });

module.exports = pool;
