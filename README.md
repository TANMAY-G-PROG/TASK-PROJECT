🚀 Secure Multi-User Task Manager

A full-stack, secure, and collaborative to-do list platform where multiple users can create, assign, and track tasks. This project is built with a modern tech stack featuring React for the frontend and a Node.js/Express REST API for the backend.!

✨ Key Features
Secure JWT Authentication: Employs JSON Web Tokens for secure user login and session management.

Role-Based Access Control: Differentiates between USER and ADMIN roles, paving the way for advanced permission handling.

Full CRUD Functionality: Users can Create, Read, Update, and Delete their own tasks.

RESTful API: A well-structured backend API with clear, logical endpoints.

Responsive UI: A clean, modern, and responsive user interface built with React and styled with Tailwind CSS.

🛠️ Tech Stack
Frontend	Backend	Database
![React Badge] React	![Node.js Badge] Node.js	![PostgreSQL Badge] PostgreSQL
![Tailwind CSS Badge] Tailwind CSS	![Express.js Badge] Express	![Prisma Badge] Prisma ORM
![Vite Badge] Vite	![JWT Badge] JSON Web Token	
![Axios Badge] Axios	![Bcrypt Badge] Bcrypt.js	

Export to Sheets
📂 Project Structure
The project is organized in a monorepo structure with two main directories:

/
├── task-manager-backend/   # Contains the Node.js, Express, and Prisma API
└── task-manager-frontend/  # Contains the React and Tailwind CSS client
🏁 Getting Started
Follow these instructions to get the project up and running on your local machine.

Prerequisites
Make sure you have the following installed on your system:

Node.js (v18.x or later recommended)

PostgreSQL

Git

Installation & Setup
Clone the Repository

Bash

git clone https://github.com/YOUR_USERNAME/task-manager-app.git
cd task-manager-app
Setup the Backend

Bash

# Navigate to the backend directory
cd task-manager-backend

# Install dependencies
npm install

# Create a .env file from the example
# (You can manually rename .env.example or use this command)
cp .env.example .env 
Now, open the .env file and add your PostgreSQL database URL and a JWT secret key.

Code snippet

DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/taskmanager?schema=public"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
Finally, apply the database schema:

Bash

npx prisma migrate dev
Setup the Frontend

Bash

# Navigate to the frontend directory from the root
cd ../task-manager-frontend

# Install dependencies
npm install
Running the Application
You'll need two separate terminals to run both the backend and frontend servers simultaneously.

Run the Backend Server (in the task-manager-backend directory)

Bash

npm run dev
The API will be running on http://localhost:5000.

Run the Frontend Server (in the task-manager-frontend directory)

Bash

npm run dev
The React app will open in your browser at http://localhost:5173.

You can now register a new user and start managing your tasks!

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.
