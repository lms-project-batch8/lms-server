import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/', (req, res) => {
    const sqlQuery = `
        SELECT
            q.quiz_id,
            q.title,
            q.description,
            q.duration_minutes,
            q.created_at AS quiz_created_at,
            qs.question_id,
            qs.question_text,
            qs.question_type,
            qs.created_at AS question_created_at,
            o.option_id,
            o.option_text,
            o.is_correct,
            o.created_at AS option_created_at
        FROM
            Quiz q
        LEFT JOIN
            Question qs ON q.quiz_id = qs.quiz_id
        LEFT JOIN
            Options o ON qs.question_id = o.question_id;
    `;

    db.query(sqlQuery, (err, data) => {
        if (err) return res.json(err);

        const quizzes = data.reduce((acc, row) => {
            let quiz = acc.find(q => q.quiz_id === row.quiz_id);
            if (!quiz) {
                quiz = {
                    quiz_id: row.quiz_id,
                    title: row.title,
                    description: row.description,
                    duration_minutes: row.duration_minutes,
                    created_at: row.quiz_created_at,
                    questions: [],
                };
                acc.push(quiz);
            }

            let question = quiz.questions.find(q => q.question_id === row.question_id);
            if (!question) {
                question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    question_type: row.question_type,
                    created_at: row.question_created_at,
                    options: [],
                };
                quiz.questions.push(question);
            }

            if (row.option_id) {
                const option = {
                    option_id: row.option_id,
                    option_text: row.option_text,
                    is_correct: row.is_correct,
                    created_at: row.option_created_at,
                };
                question.options.push(option);
            }

            return acc;
        }, []);

        return res.json(quizzes);
    });
});

async function createQuestionsWithOptions(questions, quizId) {
    for (const question of questions) {
        const questionInsertQuery = "INSERT INTO Question(quiz_id, question_text) VALUES (?)";
        const questionValues = [
            quizId,
            question.questionText,
        ];

        const questionInsertResult = await new Promise((resolve, reject) => {
            db.query(questionInsertQuery, [questionValues], (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        const questionId = questionInsertResult.insertId;

        for (const optionText of question.options) {
            const optionInsertQuery = "INSERT INTO Options(question_id, option_text, is_correct) VALUES (?)";
            const isCorrect = optionText === question.correctAnswer;
            const optionValues = [questionId, optionText, isCorrect];

            await new Promise((resolve, reject) => {
                db.query(optionInsertQuery, [optionValues], (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            });
        }
    }
}

router.get('/:id', (req, res) => {
    const quizId = req.params.id;
    const sqlQuery = `
        SELECT
            q.quiz_id,
            q.title,
            q.description,
            q.duration_minutes,
            q.created_at AS quiz_created_at,
            qs.question_id,
            qs.question_text,
            qs.question_type,
            qs.created_at AS question_created_at,
            o.option_id,
            o.option_text,
            o.is_correct,
            o.created_at AS option_created_at
        FROM
            Quiz q
        LEFT JOIN
            Question qs ON q.quiz_id = qs.quiz_id
        LEFT JOIN
            Options o ON qs.question_id = o.question_id
        WHERE
            q.quiz_id = ?;
    `;

    db.query(sqlQuery, [quizId], (err, data) => {
        if (err) return res.json({ error: err.message });

        const quiz = data.reduce((acc, row) => {
            if (!acc) {
                acc = {
                    quiz_id: row.quiz_id,
                    title: row.title,
                    description: row.description,
                    duration_minutes: row.duration_minutes,
                    created_at: row.quiz_created_at,
                    questions: [],
                };
            }

            let question = acc.questions.find(q => q.question_id === row.question_id);
            if (!question && row.question_id) {
                question = {
                    question_id: row.question_id,
                    question_text: row.question_text,
                    question_type: row.question_type,
                    created_at: row.question_created_at,
                    options: [],
                };
                acc.questions.push(question);
            }

            if (question && row.option_id) {
                const option = {
                    option_id: row.option_id,
                    option_text: row.option_text,
                    is_correct: row.is_correct,
                    created_at: row.option_created_at,
                };
                question.options.push(option);
            }

            return acc;
        }, null);

        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        return res.json(quiz);
    });
});


router.post("/", async (req, res) => {
    const { quizName, quizDuration, questions } = req.body;
    const quizInsertQuery = "INSERT INTO Quiz(title, duration_minutes) VALUES (?)";
    const quizValues = [quizName, parseInt(quizDuration)];

    db.query(quizInsertQuery, [quizValues], async (err, data) => {
        if (err) return res.json(err);
        const quizId = data.insertId;

        try {
            await createQuestionsWithOptions(questions, quizId);
            res.json({ message: "Quiz, questions, and options created successfully" });
        } catch (error) {
            // Rollback or handle error as necessary
            console.error("Error creating questions/options:", error);
            res.json(error);
        }
    });
});

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
