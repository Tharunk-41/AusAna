// db.js
const mongoose = require("mongoose");
const mysql = require('mysql2');

let mysqlConnection;

const connectToMongoDB = () => {
  const connectionParams = {};
  try {
    mongoose.connect(process.env.MONGODB_URI, connectionParams);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to MongoDB!");
  }
};

const connectToMySQL = () => {
  return new Promise((resolve, reject) => {
    urlDB=process.env.MYSQL_PRIVATE_URL
    mysqlConnection = mysql.createConnection(urlDB);

    mysqlConnection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        reject(err);
      } else {
        console.log('Connected to MySQL');
        resolve(mysqlConnection);
      }
    });
  });
};

module.exports = {
  connectToMongoDB,
  connectToMySQL
};