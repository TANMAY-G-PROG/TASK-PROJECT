// middleware/auth.js

// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) {
//     return res.status(401).json({ error: 'Authentication token required' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ error: 'Token is invalid or expired' });
//     }
//     req.user = user; 
//     next();
//   });
// };

// module.exports = { authenticateToken };

// middleware/auth.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let token;
  const authHeader = req.headers['authorization'];
  
  // 1. Check for token in the Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } 
  // 2. If not in header, check for token in the query string
  else if (req.query.token) {
    token = req.query.token;
  }

  if (token == null) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token is invalid or expired" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };