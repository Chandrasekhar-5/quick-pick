# QuickPick Campus
# QuickPick Campus (MVP v1.0.0)

![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![License](https://img.shields.io/badge/License-Proprietary-red)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![Status](https://img.shields.io/badge/Status-MVP--Complete-brightgreen)

Private software. Unauthorized use or redistribution is prohibited.
**QuickPick Campus** is a robust, multi-tenant food ordering and analytics ecosystem tailored for university environments. It bridges the gap between students, campus vendors, and university administration through a centralized digital marketplace.

---

QuickPick Campus is a multi-tenant food ordering and analytics platform designed for college campuses. The system allows students to order food from campus vendors while enabling vendors and administrators to manage operations and view analytics.
## 🚀 Key Features

The platform is designed with scalability in mind so that multiple colleges, vendors, and users can operate within the same system while remaining logically isolated.
### 🎓 For Students
- **Seamless Discovery:** Browse all available vendors within your specific campus.
- **Real-time Tracking:** Monitor order status from placement to pickup.
- **Order History:** Full transparency of past transactions.

## Technology Stack
### 🏪 For Vendors
- **Shop Management:** Manage digital menus, pricing, and availability.
- **Live POS System:** Process incoming orders in real-time.
- **Sales Analytics:** Insightful data on daily performance and best-selling items.

Backend
### 🛡️ For Administrators
- **Campus Governance:** Manage college-level settings and user roles.
- **Platform Analytics:** Aggregated data across all vendors on campus.
- **Resource Management:** Onboard new colleges and verify vendor shops.

* Node.js
* Express.js
* MongoDB (Mongoose)
* JSON Web Tokens (JWT)
---

Frontend
## 🏗️ Technical Architecture

* React.js
* Tailwind CSS
* Vite
* TypeScript
* React Router (v6.4+)
The project is built on a **Layered MERN Stack** with a focus on logical isolation (Multi-tenancy).

## Repository Structure
### Logical Multi-tenancy
Every entity (Users, Vendors, Orders) is linked to a `collegeId`. This ensures that even though all campuses share the same database, data is strictly scoped. A student at "College A" cannot see menus or place orders at "College B".

quickpick-campus/
### Backend Design
- **Route Layer:** Endpoint definitions with integrated Auth middleware.
- **Controller Layer:** Lightweight request handling.
- **Business Logic Layer:** Dedicated services for complex validations and price calculations.
- **Data Layer:** Mongoose schemas with strictly defined relational patterns.

backend/
controllers
routes
models
middlewares
config
### Frontend Modularization
Instead of one monolithic app, QuickPick uses **three independent React applications**. This reduces bundle sizes and improves security by physically separating codebases for different user personas.

frontend/
student-frontend
vendor-frontend
admin-frontend
---

SYSTEM_ARCHITECTURE.md
PROJECT_PROGRESS.md
LICENSE
README.md
## 📁 Repository Structure

## Current Development Status
```text
quickpick-campus/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
├── frontend/
│   ├── admin-frontend/
│   ├── student-frontend/
│   └── vendor-frontend/
├── SYSTEM_ARCHITECTURE.md
├── PROJECT_PROGRESS.md
└── README.md
```

The Student and Vendor frontends are fully integrated with the backend. Current development is focused on the Admin dashboard and final deployment orchestration.
---

Completed:
## 🛠️ Local Development Setup

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
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance or Atlas)
- **Git**

* Node.js
* MongoDB Compass or MongoDB Atlas
* Git

### Environment Configuration

Create a `.env` file inside the `backend` directory.

Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/quick-pick
JWT_SECRET=your_secret_key
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Run Backend
### Installation & Execution

cd backend
npm install
npm run dev
1. **Start the API Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *API endpoint:* `http://localhost:5000`

Server runs at:
2. **Start the Student Portal:**
   ```bash
   cd frontend/student-frontend
   npm install
   npm run dev
   ```
   *Web entry:* `http://localhost:3000`

http://localhost:5000
3. **Start the Vendor/Admin Portals (Optional):**
   Repeat the same `npm install` and `npm run dev` steps within the respective `frontend/` subdirectories.

### Run Student Frontend
---

cd frontend/student-frontend
npm install
npm run dev
## 🧪 Getting Started (Manual Data Seeding)

Frontend runs at:
To test the full flow, you first need to seed a campus. Since the Admin UI is for internal governance, follow these steps to bootstrap your local environment:

http://localhost:3000
1. **Create a College:**
   Send a `POST` request to `/api/colleges`
   ```json
   { "name": "Tech University", "address": "Campus Square" }
   ```
2. **Register a User:**
   Use the generated `collegeId` in the registration payload via the Student Frontend.
3. **Add Vendors & Menus:**
   Register a user with the `vendor` role and use the Vendor portal to open a shop and add menu items.

### Run Admin Frontend
---

cd frontend/admin-frontend
npm install
npm run dev
## 📖 Documentation

## Testing the Application
For more details on the project, check the following files:
- **Architecture Guide:** Deep dive into the database design and security patterns.
- **Progress Logs:** Historical context of the development phases.

Because the Vendor and Admin interfaces are not integrated yet, initial data must be created manually.
---

Create a College
## 📄 License & Status

POST /api/colleges
**Proprietary Software.**
Unauthorized use, distribution, or reproduction of this codebase is strictly prohibited.

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
**Maintainer:**
**Chandrasekhar Varri**
*Backend Lead and Project Coordinator*