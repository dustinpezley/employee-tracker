const mysql = require('mysql2');

require('dotenv').config();

//Connect to database
const db = mysql.createConnection(
  {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: 'organization'
  }, 
);

module.exports = db;