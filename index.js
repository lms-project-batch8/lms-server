import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QuizRoutes from './quizRoutes.js';
import QuestionRoutes from './questionRoutes.js';
import OptionRoutes from "./optionRoutes.js"
import userRoutes from "./userRoutes.js"

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
app.use("/quiz", QuizRoutes);
app.use("/question", QuestionRoutes);
app.use("/option", OptionRoutes);

app.get("/", (req, res) => {
    res.json("hello this is the backend");
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});