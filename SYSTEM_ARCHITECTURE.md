# System Architecture: QuickPick Campus

## System Overview

QuickPick is a multi-tenant MERN stack platform designed to support food ordering across multiple college campuses and vendors.

The system allows students to browse menus, place orders, and track purchases while vendors manage their shops and administrators manage campus-level operations.

## Technology Stack

Database
MongoDB using Mongoose ODM

Backend
Node.js with Express.js

Frontend
React.js with Vite and TypeScript

Authentication
JWT and bcryptjs

## Database Structure

Although MongoDB is a NoSQL database, the system follows a relational design to maintain clear relationships between entities.

Core Entities

College
The root entity representing a campus.

User
Linked to a specific collegeId.
Roles include student, vendor, and admin.

Vendor
Represents a shop within a campus.
Linked to a collegeId and an ownerId.

MenuItem
Linked to a specific vendor.

Order
Represents a completed transaction linking:

userId
vendorId
ordered items

The field priceAtOrder is stored to preserve historical accuracy for analytics.

## Backend Architecture

The backend follows a layered architecture.

Route Layer

Defines API endpoints and applies middleware such as authentication and authorization.

Controller Layer

Handles incoming requests and returns responses to the client.

Controllers remain lightweight and delegate complex logic to services or model operations.

Business Logic Layer

Contains core application logic including order validation, analytics calculations, and data processing.

Data Layer

Mongoose models define schema structure, validation rules, and database queries.

## Security and Authorization

Authentication is handled using JWT tokens.

Protect Middleware

Extracts the JWT token from the Authorization header and attaches the authenticated user to the request.

Authorize Middleware

Ensures that only users with specific roles can access protected endpoints.

Resource-Level Authorization

Controllers verify ownership of resources to prevent unauthorized modifications.

Example

A vendor can only update orders belonging to their own shop.

## Error Handling

The backend uses centralized global error handling.

All unhandled errors are captured and returned in a consistent JSON format.

Example response

{
"message": "Error details",
"stack": "..."
}

## Frontend Architecture

The frontend is separated into three independent React applications.

student-frontend
Handles student ordering experience.

vendor-frontend
Handles shop management and POS functionality.

admin-frontend
Handles platform administration including user and college management.