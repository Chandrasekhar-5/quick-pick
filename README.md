# QuickPick Campus

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-Proprietary-red)

Private software. Unauthorized use or redistribution is prohibited.


QuickPick Campus is a multi-tenant food ordering and analytics platform designed for college campuses. The system allows students to order food from campus vendors while enabling vendors and administrators to manage operations and view analytics.

The platform is designed with scalability in mind so that multiple colleges, vendors, and users can operate within the same system while remaining logically isolated.

## Technology Stack

Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)

Frontend

* React.js
* Tailwind CSS
* Vite
* TypeScript
* React Router (v6.4+)

## Repository Structure

quickpick-campus/

backend/
controllers
routes
models
middlewares
config

frontend/
student-frontend
vendor-frontend
admin-frontend

SYSTEM_ARCHITECTURE.md
PROJECT_PROGRESS.md
LICENSE
README.md

## Current Development Status

The Student and Vendor frontends are fully integrated with the backend. Current development is focused on the Admin dashboard and final deployment orchestration.

Completed:

* Authentication system
* Multi-tenant database models
* Vendor and menu APIs
* Order processing system
* Analytics aggregation pipelines
* Global error handling
* Student frontend integration
* Vendor frontend integration

Next Phase:

* Finalize Admin dashboard features
* Deployment preparation

## Local Development Setup

### Prerequisites

* Node.js
* MongoDB Compass or MongoDB Atlas
* Git

### Environment Configuration

Create a `.env` file inside the `backend` directory.

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/quick-pick
JWT_SECRET=your_secret_key
NODE_ENV=development

### Run Backend

cd backend
npm install
npm run dev

Server runs at:

http://localhost:5000

### Run Student Frontend

cd frontend/student-frontend
npm install
npm run dev

Frontend runs at:

http://localhost:3000

### Run Admin Frontend

cd frontend/admin-frontend
npm install
npm run dev

## Testing the Application

Because the Vendor and Admin interfaces are not integrated yet, initial data must be created manually.

Create a College

POST /api/colleges

Example request body:

{
"name": "Example College",
"address": "City"
}

Copy the generated college ID.

Update the frontend register page and replace the placeholder college ID.

Create a Vendor user and vendor shop using the API.

Add menu items using the vendor token.

Once the data is created, students will be able to browse vendors and place orders through the student frontend.

## Maintainer

Chandrasekhar Varri
Backend Lead and Project Coordinator