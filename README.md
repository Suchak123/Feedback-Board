Installation
Prerequisites

Node.js: v18 or higher
npm: v9 or higher
Docker Desktop: Latest version (for Windows)
Git: Latest version

Step 1: Clone/Download Project
cd C:\Users\asus\Desktop
git clone https://github.com/Suchak123/Feedback-Board
cd feedback-board

Step 2: Install Dependencies
npm install

Environment Setup
Create Required Environment Files
1. .env (MongoURL Configuration)
MONGODB_URI=<MONGODB_URI>/feedback_board

Running the Application
- Development Mode
Terminal 1 - Start MongoDB in Docker:
docker-compose -f docker-compose.dev.yml up -d

Terminal 2 - Start Next.js App:
npm run dev

Access:

Frontend: http://localhost:3000
Mongo Express UI: http://localhost:8081
MongoDB: mongodb://localhost:27017

API Routes:

Base URL
http://localhost:3000/api/feedback

Endpoints
1. Get All Feedback
Endpoint: GET /api/feedback

Example:
curl http://localhost:3000/api/feedback

curl http://localhost:3000/api/feedback?status=open

curl http://localhost:3000/api/feedback?sort=upvotes

curl "http://localhost:3000/api/feedback?status=in-progress&sort=upvotes"

Response:
{
  "feedback": [
    {
      "id": "507f1f77bcf86cd799439011",
      "title": "Add dark mode",
      "description": "It would be great to have a dark mode option",
      "status": "open",
      "upvotes": 5,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}

2. Create Feedback
Endpoint: POST /api/feedback
Request Body:
{
  "title": "Add dark mode",
  "description": "It would be great to have a dark mode option for better readability",
  "status": "open"
}

Validation:

title: 3-100 characters (required)
description: 10-500 characters (required)
status: open, in-progress, or done (optional, default: open)

3. Get Single Feedback
Endpoint: GET /api/feedback/:id
Example: 
curl http://localhost:3000/api/feedback/507f1f77bcf86cd799439011

4. Update Feedback
Endpoint: PATCH /api/feedback/:id
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in-progress"
}

5. Delete Feedback
Endpoint: DELETE /api/feedback/:id
Example:
curl -X DELETE http://localhost:3000/api/feedback/507f1f77bcf86cd799439011

6. Upvote Feedback
Endpoint: POST /api/feedback/:id/upvote
Example:
curl -X POST http://localhost:3000/api/feedback/507f1f77bcf86cd799439011/upvote

7. Remove Upvote (Optional)
Endpoint: DELETE /api/feedback/:id/upvote
Example:
curl -X DELETE http://localhost:3000/api/feedback/507f1f77bcf86cd799439011/upvote

Technology Stack

Framework: Next.js 15.1.0 (App Router)
UI Library: React 19.0.0
Language: TypeScript 5
Styling: Tailwind CSS 3.4.1

State Management:

TanStack Query 5.62.2 (server state)
Zustand 5.0.2 (client state)

Backend

Runtime: Node.js 18+
Database: MongoDB 7.0
Validation: Zod 3.24.1
Database Driver: MongoDB Node Driver 6.12.0

DevOps

Containerization: Docker
Orchestration: Docker Compose
DB Admin UI: Mongo Express

Development Tools

Linting: ESLint 9
Package Manager: npm
Version Control: Git

Known Issues

Deployment Issue
Attractive designs

Future Improvements

 Add user authentication (NextAuth.js)
 Add pagination for feedback list
 Add search functionality
 Add real-time updates (WebSockets/Pusher)
 Add email notifications
 Add comments on feedback items