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
  process.env.FRONTEND_URL,
  `${process.env.FRONTEND_URL}/`,
  "http://localhost:5173" // For local development
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions
});

app.set('trust proxy', 1);

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

// FIX: Let connect-pg-simple create the table automatically
app.use(session({
    store: new pgSession({
        pool: pgPool,                
        tableName: 'user_sessions',  // This table will be auto-created
        createTableIfMissing: true   // ADD THIS LINE - auto-creates the table
    }),
    secret: process.env.SESSION_SECRET || 'a secret key',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
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
// Start the server using the httpServer
httpServer.listen(PORT, () => console.log(`💻 Server with Sockets listening on port ${PORT}`));