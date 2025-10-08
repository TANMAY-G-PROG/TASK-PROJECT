// routes/auth.js

const express = require('express');
const { register, login, getMe} = require('../controllers/authController');
const { body } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.post(
    '/register',
    [
        body('name', 'Name is required').notEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    ],
    register
);

router.post(
    '/login',
    [
        body('email', 'Please include a valid email').isEmail(),
        body('password', 'Password is required').exists(),
    ],
    login
);

router.get('/github', authenticateToken, (req, res, next) => {
    // Save the user's local ID in the session before redirecting
    req.session.localUserId = req.user.userId; 
    passport.authenticate('github', { scope: ['user:email', 'repo'] })(req, res, next);
});

// router.get(
//     '/github/callback',
//     passport.authenticate('github', { failureRedirect: '/login' }),
//     async (req, res) => {
//         const localUserId = req.session.localUserId;
//         const { profile, accessToken } = req.user; // From passport's 'done' function

//         try {
//             // Link the GitHub account to the locally logged-in user
//             await prisma.user.update({
//                 where: { id: localUserId },
//                 data: {
//                     githubId: profile.id,
//                     githubAccessToken: accessToken,
//                 },
//             });
//             // Successful authentication, redirect to a frontend page.
//             // We can add a query param to show a success message.
//             res.redirect('http://localhost:5173/dashboard?github=success');
//         } catch (error) {
//             console.error("Failed to link GitHub account:", error);
//             res.redirect('http://localhost:5173/dashboard?github=fail');
//         }
//     }
// );

router.get(
    '/github/callback',
    passport.authenticate('github', { 
        successRedirect: 'http://localhost:5173/dashboard?github=success',
        failureRedirect: 'http://localhost:5173/dashboard?github=fail'
    })
);

router.get('/me', authenticateToken, getMe);

module.exports = router;