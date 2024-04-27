import express from "express";
const router = express.Router();
import { db } from "./db_connection.js";

router.post("/course", (req, res) => {
  const { trainer_id, trainee_ids, course_id } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to start transaction", error: err });
    }

    const processTrainee = (index) => {
      if (index >= trainee_ids.length) {
        db.commit((commitErr) => {
          if (commitErr) {
            return res.status(500).send({
              message: "Failed to commit transaction",
              error: commitErr,
            });
          }
          return res.send({
            message: "All users assigned to course and progress initialized",
          });
        });
      } else {
        const trainee_name = trainee_ids[index].label;
        console.log(trainee_ids[index].label);

        db.query(
          "SELECT user_id FROM user WHERE user_name = ?",
          [trainee_name],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send({
                  message: "Error getting trainee id from users",
                  error: err,
                });
              });
            }
            const trainee_id = result[0].user_id;
            console.log(trainee_id);

            const assignSql = `
                INSERT INTO assigned (trainer_id, trainee_id, quiz_id, course_id, assigned_at)
                VALUES (?, ?, null, ?, CURRENT_TIMESTAMP)
              `;

            db.query(
              assignSql,
              [trainer_id, trainee_id, course_id],
              (assignErr, assignResult) => {
                console.log(trainee_id);
                if (assignErr) {
                  return db.rollback(() => {
                    res.status(500).send({
                      message: "Error assigning course",
                      error: assignErr,
                    });
                  });
                }

                const videoCountSql = `SELECT video_count FROM courses WHERE course_id = ?`;

                db.query(
                  videoCountSql,
                  [course_id],
                  (videoErr, videoResults) => {
                    if (videoErr || videoResults.length === 0) {
                      return db.rollback(() => {
                        res.status(500).send({
                          message: "Error fetching video count",
                          error: videoErr,
                        });
                      });
                    }

                    const videoCount = videoResults[0].video_count;

                    const progressSql = `
                    INSERT INTO course_progress (user_id, course_id, number_of_videos_done, number_of_videos_total)
                    VALUES (?, ?, 0, ?)
                  `;

                    db.query(
                      progressSql,
                      [trainee_id, course_id, videoCount],
                      (progressErr, progressResult) => {
                        if (progressErr) {
                          return db.rollback(() => {
                            res.status(500).send({
                              message: "Error setting course progress",
                              error: progressErr,
                            });
                          });
                        }

                        processTrainee(index + 1);
                      },
                    );
                  },
                );
              },
            );
          },
        );
      }
    };

    processTrainee(0);
  });
});

router.get("/quizzes", (req, res) => {
  const { user_id } = req.query;

  db.query(
    `SELECT * from assigned a JOIN Quiz q on a.quiz_id = q.quiz_id WHERE a.trainee_id = ? ORDER BY a.assigned_at DESC`,
    [user_id],
    (err, data) => {
      if (err) throw res.json(err);

      return res.json(data);
    },
  );
});

router.get("/courses", (req, res) => {
  const { user_id } = req.query;

  db.query(
    `SELECT * from assigned a JOIN courses c on a.course_id = c.course_id WHERE a.trainee_id = ? ORDER BY a.assigned_at DESC`,
    [user_id],
    (err, data) => {
      if (err) throw res.json(err);

      return res.json(data);
    },
  );
});

router.post("/quiz", (req, res) => {
  const { trainer_id, trainee_ids, quiz_id } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).send({
        message: "Failed to start transaction",
        error: err,
      });
    }

    const processTrainee = (index) => {
      if (index >= trainee_ids.length) {
        db.commit((commitErr) => {
          if (commitErr) {
            return res.status(500).send({
              message: "Failed to commit transaction",
              error: commitErr,
            });
          }
          return res.send({
            message: "All users assigned to quiz",
          });
        });
      } else {
        const trainee_name = trainee_ids[index].label;
        console.log(trainee_ids[index].label);

        db.query(
          "SELECT user_id FROM user WHERE user_name = ?",
          [trainee_name],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).send({
                  message: "Error getting trainee id from users",
                  error: err,
                });
              });
            }
            const trainee_id = result[0].user_id;
            console.log(trainee_id);

            const assignSql = `
                INSERT INTO assigned (trainer_id, trainee_id, quiz_id, course_id, assigned_at)
                VALUES (?, ?, ?, null, CURRENT_TIMESTAMP)
              `;

            db.query(
              assignSql,
              [trainer_id, trainee_id, quiz_id],
              (assignErr, assignResult) => {
                if (assignErr) {
                  return db.rollback(() => {
                    res.status(500).send({
                      message: "Error assigning course",
                      error: assignErr,
                    });
                  });
                }
                processTrainee(index + 1);
              },
            );
          },
        );
      }
    };

    processTrainee(0);
  });
});

export default router;
