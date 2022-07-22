const mysql = require('mysql2');

require('dotenv').config();

//Connect to database
const db = mysql.createConnection(
  {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASS,
    database: 'organization'
  }, 
);

module.exports = db;