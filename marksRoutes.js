import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.post("/", (req, res) => {
  const q = "Insert into Marks(`quiz_id`, `user_id`, `marks`) values (?)";
  const values = [req.body.quiz_id, req.body.user_id, req.body.marks];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Marks has been added Successfully");
  });
});

router.get("/:quizId", (req, res) => {
  const quiz_id = req.params.quizId;
  const q =
    "Select u.user_name, m.marks from Marks m join user u on u.user_id = m.user_id where m.quiz_id = ?";

  db.query(q, [quiz_id], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/", (req, res) => {
  const { user_id, quiz_id } = req.query;

  db.query(
    "SELECT * FROM Marks WHERE user_id = ? AND quiz_id = ?",
    [user_id, quiz_id],
    (err, data) => {
      if (err) throw err;
      return res.json(data);
    },
  );
});

export default router;
