import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.get("/", (req, res) => {
  db.query("SELECT * FROM course_module", (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/:course_id", (req, res) => {
  const course_id = req.params.course_id;

  const sqlQuery = `
        SELECT
            cm.module_id,
            cm.course_id,
            cm.module_name,
            v.video_id,
            v.module_id AS video_module_id,
            v.video_url,
            v.video_title
        FROM
            course_module cm
        LEFT JOIN course_videos v ON cm.module_id = v.module_id
        WHERE cm.course_id = ?;
    `;

  db.query(sqlQuery, [course_id], (err, data) => {
    if (err) return res.status(500).json(err);

    const courseModules = data.reduce((acc, row) => {
      let cModule = acc.find((c) => c.module_id === row.module_id);
      if (!cModule) {
        cModule = {
          module_id: row.module_id,
          course_id: row.course_id,
          module_name: row.module_name,
          videos: [],
        };
        acc.push(cModule);
      }

      if (row.video_id) {
        cModule.videos.push({
          video_id: row.video_id,
          module_id: row.video_module_id,
          video_url: row.video_url,
          video_title: row.video_title,
        });
      }

      return acc;
    }, []);

    const response = {
      course_id: course_id,
      modules: courseModules,
    };

    return res.json(response);
  });
});

export default router;
