import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get("/", (req, res) => {
    const q = "SELECT * FROM user";
    db.query(q, (err, data) => {
        if (err) throw err;
        return res.json(data);
    });
});

router.get("/trainees", (req, res) => {
    const q = "SELECT * FROM user where user_role = 'Trainee' or user_role = 'trainee'";
    db.query(q, (err, data) => {
        if (err) throw err;
        return res.json(data);
    });
});

router.get("/:id", (req, res) => {
    const userId = req.params.id;
    const q = "SELECT * FROM user WHERE user_id = ?";
    db.query(q, [userId], (err, data) => {
        if (err) throw err;
        console.log(err);
        return res.json(data);
    });
});

router.post("/", (req, res) => {
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

router.delete("/:id", (req, res) => {
    const userId = req.params.id;
    const q = "DELETE FROM user WHERE user_id = ?";
    
    db.query(q, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been deleted successfully");
    });
});

router.put("/:id", (req, res) => {
    const userId = req.params.id;
    const updateFields = Object.entries(req.body)
        .filter(([_, value]) => value !== undefined) 
        .map(([key, value]) => `${key} = ?`).join(', '); 

    const values = Object.values(req.body).filter(value => value !== undefined);
    values.push(userId);

    if (!updateFields) {
        return res.status(400).json({ error: "No valid fields provided for update." });
    }

    const q = `UPDATE user SET ${updateFields} WHERE user_id = ?`;

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("User has been updated successfully");
    });
});


export default router;