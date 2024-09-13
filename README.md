# Pursuit LMS System

Pursuit Learning Management System (LMS) is a web-based platform designed to simplify the management and delivery of educational content. It provides features for Trainers, Trainees, and Super Users, ensuring a seamless experience in course creation, content delivery, performance tracking, and user management.

## Table of Contents
- [Introduction](#introduction)
- [User Roles](#user-roles)
- [System Features](#system-features)
  - [Trainer Features](#trainer-features)
  - [Trainee Features](#trainee-features)
  - [Super User Features](#super-user-features)
- [Non-functional Requirements](#non-functional-requirements)
- [System Architecture](#system-architecture)
- [Diagrams](#diagrams)
- [Conclusion](#conclusion)

## Introduction

The Pursuit LMS is a platform for educational institutions, businesses, and organizations to create, manage, and track learning modules. It is structured around three main user roles:
- **Trainer**: Manages courses and trainees.
- **Trainee**: Engages with the provided learning material.
- **Super User**: Manages overall system operations, including trainers and trainees.

## User Roles

1. **Trainer**
   - Responsible for creating courses, modules, quizzes, and managing trainee progress.
2. **Trainee**
   - Accesses and completes assigned courses and quizzes.
3. **Super User**
   - Administrative privileges for user and course management.

## System Features

### Trainer Features
- **Add Trainee**: Assign trainees to specific courses.
- **Create Courses**: Develop courses composed of educational modules and quizzes.
- **Create Modules**: Add content (videos, documents) within courses.
- **Create Quizzes**: Develop and assign quizzes to trainees.
- **Change Password**: Use OTP verification to reset passwords.
- **View Performance Reports**: Review trainee progress and performance.

### Trainee Features
- **Access Courses**: View and engage with assigned courses.
- **View Modules**: Follow course modules sequentially.
- **Complete Modules**: Finish current modules to unlock the next ones.
- **Take Quizzes**: Participate in quizzes related to completed modules.
- **View Performance**: Track personal progress and results.

### Super User Features
- **Add Users**: Add trainers, trainees, and other super users.
- **Manage Users**: Edit and delete user accounts.
- **Data Segregation**: Maintain separate data for trainers, trainees, and super users.

## Non-functional Requirements

- **Security**: Ensure secure authentication and authorization.
- **Scalability**: Support an increasing number of users, courses, and content.
- **Performance**: Handle multiple concurrent users with minimal latency.
- **Usability**: Provide an intuitive and user-friendly interface.
- **Reliability**: Ensure system reliability with minimal downtime and robust error handling.

## System Architecture

The LMS follows a client-server architecture, including:

- **Backend**: Built with Node.js for server-side logic and MySQL for database management.
- **Frontend**: Developed using HTML, CSS, and JavaScript, with frameworks like React.js and Express.js to create dynamic user interfaces.

## Diagrams

- **ER Diagram**: [To be added]
- **DFD Diagram**: [To be added]

## Conclusion

The Pursuit LMS provides a comprehensive platform for managing and delivering educational content effectively. With a focus on scalability, security, and reliability, it caters to the needs of trainers, trainees, and administrators, ensuring an efficient and seamless learning experience.
