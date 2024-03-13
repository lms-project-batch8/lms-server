CREATE DATABASE crud;
USE crud;

CREATE TABLE user(
user_id INT PRIMARY KEY ,
user_name VARCHAR(50),
user_password VARCHAR(50),
user_email VARCHAR(50),
user_role VARCHAR(50),	
timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);
SELECT * from user;



INSERT INTO user(user_id, user_name, user_password, user_email, user_role)
VALUES
(1,'user00','root','user00@gmail.com','trainee');
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Sapta1234#';

USE crud;
CREATE TABLE question(
question_id INT PRIMARY KEY,
question_title TEXT)
