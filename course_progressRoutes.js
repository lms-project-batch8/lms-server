import express from 'express';
const router = express.Router();
import { db } from './db_connection.js';
 
// router.get('/', (req, res) => {
//     db.query('SELECT * FROM course_progress', (err, data) => {
//         if (err) return res.json(err);
//         return res.json(data);
//     });
// });

router.get('/', (req, res) => {
    const { user_id } = req.query;

    db.query('SELECT * FROM course_progress cp JOIN courses c on c.course_id = cp.cm_id WHERE user_id = ?', [ user_id ], (err, data) => {
        if (err) return res.json(err); 
        return res.json(data);
    });
});

router.get('/get', (req, res) => {
    const { user_id, cm_id } = req.query;

    db.query('SELECT * FROM course_progress WHERE cm_id = ? AND user_id = ?', [ cm_id, user_id ], (err, data) => {
        if (err) return res.json(err); 
        return res.json(data);
    });
});


router.post('/', (req, res) => {
    const {user_id, cm_id, course_complition_percentage} = req.body;

    db.query('INSERT INTO course_progress (user_id, cm_id, course_complition_percentage) VALUES (?, ?, ?)', [ user_id, cm_id, course_complition_percentage ], (err, data) => {
        if (err) return res.json(err); 
        return res.json(data);
    });
})

 
router.put('/:id', (req, res) => {
    const cp_id = req.params.id;
    const q = "UPDATE course_progress SET `course_complition_percentage` = ?, `course_progress_details` = ? WHERE `cp_id` = ?";
    const values = [
        req.body.course_progress_details,
        req.body.course_progress_percentage,
        cp_id
    ];
 
    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Course_Progress_percentage has been updated successfully");
    });
});

export default router; 