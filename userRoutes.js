import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get("/users", (req, res) => {
    const q = "SELECT * FROM user";
    db.query(q, (err, data) => {
        if (err) throw err;
        return res.json(data);
    });
});

router.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM user WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) throw err;
        console.log(err);
        return res.json(data);
    });
});

router.get("/search", (req, res) => {
    const {email} = req.query;

    console.log(email);

    if (!email) {
        return res.status(400).send('Email is required');
    }
    
    const q = 'SELECT * FROM user WHERE user_email = ?';

    db.query(q, [email], (err, data) => {
        if (err) throw err;
        console.log(err);

        if(data.length > 0) {
            return res.json(data);
        } else {
            res.status(404).send('User not found');
        }
    });
});

router.post("/users", (req, res) => {
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

router.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM user WHERE user_id = ?";
    
    db.query(q, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been deleted successfully");
    });
});

router.put("/users/:id", (req, res) => {
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

export default router;