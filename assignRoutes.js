import express from 'express';
const router = express.Router();
import { db } from './db_connection.js';

router.get('/', (req, res) => {
    db.query('SELECT * FROM assigned', (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

router.get('/courses', (req, res) => {
    const { trainer_id, trainee_id } = req.query;

    console.log(trainer_id, trainee_id);

    db.query('SELECT * FROM assigned a JOIN courses c ON a.course_id = c.course_id WHERE a.trainer_id = ? AND a.trainee_id = ? AND a.course_id IS NOT NULL', [trainer_id, trainee_id], (err, data) => {
        if (err) return res.json(err);

        return res.json(data);
    })
})

router.get('/quizzes', (req, res) => {
    const { trainer_id, trainee_id } = req.query;

    console.log(trainer_id, trainee_id);

    db.query('SELECT * FROM assigned a JOIN Quiz q ON a.quiz_id = q.quiz_id WHERE a.trainer_id = ? AND a.trainee_id = ? AND a.quiz_id IS NOT NULL', [trainer_id, trainee_id], (err, data) => {
        if (err) return res.json(err);

        return res.json(data);
    })
})

router.get("/quiz", (req, res) => {
    const {trainee_id} = req.query;

    db.query(`SELECT * from assigned a JOIN Quiz q on a.quiz_id = q.quiz_id WHERE a.trainee_id = ?`, [trainee_id], (err, data) => {
        if(err) throw res.json(err);

        return res.json(data);
    })

})


router.get("/course", (req, res) => {
    const {trainee_id} = req.query;

    db.query(`SELECT * from assigned a JOIN courses c on a.course_id = c.course_id WHERE a.trainee_id = ?;`, [ trainee_id ], (err, data) => {
        if(err) throw res.json(err);

        return res.json(data);
    })

})

 
router.post("/", (req, res) => {
    const { trainer_id, data, quiz_id, course_id } = req.body;

    if (!data || !data.length) {
        return res.status(400).json({ error: "No trainers provided" });
    }

    const q = "INSERT INTO assigned (`trainer_id`, `trainee_id`, `quiz_id`, `course_id`) VALUES ?";

    const values = data.map(trainee => [
        trainer_id,
        trainee.value,
        quiz_id,
        course_id
    ]);

    db.query(q, [values], (err) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.json(err);
        }

        return res.json("Trainee successfully assigned to trainers");
    });
});


export default router;