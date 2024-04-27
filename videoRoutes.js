import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.post("/", (req, res) => {
  const { module_id, video_title, video_url } = req.body;
  const query =
    "INSERT INTO `Video` (`module_id`, `video_title`, `video_url`) VALUES (?, ?, ?)";

  db.query(query, [module_id, video_title, video_url], (error, results) => {
    if (error) return res.status(500).send("Failed to insert video.");
    res.status(201).send(`Video added with ID: ${results.insertId}`);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM `Video` WHERE `video_id` = ?";

  db.query(query, [id], (error, results) => {
    if (error) return res.status(500).send("Failed to fetch video.");
    if (results.length === 0) return res.status(404).send("Video not found.");
    res.status(200).json(results[0]);
  });
});

router.get("/completed", (req, res) => {
  const { user_id } = req.query;

  db.query(
    "SELECT video_id FROM Video_Completions WHERE user_id = ? ORDER BY completed_on DESC",
    [user_id],
    (err, results) => {
      if (err) throw err;

      res.json(results);
    },
  );
});

router.get("/", (req, res) => {
  const { courseId, moduleId } = req.query;

  if (!courseId || !moduleId) {
    return res.status(400).send("Both courseId and moduleId are required.");
  }

  const query = `
      SELECT v.video_id, v.module_id, v.video_title, v.video_url
      FROM Video v
      JOIN course_module cm ON v.module_id = cm.module_id
      WHERE cm.course_id = ? AND cm.module_id = ?`;

  db.query(query, [courseId, moduleId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).send("Failed to fetch videos.");
    }
    res.status(200).json(results);
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { module_id, video_url } = req.body;
  const query =
    "UPDATE `Video` SET `module_id` = ?, `video_url` = ? WHERE `video_id` = ?";

  db.query(query, [module_id, video_url, id], (error, results) => {
    if (error) return res.status(500).send("Failed to update video.");
    if (results.affectedRows === 0)
      return res.status(404).send("Video not found.");
    res.status(200).send("Video updated successfully.");
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM `Video` WHERE `video_id` = ?";

  db.query(query, [id], (error, results) => {
    if (error) return res.status(500).send("Failed to delete video.");
    if (results.affectedRows === 0)
      return res.status(404).send("Video not found.");
    res.status(200).send("Video deleted successfully.");
  });
});

export default router;
