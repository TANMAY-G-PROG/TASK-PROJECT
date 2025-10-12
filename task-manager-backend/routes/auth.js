// routes/auth.js

const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { body } = require('express-validator');
const passport = require('passport');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// --- Standard Auth Routes ---
router.post('/register', [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], register);

router.post('/login', [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
], login);

router.get('/me', authenticateToken, getMe);

// --- GitHub Auth Routes ---

// Step 1: User clicks "Connect". We save their ID and redirect them to GitHub.
router.get('/github', authenticateToken, (req, res, next) => {
    req.session.localUserId = req.user.userId; 
    passport.authenticate('github', { scope: ['user:email', 'repo'] })(req, res, next);
});

// Step 2: GitHub redirects back here. Passport runs the logic from passport-setup.js.
// On success or failure, it automatically redirects to the correct frontend URL.
router.get(
    '/github/callback',
    passport.authenticate('github', { 
        successRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?github=success`,
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?github=fail`
    })
);

module.exports = router;