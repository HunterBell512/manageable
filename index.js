const mysql = require('mysql2');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: DB_USER,
        password: DB_PASSWORD,
        database: 'employees_db'
    },
    console.log('Connected to the database.')
);

module.exports = db;