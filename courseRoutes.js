import express from 'express';
const router = express.Router();
import { db } from './db_connection.js';

// Get all courses
router.get('/', (req, res) => {
    db.query('SELECT * FROM courses', (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


// testing of all course related data ...

// router.get('/all', (req, res) => {
//     const sqlQuery = `
//         SELECT
//             c.course_id,
//             c.trainee_id,
//             c.course_title,
//             c.course_desc,
//             c.course_content,
//             c.trainer_id,
//             cm.cm_id,
//             cm.course_id,
//             cm.cm_name,
//             v.video_id,
//             v.cm_id,
//             v.video_url
//         FROM
//             courses c
//         LEFT JOIN
//             course_module cm ON c.course_id = cm.course_id
//         LEFT JOIN
//             Video v ON cm.cm_id = v.cm_id;
//     `;
 
//     db.query(sqlQuery, (err, data) => {
//         if (err) return res.json(err);
 
//         const coursess = data.reduce((acc, row) => {
//             let course = acc.find(c => c.course.course_id === row.course_id);
//             if (!course) {
//                 course = {
//                     course_id: row.course_id,
//                     trainee_id: row.trainee_id,
//                     course_title: row.course_title,
//                     course_desc: row.course_desc,
//                     course_content: row.course_content,
//                     trainer_id: row.trainer_id,
//                     c_modules: [],
//                 };
//                 acc.push(course);
//             }
 
//             let c_module = course.c_modules.find(c => c.cm_id === row.cm_id);
//             if (!c_module) {
//                 c_module = {
//                     cm_id: row.cm_id,
//                     course_id: row.course_id,
//                     cm_name: row.cm_name,
//                     videos: [],
//                 };
//                 course.c_modules.push(c_module);
//             }
 
//             if (row.video_id) {
//                 const video = {
//                     video_id: row.video_id,
//                     cm_id: row.cm_id,
//                     video_url: row.video_url,
//                 };
//                 c_module.videos.push(video);
//             }
 
//             return acc;
//         }, []);
 
//         return res.json(coursess);
//     });
// });




// // Create a new course
// router.post('/', (req, res) => {
//     const q = "INSERT INTO courses (`trainee_id`, `trainer_id`, `course_title`, `course_desc`,`course_content`) VALUES ( ? ,?, ?, ?,?)";
//     const values = [
//         req.body.trainee_id,
//         req.body.trainer_id,
//         req.body.course_title,
//         req.body.course_desc,
//         req.body.course_content,
//     ];

//     db.query(q, values, (err, data) => {
//         if (err) return res.json(err);
//         return res.json("Course has been created successfully");
//     });
// });


router.get('/all', (req, res) => {
    const sqlQuery = `
        SELECT
            c.course_id,
            c.course_title,
            c.course_desc,
            c.trainer_id,
            c.created_at,
            cm.cm_id,
            cm.course_id AS cm_course_id,
            cm.cm_name,
            v.video_id,
            v.cm_id AS v_cm_id,
            v.video_url
        FROM
            courses c
        LEFT JOIN
            course_module cm ON c.course_id = cm.course_id
        LEFT JOIN
            Video v ON cm.cm_id = v.cm_id;
    `;
 
    db.query(sqlQuery, (err, data) => {
        if (err) return res.json(err);
 
        const courses = data.reduce((acc, row) => {
            let course = acc.find(c => c.course_id === row.course_id);
            if (!course) {
                course = {
                    course_id: row.course_id,
                    course_title: row.course_title,
                    course_desc: row.course_desc,
                    trainer_id: row.trainer_id,
                    created_at: row.created_at,
                    c_modules: [],
                };
                acc.push(course);
            }
 
            let c_module = course.c_modules.find(c => c.cm_id === row.cm_id);
            if (!c_module) {
                c_module = {
                    cm_id: row.cm_id,
                    course_id: row.cm_course_id, 
                    cm_name: row.cm_name,
                    videos: [],
                };
                course.c_modules.push(c_module);
            }
 
            if (row.video_id) {
                const video = {
                    video_id: row.video_id,
                    cm_id: row.v_cm_id,
                    video_url: row.video_url,
                };
                c_module.videos.push(video);
            }
 
            return acc;
        }, []);
 
        return res.json(courses); 
    });
});

router.get('/:id', (req, res) => {
    const course_id = req.params.id;

    const sqlQuery = `
        SELECT
            c.course_id,
            c.course_title,
            c.course_desc,
            c.trainer_id,
            c.created_at,
            cm.cm_id,
            cm.course_id AS cm_course_id,
            cm.cm_name,
            v.video_id,
            v.cm_id AS v_cm_id,
            v.video_url
        FROM
            courses c
        LEFT JOIN
            course_module cm ON c.course_id = cm.course_id
        LEFT JOIN
            Video v ON cm.cm_id = v.cm_id
        WHERE c.course_id = ?;
    `;
 
    db.query(sqlQuery, [course_id], (err, data) => {
        if (err) return res.json(err);
 
        const courses = data.reduce((acc, row) => {
            let course = acc.find(c => c.course_id === row.course_id);
            if (!course) {
                course = {
                    course_id: row.course_id,
                    course_title: row.course_title,
                    course_desc: row.course_desc,
                    trainer_id: row.trainer_id,
                    created_at: row.created_at,
                    c_modules: [],
                };
                acc.push(course);
            }
 
            let c_module = course.c_modules.find(c => c.cm_id === row.cm_id);
            if (!c_module) {
                c_module = {
                    cm_id: row.cm_id,
                    course_id: row.cm_course_id, 
                    cm_name: row.cm_name,
                    videos: [],
                };
                course.c_modules.push(c_module);
            }
 
            if (row.video_id) {
                const video = {
                    video_id: row.video_id,
                    cm_id: row.v_cm_id,
                    video_url: row.video_url,
                };
                c_module.videos.push(video);
            }
 
            return acc;
        }, []);
 
        return res.json(courses); 
    });
});


// Create a new course
router.post('/', (req, res) => {
    const q = "INSERT INTO courses (`trainer_id`, `course_title`, `course_desc`) VALUES (?, ?, ?)";
    const values = [
        req.body.trainer_id,
        req.body.course_title,
        req.body.course_desc,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        
        const newCourseId = data.insertId;

        return res.json({
            message: "Course created successfully",
            courseId: newCourseId
        });
    });
});



// Update a course
router.put('/', (req, res) => {
    const q = "INSERT INTO courses (`trainee_id`, `trainer_id`, `course_title`, `course_desc`,`course_content`) VALUES ( ? ,?, ?, ?,?)";
    const values = [
        req.body.trainee_id,
        req.body.trainer_id,
        req.body.course_title,
        req.body.course_desc,
        req.body.course_content,
    ];

    db.query(q, values, (err, data) => {
        if (err) return res.json(err);
        return res.json("Course has been created successfully");
    });
});



// Delete a course
router.delete('/:id', (req, res) => {
    const course_id = req.params.id;
    const q = "DELETE FROM courses WHERE course_id = ?";
    db.query(q, [course_id], (err, data) => {
        if (err) return res.json(err);
        return res.json("Course has been deleted successfully");
    });
});

export default router;


