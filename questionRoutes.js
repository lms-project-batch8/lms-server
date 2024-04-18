import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/',(req,res)=>{
    db.query('SELECT * FROM Question',(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

router.post("/", (req, res) => {
    const q = "Insert into Question(`quiz_id`, `question_text`,`question_type`) values (?)" 
    const values = [
        req.body.quiz_id,
        req.body.question_text,
        req.body.question_type,
        ];
 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Question has been created Successfully")
    });
})

router.put("/:id", (req, res) => {
    const question_id = req.params.id;
    const q = "UPDATE Question SET `quiz_id` = ?, `question_text` = ?, `question_type` = ? WHERE question_id = ?"
    const values = [
        req.body.quiz_id,
        req.body.question_text,
        req.body.question_type,
      
    ]

    db.query(q,[...values,question_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Question has been updated Successfully")
    })
})

router.delete("/:id", (req, res) => {
    const question_id = req.params.id;

    const deleteOptionsQuery = "DELETE FROM Options WHERE question_id = ?";
    db.query(deleteOptionsQuery, [question_id], (err, optionsData) => {
        if (err) return res.json(err);

        const deleteQuestionQuery = "DELETE FROM Question WHERE question_id = ?";
        db.query(deleteQuestionQuery, [question_id], (err, questionData) => {
            if (err) return res.json(err);

            return res.json("Question and related options have been deleted successfully");
        });
    });
});


export default router;