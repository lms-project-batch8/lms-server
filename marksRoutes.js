import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/',(req,res)=>{
    db.query('SELECT * FROM Marks',(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

router.post("/", (req, res) => {
    const q = "Insert into Marks(`quiz_id`, `user_id`,`marks`) values (?)" // to provide security
    const values = [
        req.body.quiz_id,
        req.body.user_id,
        req.body.marks,
        ];
 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Marks has been added Successfully")
    });
});

