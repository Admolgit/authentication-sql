const mysql = require("mysql2");
require("dotenv").config();

const configDb = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

configDb.connect((error) => {
  if (error) throw error;
  console.log("MySql database connected successfully");
});

module.exports = configDb;
