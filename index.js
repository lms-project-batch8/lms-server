import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Sapta1234#",
    database: "crud"
});

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => { //everytime user come to the main page or home page below msg will be shown as req and res...
    res.json("hello this is the backend"); //response sent to the user
})

app.get("/user", (req, res) => {
    const q = "SELECT * FROM user"
    db.query(q, (err,data) => {
        if(err) return res.json(err)
        return res.json(data)
    })
}) 

//to solve auth problem use in mysql workbench : ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_current_password';

app.post("/user", (req, res) => {
    const q = "Insert into user(`user_id`, `user_name`, `user_password`, `user_email`, `user_role`) values (?)" // to provide security
    const values = [
        req.body.user_id,
        req.body.user_name,
        req.body.user_password,
        req.body.user_email,
        req.body.user_role // body is from postman body->json
        ];

         // by default we cann't send any data to our express server. to prevent this write in index app.use(express.json)-> allows us to send any json file using client
 
    db.query(q, [values], (err, data) => {
        if(err) return res.json(err)
        return res.json("User has been created Successfully")
    });
})

app.delete("/user/:id", (req, res) => {
    const user_Id = req.params.id;
    const q = "DELETE FROM user WHERE user_id = ?"
    db.query(q,[user_Id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("User has been deleted Successfully")
    })
})

app.put("/user/:id", (req, res) => {
    const user_Id = req.params.id;
    const q = "UPDATE user SET `user_name` = ?, `user_password` = ?, `user_email` = ?, `user_role` = ? WHERE user_id = ?"
    const values = [
        req.body.user_name,
        req.body.user_password,
        req.body.user_email,
        req.body.user_role
    ]

    db.query(q,[...values,user_Id], (err, data)=> {
        if(err) return res.json(err)
        return res.json("User has been updated Successfully")
    })
})


app.listen(8080, ()=>{
    console.log("Connected to backend");
}) // to run our app