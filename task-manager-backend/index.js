require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const session = require('express-session');
const passport = require('passport');
const pg = require('pg'); 
const pgSession = require('connect-pg-simple')(session); 
require('./config/passport-setup');

const app = express();
const httpServer = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL, // e.g., https://flow-board-tawny.vercel.app
  `${process.env.FRONTEND_URL}/`, // The same URL with a trailing slash
  "http://localhost:5173" // For local development
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions
});

// --- Routes ---
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const courseRoutes = require('./routes/courses');
const resourceRoutes = require('./routes/resources');
const projectRoutes = require('./routes/projects');

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render databases
  }
});

app.use(session({
    store: new pgSession({
        pool: pgPool,                
        tableName: 'user_sessions'  
    }),
    secret: process.env.SESSION_SECRET || 'a secret key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

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