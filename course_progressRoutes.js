import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.get("/", (req, res) => {
  const { user_id, course_id } = req.query;

  let q = "";
  if (user_id && course_id)
    q =
      "SELECT cp.user_id, c.course_title, cp.number_of_videos_done, cp.number_of_videos_total FROM course_progress cp JOIN courses c ON c.course_id = cp.course_id WHERE cp.user_id = ? AND cp.course_id = ?";
  else
    q =
      "SELECT cp.user_id, c.course_title, cp.number_of_videos_done, cp.number_of_videos_total FROM course_progress cp JOIN courses c ON c.course_id = cp.course_id WHERE cp.user_id = ?";

  db.query(q, [user_id, course_id], (err, result) => {
    if (err) throw err;

    res.json(result);
  });
});

router.put("/", (req, res) => {
    const { user_id, course_id, video_id } = req.query;
  
    db.query(
      "CALL CheckOrInsertCompletion(?, ?, @result); SELECT @result AS result;",
      [user_id, video_id],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: "Database error", details: err });
          throw err;
        }
  
        const isAlreadySeen = results[1][0].result;
  
        if (isAlreadySeen === 0) {
          const q = "UPDATE course_progress SET number_of_videos_done = number_of_videos_done + 1 WHERE user_id = ? AND course_id = ?";
          db.query(q, [user_id, course_id], (err, result) => {
            if (err) {
              res.status(500).json({ error: "Failed to update progress", details: err });
              throw err;
            }
            res.json("Progress Updated successfully");
          });
        } else {
          res.json("No update needed, video already seen");
        }
      },
    );
  });
  
export default router;
