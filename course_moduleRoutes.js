import express from 'express';
const router = express.Router();
import {db} from './db_connection.js';

router.get('/',(req,res)=>{
    db.query('SELECT * FROM course_module',(err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
})

// router.get('/:id',(req,res)=>{
//     const course_id = req.params.id;

//     db.query('SELECT * FROM course_module where course_id = ?', [course_id], (err,data) => {
//         if(err) return res.json(err)
//         return res.json(data)
//     })
// })

router.get('/:course_id', (req, res) => {
    const course_id = req.params.course_id;

    const sqlQuery = `
        SELECT
            cm.cm_id,
            cm.course_id,
            cm.cm_name,
            v.video_id,
            v.cm_id AS video_cm_id,
            v.video_url,
            v.video_title
        FROM
            course_module cm
        LEFT JOIN
            Video v ON cm.cm_id = v.cm_id
        WHERE cm.course_id = ?;
    `;

    db.query(sqlQuery, [course_id], (err, data) => {
        if (err) return res.status(500).json(err);

        // Using reduce to transform data into structured object
        const courseModules = data.reduce((acc, row) => {
            // Find the current course module in accumulator
            let cModule = acc.find(c => c.cm_id === row.cm_id);
            if (!cModule) {
                cModule = {
                    cm_id: row.cm_id,
                    course_id: row.course_id,
                    cm_name: row.cm_name,
                    videos: []
                };
                acc.push(cModule);
            }

            if (row.video_id) {
                cModule.videos.push({
                    video_id: row.video_id,
                    cm_id: row.video_cm_id,  
                    video_url: row.video_url,
                    video_title: row.video_title,
                });
            }

            return acc;
        }, []);  // Initialize accumulator as an empty array

        // Constructing the response object
        const response = {
            course_id: course_id,
            modules: courseModules
        };

        return res.json(response); 
    });
});

router.post("/", (req, res) => {
    const q = "Insert into course_module(`course_id`,`cm_name`) values (?)" 
    const values = [
        req.body.course_id,
        req.body.cm_name,
        ];

 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        
        const newModuleId = data.insertId;

        return res.json({
            message: "Module created successfully",
            moduleId: newModuleId
        });
    });
})


router.put('/:id', (req, res) => {
    const cm_id = req.params.id;
    const q = "UPDATE course_module SET `course_id` = ? ,`cm_name` = ? WHERE cm_id = ?";
    const values = [
        req.body.course_id, 
        req.body.cm_name, 
         // Assuming req.body.video_url is either a valid URL or null
        cm_id
    ];

    db.query(q, values, (err, data) => {
        if (err) {
            console.error("Error updating course_module:", err);
            return res.status(500).json({ error: "An error occurred while updating video_url" });
        }
        return res.json("Course_module has been updated successfully");
    });
});



router.delete("/:id", (req, res) => {
    const cm_id = req.params.id;
    const q = "DELETE FROM course_module WHERE cm_id = ?"
    db.query(q,[cm_id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("Course_Module has been deleted Successfully")
    })
})

export default router;
