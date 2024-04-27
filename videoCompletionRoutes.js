import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.get("/", (req, res) => {
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

export default router;
