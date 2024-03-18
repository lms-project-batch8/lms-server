import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql';

dotenv.config();
const app = express();

export const db = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});    

db.connect((err) => {
    if(err) throw err;
    console.log("Database Connected");
    
    var sql = "CREATE TABLE IF NOT EXISTS user(user_id INT PRIMARY KEY, user_name VARCHAR(50), user_password VARCHAR(50), user_email VARCHAR(50), user_role VARCHAR(50));"
    db.query(sql, (err, result) => {
        if(err) throw err;
        return result;
    });
});