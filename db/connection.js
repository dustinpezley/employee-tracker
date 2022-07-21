const mysql = require('mysql2');

//Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '1610GanyM3d3',
    database: 'organization'
  }, 
);

module.exports = db;