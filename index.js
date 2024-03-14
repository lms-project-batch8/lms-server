import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const db = mysql.createConnection({
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

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello this is the backend");
});

app.get("/users", (req, res) => {
    const q = "SELECT * FROM user";
    db.query(q, (err, data) => {
        if (err) throw err;
        return res.json(data);
    });
});

app.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM user WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) throw err;
        console.log(err);
        return res.json(data);
    });
});

app.get("/users/:email", (req, res) => {
    const email = req.params.email;
    const q = "SELECT * FROM user WHERE user_email = ?";
    db.query(q, [email], (err, data) => {
        if (err) throw err;
        console.log(err);
        return res.json(data);
    });
});

app.post("/users", (req, res) => {
    const q = "INSERT INTO user(`user_id`, `user_name`, `user_password`, `user_email`, `user_role`) VALUES (?)";
    const values = [
        req.body.user_id,
        req.body.user_name,
        req.body.user_password,
        req.body.user_email,
        req.body.user_role
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been created successfully");
    });
});

app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM user WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been deleted successfully");
    });
});

app.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "UPDATE user SET `user_name` = ?, `user_password` = ?, `user_email` = ?, `user_role` = ? WHERE user_id = ?";
    const values = [
        req.body.user_name,
        req.body.user_password,
        req.body.user_email,
        req.body.user_role,
        userId
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been updated successfully");
    });
});

const PORT = 3001;
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});