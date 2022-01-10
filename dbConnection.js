const dotenv = require('dotenv');
const mysql = require('mysql2');
dotenv.config({ path: './config.env' });

//stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server

// 1) Set up the connection
const conn = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
});

conn.connect(error => {
  if (error) {
    return console.error(`Error: ${error.message}`, error);
  }
  console.log(
    `Successfully connected to ${conn.config.host} on PORT ${conn.config.port}!`
  );
});

module.exports = conn;

// // 2) POOLING CONNECTIONS
// const pool = mysql.createPool({
//   connectionLimit: 10,
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DATABASE,
// });
// pool.getConnection(function (err, connection) {
//   // execute query
//   // ...

//   console.log('Getting 1 connection from the pool');
// });
// pool.getConnection(function (error, connection) {
//   // execute query
//   // ...

//   console.log('Returning 1 connection to the pool');
//   connection.release();
// });

// // 3) CLOSING gracefully
// setTimeout(() => {
//   connection.end(error => {
//     if (error) {
//       return console.error(`Error: ${error.message}`, error);
//     }
//     console.log('Database connection closed!');
//     process.exit(1);
//   });
// }, 5000);

// // 4) FORCE close
// function toTest() {
//   connection.destroy();
// }
