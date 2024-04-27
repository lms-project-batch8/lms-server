import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import QuizRoutes from "./quizRoutes.js";
import QuestionRoutes from "./questionRoutes.js";
import OptionRoutes from "./optionRoutes.js";
import UserRoutes from "./userRoutes.js";
import { db } from "./db_connection.js";
import OtpRoutes from "./otpRoutes.js";
import MarksRoutes from "./marksRoutes.js";
import CourseRoutes from "./courseRoutes.js";
import CourseModulesRoutes from "./course_moduleRoutes.js";
import VideoRoutes from "./videoRoutes.js";
import assignRoutes from "./assignRoutes.js";
import CourseProgressRoutes from "./course_progressRoutes.js";
import VideoCompletionRoutes from "./videoCompletionRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/search", (req, res) => {
  const { email } = req.query;

  console.log(email);

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const q = "SELECT * FROM user WHERE user_email = ?";

  db.query(q, [email], (err, data) => {
    if (err) throw err;
    console.log(err);

    if (data.length > 0) {
      return res.json(data);
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.use("/users", UserRoutes);
app.use("/quiz", QuizRoutes);
app.use("/question", QuestionRoutes);
app.use("/option", OptionRoutes);
app.use(OtpRoutes);
app.use("/marks", MarksRoutes);
app.use("/courses", CourseRoutes);
app.use("/coursemodules", CourseModulesRoutes);
app.use("/videos", VideoRoutes);
app.use("/assign", assignRoutes);
app.use("/courseprogress", CourseProgressRoutes);
app.use("/video/completed", VideoCompletionRoutes);

app.get("/", (req, res) => {
  res.json("hello this is the backend");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
