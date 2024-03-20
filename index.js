import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import QuizRoutes from './quizRoutes.js';
import QuestionRoutes from './questionRoutes.js';
import OptionRoutes from "./optionRoutes.js"
import UserRoutes from "./userRoutes.js"
import {db} from './db_connection.js';
import OtpRoutes from './otpRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/search", (req, res) => {
    const {email} = req.query;

    console.log(email);

    if (!email) {
        return res.status(400).send('Email is required');
    }
    
    const q = 'SELECT * FROM user WHERE user_email = ?';

    db.query(q, [email], (err, data) => {
        if (err) throw err;
        console.log(err);

        if(data.length > 0) {
            return res.json(data);
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.use("/users", UserRoutes);
app.use("/quiz", QuizRoutes);
app.use("/question", QuestionRoutes);
app.use("/option", OptionRoutes);
app.use(OtpRoutes);

app.get("/", (req, res) => {
    res.json("hello this is the backend");
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});