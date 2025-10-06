// index.js - CORRECTED

require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// --- Routes ---
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const courseRoutes = require('./routes/courses');
const resourceRoutes = require('./routes/resources');
const projectRoutes = require('./routes/projects');

// --- Middleware ---
app.use(cors());
app.use(express.json());

// Middleware to make the `io` instance available in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Wire up routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/projects', projectRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log(`🔌 New user connected: ${socket.id}`);

  socket.on('join_project', (projectId) => {
    console.log(`User ${socket.id} joined project room: ${projectId}`);
    socket.join(`project-${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log(`👋 User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
// 5. Start the server using the httpServer
httpServer.listen(PORT, () => console.log(`💻 Server with Sockets listening on port ${PORT}`));