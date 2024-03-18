import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/',(req,res)=>{
    db.query('SELECT * FROM Quiz',(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// const sqlQuery = `SELECT
// q.quiz_id AS quiz_id,
// q.title AS title,
// q.description AS description,
// q.duration_minutes AS duration_minutes,
// q.created_at AS created_at,
// qs.question_id AS question_id,
// qs.question_text AS question_text,
// qs.question_type AS question_type,
// qs.created_at AS created_at,
// o.option_id AS option_id,
// o.option_text AS option_text,
// o.is_correct AS is_correct,
// o.created_at AS created_at
// FROM
// Quiz q
// JOIN
// Question qs ON question_id = qs.quiz_id
// JOIN
// Options o ON qs.question_id = o.question_id;`

// router.get('/all',(req,res)=>{
//     db.query(sqlQuery,(err,data) => {
//         if(err) return res.json(err)
//         return res.json(data);
//     })
// })

// const jsonArray = results.map(row => ({
//     QuizID: row.quiz_id,
//     QuizTitle: row.title,
//     QuizDescription: row.description,
//     QuizTimeLimit: row.duration_minutes,
//     QuizCreationDate: row.created_at,
//     QuestionID: row.question_id,
//     QuestionText: row.question_text,
//     OptionID: row.option_id,
//     OptionText: row.option_text,
//     IsOptionCorrect: row.is_correct
//   }));

//   // Print the JSON array
//   console.log(jsonArray);

router.post("/", (req, res) => {
    const q = "Insert into Quiz(`title`, `description`, `duration_minutes`) values (?)"
    const values = [
        req.body.title,
        req.body.description,
        req.body.duration_minutes,
        ];

 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("Quiz has been created Successfully")
    });
})


router.put("/:id", (req, res) => {
    const quiz_id = req.params.id;
    const q = "UPDATE Quiz SET `title` = ?, `description` = ?, `duration_minutes` = ?, `created_at` = ? WHERE quiz_id = ?"
    const values = [
        req.body.title,
        req.body.description,
        req.body.duration_minutes,
        req.body.created_at
    ]

    db.query(q,[...values,quiz_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Quiz has been updated Successfully")
    })
})



router.delete("/:id", (req, res) => {
    const quiz_id = req.params.id;
    const q = "DELETE FROM Quiz WHERE quiz_id = ?"
    db.query(q,[quiz_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Quiz has been deleted Successfully")
    })
})

export default router;
