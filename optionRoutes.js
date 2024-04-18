import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/',(req,res)=>{
    db.query('SELECT * FROM Options',(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

router.post("/", (req, res) => {
    const q = "Insert into Options(question_id,`option_text`, `is_correct`) values (?)" // to provide security
    const values = [
        req.body.question_id,
        req.body.option_text,
        req.body.is_correct
        ];

         // by default we cann't send any data to our express server. to prevent this write in index app.use(express.json)-> allows us to send any json file using client
 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Option has been created Successfully")
    });
})

router.put("/:id", (req, res) => {
    const quiz_id = req.params.id;
    const q = "UPDATE Options SET `question_id` = ?, `option_text` = ?, `is_correct` = ? WHERE option_id = ?"
    const values = [
        req.body.question_id,
        req.body.option_text,
        req.body.is_correct,
    ]

    db.query(q,[...values,option_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Option has been updated Successfully")
    })
})

router.delete("/:id", (req, res) => {
    const option_id = req.params.id;
    const q = "DELETE FROM Options WHERE option_id = ?"
    db.query(q, [option_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Option has been deleted Successfully")
    })
})

export default router;
