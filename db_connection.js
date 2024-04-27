import dotenv from "dotenv";
import mysql from "mysql";

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  multipleStatements: true,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database Connected");
});
