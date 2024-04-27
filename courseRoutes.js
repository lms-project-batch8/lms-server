import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.get("/all", (req, res) => {
  db.query("SELECT * FROM courses", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.post("/", async (req, res) => {
  const { name, description, modules, trainer_id } = req.body;

  try {
    let totalVideos = 0;

    const courseQuery = `INSERT INTO courses (course_title, course_description, video_count, trainer_id) VALUES (?, ?, ?, ?)`;
    const courseParams = [name, description, totalVideos, trainer_id];
    db.query(courseQuery, courseParams, (courseError, courseResult) => {
      if (courseError) {
        console.error(courseError);
        return res.status(500).json({ message: "Error creating course" });
      }

      const courseId = courseResult.insertId;

      const createModulesPromises = modules.map((module) => {
        return new Promise((resolve, reject) => {
          const moduleQuery = `INSERT INTO course_module (course_id, module_name) VALUES (?, ?)`;
          const moduleParams = [courseId, module.title];
          db.query(moduleQuery, moduleParams, (moduleError, moduleResult) => {
            if (moduleError) {
              reject(moduleError);
              return;
            }

            const moduleId = moduleResult.insertId;

            const createVideosPromises = module.videos.map((video) => {
              return new Promise((resolveVideo, rejectVideo) => {
                const videoQuery = `INSERT INTO course_videos (module_id, video_title, video_url) VALUES (?, ?, ?)`;
                const videoParams = [moduleId, video.title, video.url];
                db.query(videoQuery, videoParams, (videoError) => {
                  if (videoError) {
                    rejectVideo(videoError);
                    return;
                  }
                  totalVideos++;
                  resolveVideo();
                });
              });
            });

            Promise.all(createVideosPromises)
              .then((createdVideos) =>
                resolve({ ...module, videos: createdVideos }),
              )
              .catch(reject);
          });
        });
      });

      Promise.all(createModulesPromises)
        .then(async (createdModules) => {
          await db.query(
            `UPDATE courses SET video_count = ? WHERE course_id = ?`,
            [totalVideos, courseId],
          );
          res.json({
            message: "Course created successfully!",
            course: { id: courseId, ...req.body },
            video_count: totalVideos,
            modules: createdModules,
          });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: "Error creating course" });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating course" });
  }
});

router.get("/", (req, res) => {
  const query = `
    SELECT c.course_id, c.course_title, c.course_description, c.video_count, c.trainer_id, m.module_id, m.module_name, v.video_id, v.video_title, v.video_url
    FROM courses c
    LEFT JOIN course_module m ON c.course_id = m.course_id
    LEFT JOIN course_videos v ON m.module_id = v.module_id
  `;

  db.query(query, (error, results) => {
    if (error) {
      console.error("Failed to retrieve data:", error);
      return res.status(500).send("Internal Server Error");
    }

    const courses = {};
    results.forEach((row) => {
      if (!courses[row.course_id]) {
        courses[row.course_id] = {
          course_id: row.course_id,
          course_title: row.course_title,
          course_description: row.course_description,
          video_count: row.video_count,
          trainer_id: row.trainer_id,
          modules: {},
        };
      }

      if (row.module_id && !courses[row.course_id].modules[row.module_id]) {
        courses[row.course_id].modules[row.module_id] = {
          module_id: row.module_id,
          module_name: row.module_name,
          videos: [],
        };
      }

      if (row.video_id) {
        courses[row.course_id].modules[row.module_id].videos.push({
          video_id: row.video_id,
          video_title: row.video_title,
          video_url: row.video_url,
        });
      }
    });

    res.json(
      Object.values(courses).map((course) => ({
        ...course,
        modules: Object.values(course.modules),
      })),
    );
  });
});

router.get("/:id", (req, res) => {
  const course_id = req.params.id;

  const query = `
      SELECT c.course_id, c.course_title, c.course_description, c.video_count, m.module_id, m.module_name, v.video_id, v.video_title, v.video_url
      FROM courses c
      LEFT JOIN course_module m ON c.course_id = m.course_id
      LEFT JOIN course_videos v ON m.module_id = v.module_id
      where c.course_id = ?
    `;

  db.query(query, [course_id], (error, results) => {
    if (error) {
      console.error("Failed to retrieve data:", error);
      return res.status(500).send("Internal Server Error");
    }

    const courses = {};
    results.forEach((row) => {
      if (!courses[row.course_id]) {
        courses[row.course_id] = {
          course_id: row.course_id,
          course_title: row.course_title,
          course_description: row.course_description,
          video_count: row.video_count,
          modules: {},
        };
      }

      if (row.module_id && !courses[row.course_id].modules[row.module_id]) {
        courses[row.course_id].modules[row.module_id] = {
          module_id: row.module_id,
          module_name: row.module_name,
          videos: [],
        };
      }

      if (row.video_id) {
        courses[row.course_id].modules[row.module_id].videos.push({
          video_id: row.video_id,
          video_title: row.video_title,
          video_url: row.video_url,
        });
      }
    });

    res.json(
      Object.values(courses).map((course) => ({
        ...course,
        modules: Object.values(course.modules),
      })),
    );
  });
});

// router.get('/:id', (req, res) => {
//     const course_id = req.params.id;

//     const sqlQuery = `
//         SELECT
//             c.course_id,
//             c.course_title,
//             c.course_desc,
//             c.trainer_id,
//             c.created_at,
//             cm.cm_id,
//             cm.course_id AS cm_course_id,
//             cm.cm_name,
//             v.video_id,
//             v.cm_id AS v_cm_id,
//             v.video_url
//         FROM
//             courses c
//         LEFT JOIN
//             course_module cm ON c.course_id = cm.course_id
//         LEFT JOIN
//             Video v ON cm.cm_id = v.cm_id
//         WHERE c.course_id = ?;
//     `;

//     db.query(sqlQuery, [course_id], (err, data) => {
//         if (err) return res.json(err);

//         const courses = data.reduce((acc, row) => {
//             let course = acc.find(c => c.course_id === row.course_id);
//             if (!course) {
//                 course = {
//                     course_id: row.course_id,
//                     course_title: row.course_title,
//                     course_desc: row.course_desc,
//                     trainer_id: row.trainer_id,
//                     created_at: row.created_at,
//                     c_modules: [],
//                 };
//                 acc.push(course);
//             }

//             let c_module = course.c_modules.find(c => c.cm_id === row.cm_id);
//             if (!c_module) {
//                 c_module = {
//                     cm_id: row.cm_id,
//                     course_id: row.cm_course_id,
//                     cm_name: row.cm_name,
//                     videos: [],
//                 };
//                 course.c_modules.push(c_module);
//             }

//             if (row.video_id) {
//                 const video = {
//                     video_id: row.video_id,
//                     cm_id: row.v_cm_id,
//                     video_url: row.video_url,
//                 };
//                 c_module.videos.push(video);
//             }

//             return acc;
//         }, []);

//         return res.json(courses);
//     });
// });

// // Create a new course
// router.post('/', (req, res) => {
//     const q = "INSERT INTO courses (`trainer_id`, `course_title`, `course_desc`) VALUES (?, ?, ?)";
//     const values = [
//         req.body.trainer_id,
//         req.body.course_title,
//         req.body.course_desc,
//     ];

//     db.query(q, values, (err, data) => {
//         if (err) return res.json(err);

//         const newCourseId = data.insertId;

//         return res.json({
//             message: "Course created successfully",
//             courseId: newCourseId
//         });
//     });
// });

// // Update a course
// router.put('/', (req, res) => {
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

// // Delete a course
// router.delete('/:id', (req, res) => {
//     const course_id = req.params.id;
//     const q = "DELETE FROM courses WHERE course_id = ?";
//     db.query(q, [course_id], (err, data) => {
//         if (err) return res.json(err);
//         return res.json("Course has been deleted successfully");
//     });
// });

export default router;
