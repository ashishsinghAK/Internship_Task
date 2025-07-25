# PROJECT NAME(TASK-1) -   🧑‍💼 JOB PORTAL MANAGEMENT SYSTEM

This is the backend of a Job Portal web application built using **Node.js**, **Express**, and **MongoDB**. The backend provides RESTful APIs for user authentication, job creation, application tracking, and admin functionalities.


## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcrypt
- **Environment Management**: dotenv
- **Dev Tools**: Nodemon, Postman


## 🚀 Features

- User Authentication (JWT-based)
- Role-based Access Control (Admin / User)
- Create & Manage Job Listings (Admin)
- Apply to Jobs (User)
- View Applied Jobs

## ▶️ Running the Server
- **npm run dev**


## 📌.env

- DB_URL = your_mongoDB_connection_string
- JWT_SECRET = your_super_secret_key


## Server Running - 

- PORT - 5000
- localhost - http://localhost:5000
- Render Deployed - https://job-management-portal-tfzx.onrender.com


## 📮API Endpoints Overview

**Auth Routes**

- SignUp: POST /api/auth/signup – Register a new user {Feilds: username, email, password}
- Login: POST /api/auth/login – Login user {Feilds: email, password}

**Job Routes**

- Create_Job: POST /api/admin/jobs – Create a new job (Admin only) {Feilds: jobId, title, company, description}
- Get All Jobs: GET /api/get/job – List all jobs
- Get Specific Job: GET /api/get/details – Find a Specific Job {Feilds: jobId}
- Apply for Job: POST /api/apply – Apply for a job {Feilds: jobId}
- Withdraw Application: DELETE /api/delete/application - Withdraw from Applied Job  {Feilds: jobId}
- Get All Applied Jobs: GET /api/getJobs - List all Applied Job by an User(Applicant)


## 🔒 Security & Middlewares

- Protected routes using JWT
- Middleware for role checking (Admin/User)
- Error handling middleware




# PROJECT NAME(TASK-2)  🎫  EVENT MANAGEMENT SYSTEM

A backend API for an **Event Management System**, built using **Node.js**, **Express**, and **MongoDB**. It allows users to:

- Create and manage events(Admin)
- Register or unregister for events
- View available events
- Filter events by date and location


## 🔗 Live API

- 🚧 Deployed:  https://event-management-ume8.onrender.com
- Localhost:  `http://localhost:5000` if running locally.

## 📌.env

- PORT - 5000
- DB_URL = your_mongoDB_connection_string
- JWT_SECRET = your_super_secret_key

## 🧪 API Endpoints

- SignUp:  POST /api/signup  {Feilds: username,email,password}
- Login:  POST /api/signin {Feilds: email, password}
- Event_Creation: POST /api/create/event  {Feilds: title,description,organiser,capacity,address,date}
- Event_Registration: POST /event/:eventId/register
- Get All Events: GET /api/get/events 
- Cancel_Registration: POST //cancel/:eventId/registration


## 📂 Features

- ✅ User authentication (JWT-based)  
- ✅ Create events (with duplicate check)  
- ✅ Register/unregister for events (with capacity limit)  
- ✅ View all scheduled events  
- ✅ Filter events by date and/or location  


## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **Postman** / **Axios** for testing




## 🧑‍💻 Author
- Ashish Kumar Singh
- GitHub: @ashishsinghAK